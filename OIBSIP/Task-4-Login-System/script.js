var messageBox = document.getElementById("message");
var loggedOutBox = document.getElementById("loggedOutBox");
var loggedInBox = document.getElementById("loggedInBox");
var welcomeName = document.getElementById("welcomeName");

var registerForm = document.getElementById("registerForm");
var loginForm = document.getElementById("loginForm");
var logoutButton = document.getElementById("logoutButton");

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = type;
}

function showLoggedIn(username) {
  welcomeName.textContent = username;
  loggedOutBox.classList.add("hidden");
  loggedInBox.classList.remove("hidden");
}

function showLoggedOut() {
  loggedInBox.classList.add("hidden");
  loggedOutBox.classList.remove("hidden");
}

function sendRequest(url, method, data) {
  var options = {
    method: method,
    headers: { "Content-Type": "application/json" },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options).then(function (response) {
    return response.json();
  });
}

function showServerError() {
  showMessage(
    "Cannot connect to the server. Is 'node server.js' running?",
    "error",
  );
}

function checkLogin() {
  sendRequest("/me", "GET")
    .then(function (result) {
      if (result.success) {
        showLoggedIn(result.username);
      } else {
        showLoggedOut();
      }
    })
    .catch(showServerError);
}

registerForm.onsubmit = function (event) {
  event.preventDefault();

  var username = document.getElementById("registerUsername").value.trim();
  var password = document.getElementById("registerPassword").value;

  sendRequest("/register", "POST", { username: username, password: password })
    .then(function (result) {
      if (result.success) {
        showMessage(result.message, "success");
        registerForm.reset();
      } else {
        showMessage(result.message, "error");
      }
    })
    .catch(showServerError);
};

loginForm.onsubmit = function (event) {
  event.preventDefault();

  var username = document.getElementById("loginUsername").value.trim();
  var password = document.getElementById("loginPassword").value;

  sendRequest("/login", "POST", { username: username, password: password })
    .then(function (result) {
      if (result.success) {
        showMessage(result.message, "success");
        loginForm.reset();
        showLoggedIn(result.username);
      } else {
        showMessage(result.message, "error");
      }
    })
    .catch(showServerError);
};

logoutButton.onclick = function () {
  sendRequest("/logout", "POST")
    .then(function (result) {
      showMessage(result.message, "success");
      showLoggedOut();
    })
    .catch(showServerError);
};

checkLogin();
