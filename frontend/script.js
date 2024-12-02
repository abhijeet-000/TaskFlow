const API_URL = 'http://localhost:5000/tasks';

// Fetch and display tasks
async function loadTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item');
            
            taskElement.innerHTML = `
                <div class="task-header">
                    <h3>${task.title}</h3>
                    <span class="task-date">Due: ${task.due_date || 'No due date'}</span>
                </div>
                <div class="task-content">
                    <p>${task.description || 'No description'}</p>
                    <p>Status: <span class="task-status-text">${task.status}</span></p>
                </div>
                <div class="task-actions">
                    <select class="task-status" data-task-id="${task.id}">
                        <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <button class="update-btn" data-task-id="${task.id}" style="display: none;">Update</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Update task status
async function updateTaskStatus(taskElement, id, newStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        // Update UI elements directly
        const statusSelect = taskElement.querySelector('.task-status');
        const statusText = taskElement.querySelector('.task-status-text');
        statusSelect.value = newStatus;
        statusText.textContent = newStatus;

        console.log(`Task ${id} updated to ${newStatus}`);
    } catch (error) {
        console.error('Error updating task status:', error);
    }
}

// Add event listener to task status dropdown
document.addEventListener('change', async (e) => {
    if (e.target.classList.contains('task-status')) {
        const taskId = e.target.dataset.taskId;
        const newStatus = e.target.value;
        const taskElement = e.target.closest('.task-item');
        const updateBtn = taskElement.querySelector('.update-btn');

        if (newStatus === 'Completed') {
            updateBtn.style.display = 'inline-block';
        } else {
            updateBtn.style.display = 'none';
        }
    }
});

// Update task status on button click
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('update-btn')) {
        const taskElement = e.target.closest('.task-item');
        const taskId = e.target.dataset.taskId;
        
        // Directly update to Completed
        await updateTaskStatus(taskElement, taskId, 'Completed');
        
        // Hide update button after update
        e.target.style.display = 'none';
    }
});

// Create a new task
document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const status = "Pending";

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, due_date: dueDate, status })
        });
        await loadTasks();
        e.target.reset();
    } catch (error) {
        console.error('Error creating task:', error);
    }
});

// Delete a task
async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            await loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
}

// Cancel button functionality
document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('task-form').reset();
});

// Load tasks on page load
loadTasks();