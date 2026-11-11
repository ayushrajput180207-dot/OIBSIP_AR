var taskInput = document.getElementById("taskInput");
var addButton = document.getElementById("addButton");
var taskList = document.getElementById("taskList");
var emptyMessage = document.getElementById("emptyMessage");

var tasks = [];

function loadTasks() {
  var savedTasks = localStorage.getItem("myTasks");
  if (savedTasks) {
    try {
      tasks = JSON.parse(savedTasks);
    } catch (error) {
      tasks = [];
    }
  }
}

function saveTasks() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function showTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  for (var i = 0; i < tasks.length; i++) {
    var item = createTaskItem(tasks[i], i);
    taskList.appendChild(item);
  }
}

function createTaskItem(task, index) {
  var li = document.createElement("li");

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.onchange = function () {
    toggleTask(index);
  };

  var text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;
  if (task.done) {
    text.className = "task-text completed";
  }

  var editButton = document.createElement("button");
  editButton.className = "edit-button";
  editButton.textContent = "Edit";
  editButton.onclick = function () {
    editTask(index);
  };

  var deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    deleteTask(index);
  };

  li.appendChild(checkbox);
  li.appendChild(text);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  return li;
}

function addTask() {
  var newText = taskInput.value.trim();

  if (newText === "") {
    alert("Please enter a task!");
    return;
  }

  tasks.push({ text: newText, done: false });
  taskInput.value = "";

  saveTasks();
  showTasks();
}

function editTask(index) {
  var newText = prompt("Edit your task:", tasks[index].text);

  if (newText === null) {
    return;
  }

  newText = newText.trim();
  if (newText === "") {
    alert("Task cannot be empty!");
    return;
  }

  tasks[index].text = newText;
  saveTasks();
  showTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  showTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  showTasks();
}

addButton.onclick = addTask;

taskInput.onkeydown = function (event) {
  if (event.key === "Enter") {
    addTask();
  }
};

loadTasks();
showTasks();
