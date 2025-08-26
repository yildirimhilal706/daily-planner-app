// DOM elements
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');
const dateInput = document.getElementById('date');
const goalsInput = document.getElementById('goals');
const notesInput = document.getElementById('notes');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    
    // Load saved data
    loadSavedData();
    
    // Add event listeners
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Auto-save functionality
    dateInput.addEventListener('change', saveData);
    goalsInput.addEventListener('input', saveData);
    notesInput.addEventListener('input', saveData);
    
    // Add some sample todos
    if (todoList.children.length === 0) {
        addSampleTodos();
    }
});

// Add new todo
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText === '') return;
    
    const todoItem = createTodoItem(todoText);
    todoList.appendChild(todoItem);
    
    todoInput.value = '';
    saveData();
    
    // Add animation
    todoItem.style.opacity = '0';
    todoItem.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        todoItem.style.transition = 'all 0.3s ease';
        todoItem.style.opacity = '1';
        todoItem.style.transform = 'translateX(0)';
    }, 10);
}

// Create todo item element
function createTodoItem(text) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.addEventListener('change', function() {
        li.classList.toggle('completed', this.checked);
        saveData();
    });
    
    const todoText = document.createElement('span');
    todoText.className = 'todo-text';
    todoText.textContent = text;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', function() {
        li.style.opacity = '0';
        li.style.transform = 'translateX(20px)';
        setTimeout(() => {
            li.remove();
            saveData();
        }, 300);
    });
    
    li.appendChild(checkbox);
    li.appendChild(todoText);
    li.appendChild(deleteBtn);
    
    return li;
}

// Add sample todos
function addSampleTodos() {
    const sampleTodos = [
        'Kahvaltı yap',
        'E-postaları kontrol et',
        'Proje planını gözden geçir',
        'Egzersiz yap',
        'Alışveriş listesi hazırla'
    ];
    
    sampleTodos.forEach(todo => {
        const todoItem = createTodoItem(todo);
        todoList.appendChild(todoItem);
    });
}

// Save data to localStorage
function saveData() {
    const data = {
        date: dateInput.value,
        goals: goalsInput.value,
        notes: notesInput.value,
        todos: Array.from(todoList.children).map(item => ({
            text: item.querySelector('.todo-text').textContent,
            completed: item.querySelector('.todo-checkbox').checked
        }))
    };
    
    localStorage.setItem('dailyPlannerData', JSON.stringify(data));
    
    // Show save confirmation
    showSaveConfirmation();
}

// Load saved data from localStorage
function loadSavedData() {
    const savedData = localStorage.getItem('dailyPlannerData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        dateInput.value = data.date || '';
        goalsInput.value = data.goals || '';
        notesInput.value = data.notes || '';
        
        // Load todos
        if (data.todos && data.todos.length > 0) {
            data.todos.forEach(todo => {
                const todoItem = createTodoItem(todo.text);
                if (todo.completed) {
                    todoItem.classList.add('completed');
                    todoItem.querySelector('.todo-checkbox').checked = true;
                }
                todoList.appendChild(todoItem);
            });
        }
    }
}

// Show save confirmation
function showSaveConfirmation() {
    // Create or update save indicator
    let saveIndicator = document.querySelector('.save-indicator');
    if (!saveIndicator) {
        saveIndicator = document.createElement('div');
        saveIndicator.className = 'save-indicator';
        saveIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(saveIndicator);
    }
    
    saveIndicator.textContent = '✓ Kaydedildi';
    saveIndicator.style.opacity = '1';
    saveIndicator.style.transform = 'translateX(0)';
    
    setTimeout(() => {
        saveIndicator.style.opacity = '0';
        saveIndicator.style.transform = 'translateX(100px)';
    }, 2000);
}

// Priority input functionality
document.querySelectorAll('.priority-input').forEach(input => {
    input.addEventListener('input', function() {
        // Save priority to localStorage
        const priorities = Array.from(document.querySelectorAll('.priority-input'))
            .map(input => input.value);
        localStorage.setItem('dailyPlannerPriorities', JSON.stringify(priorities));
    });
    
    // Load saved priorities
    const savedPriorities = localStorage.getItem('dailyPlannerPriorities');
    if (savedPriorities) {
        const priorities = JSON.parse(savedPriorities);
        priorities.forEach((priority, index) => {
            const inputs = document.querySelectorAll('.priority-input');
            if (inputs[index]) {
                inputs[index].value = priority;
            }
        });
    }
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to boxes
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add focus effects to inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});

// Export functionality for the expand button
document.querySelector('.expand-btn').addEventListener('click', function() {
    // Create a full-screen view
    const fullscreenView = document.createElement('div');
    fullscreenView.className = 'fullscreen-view';
    fullscreenView.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = document.querySelector('.container').cloneNode(true);
    content.style.cssText = `
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    fullscreenView.appendChild(content);
    document.body.appendChild(fullscreenView);
    
    // Animate in
    setTimeout(() => {
        fullscreenView.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 10);
    
    // Close on click
    fullscreenView.addEventListener('click', function(e) {
        if (e.target === fullscreenView) {
            fullscreenView.style.opacity = '0';
            content.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(fullscreenView);
            }, 300);
        }
    });
});

// Discover button functionality
document.querySelector('.discover-btn').addEventListener('click', function() {
    // Show a motivational message or tip
    const messages = [
        'Bugün harika bir gün olacak! 🌟',
        'Hedeflerinize odaklanın ve başarın! 💪',
        'Her küçük adım büyük değişimlere yol açar ✨',
        'Planlamanızı yapın, hayallerinizi gerçekleştirin! 🎯',
        'Bugün dünden daha iyi olacak! 🌅'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        font-size: 1.2rem;
        font-weight: 600;
        z-index: 1000;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
        transition: all 0.3s ease;
    `;
    notification.textContent = randomMessage;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
});
