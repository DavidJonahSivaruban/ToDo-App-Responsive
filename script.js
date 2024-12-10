// Declare variables to fetch HTML elements
const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUl = document.getElementById('todo-list');
const addButton = document.getElementById('add-button');

// Declare taskList to store tasks (local tasks)
let taskList = [];
let apiTasks = [];  // Store fetched tasks separately

// Fetch tasks from API (only once when the page loads)
async function getTasksFromAPI() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        apiTasks = data.slice(0, 5);  // Limit to first 5 tasks for demonstration (you can adjust this)
        updateTaskList(); // Update task list in the UI
    } catch (error) {
        console.error('Unable to retrieve tasks from API:', error);
    }
}

// Event listener for form submit
todoForm.addEventListener('submit', function (x) {
    x.preventDefault(); // Prevent page from reloading after triggering event (default behaviour)
    addTodo();
});

// Event listener for "Add Task" button
addButton.addEventListener('click', function () {
    addTodo();
});

// Add a new task to taskList
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        // Add to local task list
        const newTask = {
            title: todoText,
            completed: false
        };
        taskList.push(newTask); // Add new task to taskList
        updateTaskList(); // Update task list in UI
        todoInput.value = ""; // Clear input field
    }
}

// Update the displayed task list in the UI
function updateTaskList() {
    todoListUl.innerHTML = ""; // Clear current list

    // Combine API tasks and locally added tasks
    const combinedTasks = [...apiTasks, ...taskList];

    // Loop through combinedTasks and create todo items
    for (let i = 0; i < combinedTasks.length; i++) {
        const todoItem = createTodoItem(combinedTasks[i], i);
        todoListUl.append(todoItem);
    }
}

// Create a single todo item for the list
function createTodoItem(todo, i) {
    const todoId = "todo-" + i;
    const todoLi = document.createElement("li");
    todoLi.className = "todo";
    todoLi.innerHTML = `
        <input type="checkbox" id="${todoId}" ${todo.completed ? 'checked' : ''}>
        <label class="custom-checkbox" for="${todoId}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="transparent" class="bi bi-check2" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
            </svg>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todo.title}
        </label>
        <button class="delete-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--secondary-colour)" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
            </svg>
        </button>`;

    // Add event listener to delete button
    const deleteButton = todoLi.querySelector(".delete-button");
    deleteButton.addEventListener("click", function () {
        if (i >= apiTasks.length) {
            // If task is local, delete it from taskList
            taskList.splice(i - apiTasks.length, 1); // Remove task from local task list
            updateTaskList(); // Re-render the task list after deletion
        } else {
            // If task is from API, remove it from the apiTasks list
            apiTasks.splice(i, 1); // Remove task from apiTasks
            updateTaskList(); // Re-render the task list after deletion
        }
    });

    return todoLi;
}

// Load tasks when the page loads
window.onload = getTasksFromAPI;
