document.addEventListener('DOMContentLoaded', function () {
    const elements = {
        addTaskBtn: document.getElementById('add-task-btn'),
        showAddTaskModalBtn: document.getElementById('show-add-task-modal'),
        addTaskModal: document.getElementById('add-task-modal'),
        editTaskModal: document.getElementById('edit-task-modal'),
        taskNameInput: document.getElementById('task-name-input'),
        taskPersonInput: document.getElementById('task-person-input'),
        taskDatetimeInput: document.getElementById('task-datetime-input'),
        editTaskNameInput: document.getElementById('edit-task-name-input'),
        taskContainer: document.getElementById('task-container'),
        completedTaskContainer: document.getElementById('completed-task-container'),
        saveAddTaskBtn: document.getElementById('save-add-task'),
        cancelAddTaskBtn: document.getElementById('cancel-add-task'),
        saveEditTaskBtn: document.getElementById('save-edit-task'),
        cancelEditTaskBtn: document.getElementById('cancel-edit-task'),
        completedTaskCount: document.getElementById('completed-task-count'),
        pendingTaskCount: document.getElementById('pending-task-count'),
        burgerMenu: document.getElementById('burger-menu'),
        sidebar: document.getElementById('sidebar'),
        addTaskModal: document.getElementById('add-task-modal'),
        cancelAddTaskBtn: document.getElementById('cancel-add-task'),
        closeSidebar: document.getElementById('close-sidebar'),
        body: document.body,
    };

    elements.closeSidebar.addEventListener('click', () => {
        elements.sidebar.classList.add('hidden');
        elements.body.classList.remove('body-no-interaction');
    });

    elements.burgerMenu.addEventListener('click', () => {
        elements.sidebar.classList.toggle('hidden');
        if (elements.sidebar.classList.contains('hidden')) {
            elements.body.classList.remove('body-no-interaction');
        } else {
            elements.body.classList.add('body-no-interaction');
        }
    });

    elements.cancelAddTaskBtn.addEventListener('click', () => {
        elements.addTaskModal.classList.add('hidden');
    });

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingTaskId = null;

    elements.showAddTaskModalBtn.addEventListener('click', () => {
        elements.addTaskModal.classList.remove('hidden');
    });

    elements.cancelAddTaskBtn.addEventListener('click', () => {
        elements.addTaskModal.classList.add('hidden');
    });

    // Load tasks from localStorage and display them
    const loadTasks = () => {
        elements.taskContainer.innerHTML = '';
        elements.completedTaskContainer.innerHTML = '';
        let pendingCount = 0;
        let completedCount = 0;

        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            if (task.status === 'Pending') {
                elements.taskContainer.appendChild(taskElement);
                pendingCount++;
            } else {
                elements.completedTaskContainer.appendChild(taskElement);
                completedCount++;
            }
        });

        if (pendingCount === 0) {
            const message = document.createElement('div');
            message.classList.add('p-6', 'rounded', 'shadow', 'bg-gray-100');
            message.innerHTML = `
                <h3 class="font-bold text-xl mb-4">No Pending Tasks</h3>
                <p class="text-gray-600">There are no pending tasks at the moment. Add new tasks to get started.</p>
            `;
            elements.taskContainer.appendChild(message);
        }

        if (completedCount === 0) {
            const message = document.createElement('div');
            message.classList.add('p-6', 'rounded', 'shadow', 'bg-gray-100');
            message.innerHTML = `
                <h3 class="font-bold text-xl mb-4">No Completed Tasks</h3>
                <p class="text-gray-600">There are no completed tasks at the moment. Complete some tasks to see them here.</p>
            `;
            elements.completedTaskContainer.appendChild(message);
        }

        elements.completedTaskCount.textContent = completedCount;
        elements.pendingTaskCount.textContent = pendingCount;
        updateIndexCounts(pendingCount, completedCount);
    };

    // Create and return a task element
    const createTaskElement = (task) => {
        const taskElement = document.createElement('div');
        const taskClass = task.status === 'Pending' ? 'bg-red-100' : 'bg-green-100';

        taskElement.classList.add('task', 'task-card', 'flex', 'justify-between', 'items-center', taskClass, 'p-4', 'rounded');
        taskElement.innerHTML = `
            <div>
                <h3 class="font-bold text-xl mb-4">${task.name}</h3>
                <p class="text-gray-600">${task.person}</p>
                <p class="text-gray-600">${task.datetime}</p>
                <p class="${task.status === 'Pending' ? 'text-red-500' : 'text-green-500'}">${task.status}</p>
            </div>
            <div class="relative">
                <button class="menu-btn text-gray-600 hover:text-gray-900">
                    <i class="fas fa-cog"></i>
                </button>
                <div class="dropdown-menu hidden absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg animate-slide-down">
                    <button class="edit-task-btn block w-full text-left px-4 py-2 text-yellow-500 hover:bg-gray-100">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-task-btn block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                    ${task.status === 'Pending' ?
                `<button class="complete-task-btn block w-full text-left px-4 py-2 text-green-500 hover:bg-gray-100">
                            <i class="fas fa-check"></i> Complete
                        </button>` : ''
            }
                </div>
            </div>
        `;

        const menuBtn = taskElement.querySelector('.menu-btn');
        const dropdownMenu = taskElement.querySelector('.dropdown-menu');

        const hideDropdownMenu = () => {
            dropdownMenu.classList.add('hidden');
            dropdownMenu.classList.remove('show');
        };

        menuBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
            dropdownMenu.classList.toggle('show');

            document.addEventListener('click', (e) => {
                if (!dropdownMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                    hideDropdownMenu();
                }
            }, { once: true });
        });

        taskElement.querySelector('.edit-task-btn').addEventListener('click', () => {
            editingTaskId = task.id;
            elements.editTaskNameInput.value = task.name;
            document.getElementById('edit-task-person-input').value = task.person;
            document.getElementById('edit-task-datetime-input').value = task.datetime;
            elements.editTaskModal.classList.remove('hidden');
            hideDropdownMenu();
        });

        taskElement.querySelector('.delete-task-btn').addEventListener('click', () => {
            deleteTask(task.id);
            hideDropdownMenu();
        });

        if (task.status === 'Pending') {
            taskElement.querySelector('.complete-task-btn').addEventListener('click', () => {
                completeTask(task.id);
                hideDropdownMenu();
            });
        }

        return taskElement;
    };

    elements.addTaskBtn.addEventListener('click', () => {
        elements.addTaskModal.classList.remove('hidden');
    });

    elements.saveAddTaskBtn.addEventListener('click', () => {
        const taskName = elements.taskNameInput.value.trim();
        const personResponsible = elements.taskPersonInput.value.trim();
        const taskDatetime = elements.taskDatetimeInput.value.trim();

        if (taskName && personResponsible && taskDatetime) {
            const newTask = {
                id: Date.now(),
                name: taskName,
                person: personResponsible,
                datetime: taskDatetime,
                status: 'Pending'
            };
            addTask(newTask);
            elements.taskNameInput.value = '';
            elements.taskPersonInput.value = '';
            elements.taskDatetimeInput.value = '';
            elements.addTaskModal.classList.add('hidden');
        }
    });

    elements.cancelAddTaskBtn.addEventListener('click', () => {
        elements.addTaskModal.classList.add('hidden');
    });

    elements.saveEditTaskBtn.addEventListener('click', () => {
        const editedTaskName = elements.editTaskNameInput.value.trim();
        const editedTaskPerson = document.getElementById('edit-task-person-input').value.trim();
        const editedTaskDatetime = document.getElementById('edit-task-datetime-input').value.trim();

        if (editedTaskName && editedTaskPerson && editedTaskDatetime) {
            editTask(editingTaskId, editedTaskName, editedTaskPerson, editedTaskDatetime);
            elements.editTaskModal.classList.add('hidden');
        }
    });

    elements.cancelEditTaskBtn.addEventListener('click', () => {
        elements.editTaskModal.classList.add('hidden');
    });

    // Add a new task
    const addTask = (task) => {
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    };

    // Edit an existing task
    const editTask = (id, newName, newPerson, newDatetime) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].name = newName;
            tasks[taskIndex].person = newPerson;
            tasks[taskIndex].datetime = newDatetime;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }
    };

    // Delete a task
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    };

    // Mark a task as completed
    const completeTask = (id) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = 'Completed';
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }
    };

    // Update task counts on index.html
    const updateIndexCounts = (pendingCount, completedCount) => {
        const indexPendingCount = document.querySelector('#index-pending-task-count');
        const indexCompletedCount = document.querySelector('#index-completed-task-count');
        if (indexPendingCount && indexCompletedCount) {
            indexPendingCount.textContent = pendingCount;
            indexCompletedCount.textContent = completedCount;
        }
    };

    loadTasks(); // Initial load
});