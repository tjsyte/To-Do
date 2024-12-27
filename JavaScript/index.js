document.addEventListener('DOMContentLoaded', function () {
    const tasksList = document.getElementById('tasks-list');
    const tasksContent = document.getElementById('tasks-content');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const pendingCountElement = document.getElementById('pending-task-count');
    const completedCountElement = document.getElementById('completed-task-count');
    const documentCountElement = document.getElementById('document-count');
    const searchBarInput = document.getElementById('search-bar-input');
    const dailyQuoteElement = document.getElementById('daily-quote');

    // Update task counts
    const updateTaskCounts = () => {
        const pendingCount = tasks.filter(task => task.status.toLowerCase() === 'pending').length;
        const completedCount = tasks.filter(task => task.status.toLowerCase() === 'completed').length;

        pendingCountElement.textContent = pendingCount;
        completedCountElement.textContent = completedCount;
    };

    // Update document count
    const updateDocumentCount = () => {
        const documents = JSON.parse(localStorage.getItem('documents')) || [];
        documentCountElement.textContent = documents.length;
    };

    // Array of quotes
    const quotes = [
        { quote: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { quote: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
        { quote: "In the end, we only regret the chances we didn't take.", author: "Lewis Carroll" },
        { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
        { quote: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
        { quote: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
        { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { quote: "The more you learn, the more you earn.", author: "Warren Buffett" },
        { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { quote: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
        { quote: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
        { quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
        { quote: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
        { quote: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" },
        { quote: "I can do all things through Christ who strengthens me.", author: "Philippians 4:13" },
        { quote: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", author: "Jeremiah 29:11" },
        { quote: "The Lord is my shepherd; I shall not want.", author: "Psalm 23:1" },
        { quote: "Trust in the Lord with all your heart, and do not lean on your own understanding.", author: "Proverbs 3:5" },
        { quote: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.", author: "Isaiah 40:31" },
        { quote: "The Lord is my light and my salvation; whom shall I fear? The Lord is the stronghold of my life; of whom shall I be afraid?", author: "Psalm 27:1" },
        { quote: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", author: "Romans 8:28" },
        { quote: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", author: "Joshua 1:9" }
        // Add more quotes as needed
    ];

    // Display a random quote
    const displayRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const selectedQuote = quotes[randomIndex];
        dailyQuoteElement.textContent = `${selectedQuote.quote} - ${selectedQuote.author}`;
    };

    displayRandomQuote();

    // Filter tasks by status
    const filterTasks = (status) => {
        tasksList.innerHTML = '';
        tasksContent.innerHTML = '';

        const filteredTasks = status === 'all' ? tasks : tasks.filter(task => task.status.toLowerCase() === status);

        if (filteredTasks.length === 0) {
            const message = document.createElement('div');
            message.classList.add('p-6', 'rounded', 'shadow', 'bg-gray-100');
            message.innerHTML = `
                <h3 class="font-bold text-xl mb-4">No Tasks Found</h3>
                <p class="text-gray-600">There are no ${status} tasks at the moment. Add new tasks to get started.</p>
            `;
            tasksContent.appendChild(message);
        } else {
            filteredTasks.forEach(task => {
                const card = document.createElement('div');
                const taskClass = task.status.toLowerCase() === 'pending' ? 'bg-red-100' : 'bg-green-100';
                card.classList.add('task-card', taskClass, 'p-6', 'rounded', 'shadow', 'mb-4');
                card.innerHTML = `
                    <h3 class="font-bold text-xl mb-4">${task.name}</h3>
                    <p class="text-gray-600">${task.person}</p>
                    <p class="text-gray-600">${task.datetime}</p>
                    <p class="${task.status.toLowerCase() === 'pending' ? 'text-red-500' : 'text-green-500'}">${task.status}</p>
                `;
                tasksContent.appendChild(card);
            });
        }

        updateTaskCounts();
    };

    window.filterTasks = filterTasks;

    filterTasks('all');
    updateTaskCounts();
    updateDocumentCount();

    // Search tasks by query
    const searchTasks = (query) => {
        tasksList.innerHTML = '';
        tasksContent.innerHTML = '';

        const filteredTasks = tasks.filter(task =>
            task.name.toLowerCase().includes(query.toLowerCase()) ||
            task.person.toLowerCase().includes(query.toLowerCase()) ||
            task.status.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredTasks.length === 0) {
            const message = document.createElement('div');
            message.classList.add('p-6', 'rounded', 'shadow', 'bg-gray-100');
            message.innerHTML = `
                <h3 class="font-bold text-xl mb-4">No Tasks Found</h3>
                <p class="text-gray-600">No tasks match your search query. Please try again.</p>
            `;
            tasksContent.appendChild(message);
        } else {
            filteredTasks.forEach(task => {
                const card = document.createElement('div');
                const taskClass = task.status.toLowerCase() === 'pending' ? 'bg-red-100' : 'bg-green-100';
                card.classList.add('task-card', taskClass, 'p-6', 'rounded', 'shadow', 'mb-4');
                card.innerHTML = `
                    <h3 class="font-bold text-xl mb-4">${task.name}</h3>
                    <p class="text-gray-600">${task.person}</p>
                    <p class="text-gray-600">${task.datetime}</p>
                    <p class="${task.status.toLowerCase() === 'pending' ? 'text-red-500' : 'text-green-500'}">${task.status}</p>
                `;
                tasksContent.appendChild(card);
            });
        }

        updateTaskCounts();
    };

    searchBarInput.addEventListener('input', (event) => {
        const query = event.target.value;
        if (query.trim() === '') {
            filterTasks('all');
        } else {
            searchTasks(query);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {

    const elements = {
        burgerMenu: document.getElementById('burger-menu'),
        sidebar: document.getElementById('sidebar'),
        closeSidebar: document.getElementById('close-sidebar'),
        searchBar: document.getElementById('search-bar'),
        taskTabs: document.querySelectorAll('#tasks-overview ul li a')
    };

    elements.burgerMenu.addEventListener('click', () => {
        elements.sidebar.classList.toggle('hidden');
        elements.searchBar.classList.toggle('search-bar-hidden');
        elements.searchBar.classList.toggle('search-bar-visible');
    });

    elements.closeSidebar.addEventListener('click', () => {
        elements.sidebar.classList.add('hidden');
        elements.searchBar.classList.remove('search-bar-hidden');
        elements.searchBar.classList.add('search-bar-visible');
    });

    elements.taskTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            const type = tab.getAttribute('onclick').match(/filterTasks\('(.+?)'\)/)[1];
            filterTasks(type);
        });
    });
});

// Filter tasks by type
function filterTasks(type) {
    const tasksContent = document.getElementById('tasks-content');
    let content = '';

    switch (type) {
        case 'all':
            content = `
                <h3 class="font-bold text-xl mb-4">All Tasks</h3>
                <p class="text-gray-600">View all tasks in one place.</p>
                <ul id="tasks-list">
                  <!-- List all tasks here -->
                </ul>
            `;
            break;
        case 'pending':
            content = `
                <h3 class="font-bold text-xl mb-4">Pending Tasks</h3>
                <p class="text-gray-600">View all pending tasks here.</p>
                <ul id="tasks-list">
                  <!-- List pending tasks here -->
                </ul>
            `;
            break;
        case 'completed':
            content = `
                <h3 class="font-bold text-xl mb-4">Completed Tasks</h3>
                <p class="text-gray-600">View all completed tasks here.</p>
                <ul id="tasks-list">
                  <!-- List completed tasks here -->
                </ul>
            `;
            break;
    }

    tasksContent.innerHTML = content;
}