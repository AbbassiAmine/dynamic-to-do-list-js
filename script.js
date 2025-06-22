// Wait for the DOM to fully load before setting up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Function to load tasks from Local Storage
    function loadTasks() {
        let storedTasks;
        try {
            storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            if (!Array.isArray(storedTasks)) {
                storedTasks = []; // Reset to empty array if not an array
                localStorage.setItem('tasks', JSON.stringify(storedTasks));
            }
        } catch (e) {
            storedTasks = []; // Reset on JSON parse error
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
        }
        storedTasks.forEach(taskText => {
            if (typeof taskText === 'string' && taskText.trim() !== '') {
                addTask(taskText, false); // Only add valid string tasks
            }
        });
    }

    // Function to add a new task
    function addTask(taskText, save = true) {
        // Retrieve and trim the input value
        const text = typeof taskText === 'string' ? taskText.trim() : taskInput.value.trim();

        // Check if the input is empty
        if (text === '') {
            if (!taskText) alert('Please enter a task.'); // Only alert for user input
            return;
        }

        // Create new list item
        const li = document.createElement('li');
        li.textContent = text;

        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn'); // Use classList.add as required

        // Add click event to remove button to remove the list item and update Local Storage
        removeButton.onclick = function() {
            taskList.removeChild(li);
            updateLocalStorage();
        };

        // Append remove button to list item and list item to task list
        li.appendChild(removeButton);
        taskList.appendChild(li);

        // Clear the input field if adding via user input
        if (!taskText) taskInput.value = '';

        // Save to Local Storage if required
        if (save) {
            const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            storedTasks.push(text);
            localStorage.setItem('tasks', JSON.stringify(storedTasks));
        }
    }

    // Function to update Local Storage after task removal
    function updateLocalStorage() {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => li.firstChild.textContent.trim());
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from Local Storage on page load
    loadTasks();

    // Add event listener to the Add Task button
    addButton.addEventListener('click', addTask);

    // Add event listener for Enter key press on input field
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
});