var timeline = gsap.timeline();

timeline.from("header , section", {
  y: -30,
  opacity: 0,
  duration: 2,
  stagger: 0.4,
});

// Elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const countEl = document.getElementById("count");
const emptyEl = document.getElementById("empty");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = [];
let currentFilter = "all";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (!saved) return;
  try {
    todos = JSON.parse(saved);
  } catch {
    todos = [];
  }
}

function updateCount() {
  const total = todos.length;
  countEl.textContent = total === 1 ? "1 task" : `${total} tasks`;
}

function applyFilter(task) {
  if (currentFilter === "active") return !task.completed;
  if (currentFilter === "completed") return task.completed;
  return true;
}

function addTodo(text) {
  const trimmed = text.trim();
  if (trimmed === "") return;

  const newTodo = {
    id: Date.now().toString(),
    text: trimmed,
    completed: false,
  };

  todos.push(newTodo);
  input.value = "";
  saveTodos();
  render();
}

function render() {
  todoList.innerHTML = "";

  // filter first
  const visibleTodos = todos.filter(applyFilter);

  // empty state should be based on FILTERED list
  if (visibleTodos.length === 0) {
    emptyEl.style.display = "block";
  } else {
    emptyEl.style.display = "none";
  }

  visibleTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className =
      "p-3 bg-white rounded shadow flex justify-between items-center";

    // LEFT PART (checkbox + text)
    const left = document.createElement("div");
    left.className = "flex items-center gap-2";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.className = "h-3 w-3";
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      render();
    });

    const textEl = document.createElement("span");
    textEl.textContent = todo.text;
    textEl.className = todo.completed
      ? "line-through text-gray-400"
      : "text-gray-900";

    left.appendChild(checkbox);
    left.appendChild(textEl);

    // DELETE BUTTON
    const delBtn = document.createElement("button");
    delBtn.textContent = "✖";
    delBtn.className =
      "text-sm px-2 py-1 rounded hover:bg-red-100 text-red-500";
    delBtn.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      saveTodos();
      render();
    });

    li.appendChild(left);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });

  updateCount();

  // after the forEach + updateCount()
  gsap.from("#todoList li", {
    y: 10,
    opacity: 0,
    stagger: 0.05,
    duration: 0.25,
    ease: "power1.out",
  });
}

// ADD BUTTON
addBtn.addEventListener("click", () => {
  addTodo(input.value);
});

// ENTER KEY
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo(input.value);
  }
});

// FILTER BUTTONS WORK NOW
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setFilter(btn.dataset.filter);
  });
});

// FILTER HANDLER
function setFilter(filter) {
  if (currentFilter === filter) return;
  currentFilter = filter;

  filterBtns.forEach((btn) => {
    if (btn.dataset.filter === filter) {
      btn.classList.add("bg-black", "text-white");
    } else {
      btn.classList.remove("bg-black", "text-white");
    }
  });

  render();
}

loadTodos();
render();
