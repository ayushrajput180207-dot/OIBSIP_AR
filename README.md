# OIBSIP Web Development Internship Projects

**Student Name:** Ayush Singh Rajput
**Internship:** OIBSIP (Oasis Infobyte Student Internship Program) - Web Development

This folder contains my four internship projects. All of them are made with
simple HTML, CSS and JavaScript (and Node.js for Task 4).

---

## Project Descriptions

### Task 1 - Calculator
A simple calculator that can do addition, subtraction, multiplication and
division. It has number buttons, a decimal point, a Clear (C) button and an
Equal (=) button. Dividing by zero shows "Error".

### Task 2 - Tribute Page
A simple tribute page about **Dr. A. P. J. Abdul Kalam**. It has his
photograph, a short introduction, birth and education details, important
achievements, a timeline of his life and a famous quote.

### Task 3 - To-Do List App
A to-do list where you can add a task, edit a task, delete a task and mark a
task as completed. The tasks are saved in the browser using `localStorage`,
so they are still there after refreshing the page.

### Task 4 - Login Authentication System
A login system with registration, login and logout. The password is hashed
using the Node.js `crypto` module, and the logged-in user is remembered using
a cookie-based session. Success and error messages are shown on the page.

---

## Technologies Used

| Task | Technologies |
|------|--------------|
| Task 1 - Calculator | HTML, CSS, JavaScript |
| Task 2 - Tribute Page | HTML, CSS |
| Task 3 - To-Do List App | HTML, CSS, JavaScript (localStorage) |
| Task 4 - Login System | HTML, CSS, Vanilla JavaScript, Node.js (built-in modules `http`, `fs`, `path`, `crypto` only) |

---

## Folder Structure

```
OIBSIP/
│
├── README.md
│
├── Task-1-Calculator/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── Task-2-Tribute-Page/
│   ├── index.html
│   ├── style.css
│   └── kalam.jpg        (add this photo yourself - see Task 2 below)
│
├── Task-3-To-Do-App/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── Task-4-Login-System/
    ├── index.html
    ├── style.css
    ├── script.js
    └── server.js
```

---

## Installation Instructions

- **Tasks 1, 2 and 3** need nothing to install. You only need a web browser
  (Chrome, Edge, Firefox, etc.).
- **Task 4** needs **Node.js** (version 14 or newer). Download it from
  https://nodejs.org and install it. To check that it is installed, open a
  terminal and run:

  ```
  node --version
  ```

  No `npm install` is needed because Task 4 uses only built-in Node.js modules.

---

## How to Run Each Project

### Task 1 - Calculator
1. Open the folder `Task-1-Calculator`.
2. Double-click `index.html` to open it in your browser.

### Task 2 - Tribute Page
1. Save a photograph of Dr. A. P. J. Abdul Kalam in the folder
   `Task-2-Tribute-Page` with the file name **`kalam.jpg`**.
2. Double-click `index.html` to open it in your browser.

### Task 3 - To-Do List App
1. Open the folder `Task-3-To-Do-App`.
2. Double-click `index.html` to open it in your browser.
3. Add some tasks and refresh the page - the tasks stay saved.

### Task 4 - Login System (using Node.js)
1. Open a terminal (Command Prompt, PowerShell or Terminal).
2. Go into the Task 4 folder:

   ```
   cd OIBSIP/Task-4-Login-System
   ```

3. Start the server:

   ```
   node server.js
   ```

4. You will see this message in the terminal:

   ```
   Server is running!
   Open http://localhost:3000 in your browser.
   ```

5. Open **http://localhost:3000** in your browser.
   (Do not double-click `index.html` for this task - it must be opened
   through the server, otherwise login and cookies will not work.)
6. Register a new user, then log in with the same username and password.
   Click **Logout** to log out.
7. To stop the server, press `Ctrl + C` in the terminal.

---

## How Task 4 Works (short explanation)

1. **Register:** the browser sends the username and password to the server.
   The server creates a random *salt*, hashes the password with
   `crypto.scryptSync()` and saves only the username, salt and hash in
   `users.json`. The real password is never saved.
2. **Login:** the server hashes the typed password with the saved salt and
   compares it with the saved hash. If they match, it creates a random
   session id using `crypto.randomBytes()`.
3. **Session:** the session id is sent to the browser as a cookie. The
   browser sends this cookie with every request, so the server knows who is
   logged in.
4. **Logout:** the server deletes the session and removes the cookie.

---

Made by Ayush Singh Rajput for the OIBSIP Web Development Internship.