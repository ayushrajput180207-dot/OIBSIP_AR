var http = require("http");
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

var PORT = 3000;

var USERS_FILE = path.join(__dirname, "users.json");

var users = [];
var sessions = {};

var staticFiles = {
  "/": { file: "index.html", type: "text/html; charset=utf-8" },
  "/index.html": { file: "index.html", type: "text/html; charset=utf-8" },
  "/style.css": { file: "style.css", type: "text/css; charset=utf-8" },
  "/script.js": {
    file: "script.js",
    type: "application/javascript; charset=utf-8",
  },
};

function loadUsers() {
  if (fs.existsSync(USERS_FILE)) {
    try {
      users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    } catch (error) {
      console.log("Could not read users.json, starting with an empty list.");
      users = [];
    }
  }
}

function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function findUser(username) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].username.toLowerCase() === username.toLowerCase()) {
      return users[i];
    }
  }
  return null;
}

function sendJson(res, statusCode, data, extraHeaders) {
  var headers = { "Content-Type": "application/json; charset=utf-8" };
  if (extraHeaders) {
    for (var key in extraHeaders) {
      headers[key] = extraHeaders[key];
    }
  }
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
}

function readBody(req, callback) {
  var body = "";

  req.on("data", function (chunk) {
    body = body + chunk;

    if (body.length > 10000) {
      req.destroy();
    }
  });

  req.on("end", function () {
    try {
      callback(JSON.parse(body || "{}"));
    } catch (error) {
      callback(null);
    }
  });
}

function getCookies(req) {
  var cookies = {};
  var cookieHeader = req.headers.cookie;

  if (cookieHeader) {
    var parts = cookieHeader.split(";");
    for (var i = 0; i < parts.length; i++) {
      var pair = parts[i].trim().split("=");
      cookies[pair[0]] = pair[1];
    }
  }
  return cookies;
}

function getLoggedInUser(req) {
  var sessionId = getCookies(req).sessionId;
  if (sessionId && sessions[sessionId]) {
    return sessions[sessionId];
  }
  return null;
}

function handleRegister(req, res) {
  readBody(req, function (data) {
    if (!data) {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid data sent.",
      });
    }

    var username = String(data.username || "").trim();
    var password = String(data.password || "");
    d;
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return sendJson(res, 400, {
        success: false,
        message: "Username must be 3 to 20 characters (letters, numbers or _).",
      });
    }
    if (password.length < 6) {
      return sendJson(res, 400, {
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }
    if (findUser(username)) {
      return sendJson(res, 409, {
        success: false,
        message: "This username is already taken.",
      });
    }

    var salt = crypto.randomBytes(16).toString("hex");
    var hash = hashPassword(password, salt);

    users.push({ username: username, salt: salt, hash: hash });
    saveUsers();

    sendJson(res, 201, {
      success: true,
      message: "Registration successful! You can now log in.",
    });
  });
}

function handleLogin(req, res) {
  readBody(req, function (data) {
    if (!data) {
      return sendJson(res, 400, {
        success: false,
        message: "Invalid data sent.",
      });
    }

    var username = String(data.username || "").trim();
    var password = String(data.password || "");

    var user = findUser(username);
    var passwordIsCorrect = false;

    if (user) {
      var typedHash = Buffer.from(hashPassword(password, user.salt), "hex");
      var savedHash = Buffer.from(user.hash, "hex");
      passwordIsCorrect = crypto.timingSafeEqual(typedHash, savedHash);
    }

    if (!user || !passwordIsCorrect) {
      return sendJson(res, 401, {
        success: false,
        message: "Wrong username or password.",
      });
    }

    var sessionId = crypto.randomBytes(32).toString("hex");
    sessions[sessionId] = user.username;

    sendJson(
      res,
      200,
      { success: true, message: "Login successful!", username: user.username },
      {
        "Set-Cookie":
          "sessionId=" +
          sessionId +
          "; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600",
      },
    );
  });
}

function handleLogout(req, res) {
  var sessionId = getCookies(req).sessionId;
  if (sessionId) {
    delete sessions[sessionId];
  }

  sendJson(
    res,
    200,
    { success: true, message: "You have been logged out." },
    { "Set-Cookie": "sessionId=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0" },
  );
}

function handleMe(req, res) {
  var username = getLoggedInUser(req);
  if (username) {
    sendJson(res, 200, { success: true, username: username });
  } else {
    sendJson(res, 401, { success: false, message: "Not logged in." });
  }
}

function handleStaticFile(url, res) {
  var info = staticFiles[url];

  if (!info) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("404 - Page not found");
  }

  fs.readFile(path.join(__dirname, info.file), function (error, content) {
    if (error) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end("500 - Could not read the file");
    }
    res.writeHead(200, { "Content-Type": info.type });
    res.end(content);
  });
}

var server = http.createServer(function (req, res) {
  var url = req.url.split("?")[0];

  if (req.method === "POST" && url === "/register") {
    handleRegister(req, res);
  } else if (req.method === "POST" && url === "/login") {
    handleLogin(req, res);
  } else if (req.method === "POST" && url === "/logout") {
    handleLogout(req, res);
  } else if (req.method === "GET" && url === "/me") {
    handleMe(req, res);
  } else if (req.method === "GET") {
    handleStaticFile(url, res);
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("405 - Method not allowed");
  }
});

loadUsers();

server.listen(PORT, function () {
  console.log("Server is running!");
  console.log("Open http://localhost:" + PORT + " in your browser.");
  console.log("Press Ctrl + C to stop the server.");
});
