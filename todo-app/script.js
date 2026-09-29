const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function render() {
  taskList.innerHTML = "";

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  visibleTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <input class="task-check" type="checkbox" ${task.completed ? "checked" : ""} aria-label="Complete task">
      <span class="task-text"></span>
      <button class="delete" aria-label="Delete task">×</button>
    `;

    li.querySelector(".task-text").textContent = task.text;

    li.querySelector(".task-check").addEventListener("change", () => {
      task.completed = !task.completed;
      saveTasks();
      render();
    });

    li.querySelector(".delete").addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      render();
    });

    taskList.appendChild(li);
  });

  emptyState.style.display = visibleTasks.length ? "none" : "block";

  const remaining = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    text,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  render();
  taskInput.focus();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  render();
});

render();
