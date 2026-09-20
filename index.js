const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.getElementById("filterButtons");
const clearCompleted = document.getElementById("clearCompleted");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasks} Task${activeTasks !== 1 ? "s" : ""} Left`;
}

function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    let filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.text.toLowerCase().includes(searchText);

        if (currentFilter === "active") {
            return !task.completed && matchesSearch;
        }

        if (currentFilter === "completed") {
            return task.completed && matchesSearch;
        }

        return matchesSearch;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", () => {

            const updatedTask = prompt(
                "Edit Task:",
                task.text
            );

            if (updatedTask !== null) {

                const trimmed = updatedTask.trim();

                if (trimmed !== "") {

                    task.text = trimmed;

                    saveTasks();
                    renderTasks();
                }
            }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {

            tasks = tasks.filter(t => t.id !== task.id);

            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });

    updateTaskCount();
}

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.unshift(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
        addTask();
    }

});

searchInput.addEventListener("input", renderTasks);

filterButtons.addEventListener("click", (e) => {

    if (e.target.tagName !== "BUTTON") return;

    currentFilter = e.target.dataset.filter;

    document.querySelectorAll("#filterButtons button")
        .forEach(btn => btn.classList.remove("active"));

    e.target.classList.add("active");

    renderTasks();

});

clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();

});

const themeToggle = document.getElementById("themeBtn");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
});
renderTasks();
