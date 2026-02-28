// Personal Productivity Dashboard JavaScript

// Clock and Greeting Functionality
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Update time
    document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
    
    // Update greeting based on time
    let greeting;
    if (hours < 12) {
        greeting = "Good Morning";
    } else if (hours < 17) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }
    
    document.getElementById('greeting-text').textContent = greeting;
}


// Task Tracker and Multiple Tasks System
class TaskManager {
    constructor() {
        this.tasks = [];
        this.dailyHistory = this.loadDailyHistory();
        this.today = this.getTodayString();
        this.initializeToday();
    }

    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    loadDailyHistory() {
        const saved = localStorage.getItem('dailyHistory');
        return saved ? JSON.parse(saved) : {};
    }

    saveDailyHistory() {
        localStorage.setItem('dailyHistory', JSON.stringify(this.dailyHistory));
    }

    initializeToday() {
        if (!this.dailyHistory[this.today]) {
            this.dailyHistory[this.today] = {
                tasks: [],
                completed: [],
                lastEngaged: new Date().toISOString()
            };
            this.saveDailyHistory();
        }
        this.tasks = this.dailyHistory[this.today].tasks || [];
    }

    addTask(text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.tasks.push(task);
        this.dailyHistory[this.today].tasks = this.tasks;
        this.dailyHistory[this.today].lastEngaged = new Date().toISOString();
        this.saveDailyHistory();
        
        return task;
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.dailyHistory[this.today].tasks = this.tasks;
            
            if (task.completed) {
                if (!this.dailyHistory[this.today].completed.includes(taskId)) {
                    this.dailyHistory[this.today].completed.push(taskId);
                }
                triggerConfetti();
            } else {
                this.dailyHistory[this.today].completed = this.dailyHistory[this.today].completed.filter(id => id !== taskId);
            }
            
            this.dailyHistory[this.today].lastEngaged = new Date().toISOString();
            this.saveDailyHistory();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.dailyHistory[this.today].tasks = this.tasks;
        this.dailyHistory[this.today].completed = this.dailyHistory[this.today].completed.filter(id => id !== taskId);
        this.dailyHistory[this.today].lastEngaged = new Date().toISOString();
        this.saveDailyHistory();
    }

    getDayStatus(dateString) {
        const dayData = this.dailyHistory[dateString];
        if (!dayData || !dayData.tasks || dayData.tasks.length === 0) {
            return 'none';
        }
        
        const totalTasks = dayData.tasks.length;
        const completedTasks = dayData.completed.length;
        
        if (completedTasks === totalTasks) {
            return 'green';
        } else if (completedTasks > 0) {
            return 'yellow';
        } else {
            return 'red';
        }
    }

    getLast7Days() {
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            days.push({
                date: dateString,
                name: dayName,
                status: this.getDayStatus(dateString),
                isToday: dateString === this.today
            });
        }
        
        return days;
    }

    getTodayStatus() {
        return this.getDayStatus(this.today);
    }
}

let taskManager;
function initializeTaskTracker() {
    taskManager = new TaskManager();
    updateTaskTrackerDisplay();
    renderTasks();
    
    // Set up event listeners
    document.getElementById('add-task-btn').addEventListener('click', addNewTask);
    document.getElementById('new-task').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });
}

function addNewTask() {
    const input = document.getElementById('new-task');
    const taskText = input.value.trim();
    
    if (taskText) {
        taskManager.addTask(taskText);
        input.value = '';
        renderTasks();
        updateTaskTrackerDisplay();
    }
}

function getTaskEmoji(taskText) {
    const text = taskText.toLowerCase();
    
    // Study/learning related
    if (text.includes('study') || text.includes('learn') || text.includes('read') || text.includes('course') || text.includes('book')) {
        return '📚';
    }
    // Work/professional
    if (text.includes('work') || text.includes('meeting') || text.includes('email') || text.includes('project') || text.includes('deadline')) {
        return '💼';
    }
    // Health/fitness
    if (text.includes('exercise') || text.includes('gym') || text.includes('workout') || text.includes('run') || text.includes('health')) {
        return '🏃';
    }
    // Shopping/errands
    if (text.includes('buy') || text.includes('shop') || text.includes('store') || text.includes('grocery')) {
        return '🛒';
    }
    // Home/cleaning
    if (text.includes('clean') || text.includes('home') || text.includes('house') || text.includes('room')) {
        return '🏠';
    }
    // Cooking/food
    if (text.includes('cook') || text.includes('food') || text.includes('meal') || text.includes('dinner') || text.includes('lunch')) {
        return '🍳';
    }
    // Calls/communication
    if (text.includes('call') || text.includes('phone') || text.includes('text') || text.includes('message')) {
        return '📞';
    }
    // Creative/hobbies
    if (text.includes('draw') || text.includes('paint') || text.includes('write') || text.includes('create') || text.includes('music')) {
        return '🎨';
    }
    // Personal/relaxation
    if (text.includes('relax') || text.includes('rest') || text.includes('break') || text.includes('meditate')) {
        return '😌';
    }
    // Default task emoji
    return '📋';
}

function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    
    if (taskManager.tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">No tasks yet. Add your first task above!</div>';
        return;
    }
    
    tasksList.innerHTML = taskManager.tasks.map(task => {
        const emoji = getTaskEmoji(task.text);
        return `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
            <span class="task-emoji">${emoji}</span>
            <span class="task-text">${task.text}</span>
            <button class="task-delete" onclick="deleteTask(${task.id})">×</button>
        </div>
    `}).join('');
}

function toggleTask(taskId) {
    taskManager.toggleTask(taskId);
    renderTasks();
    updateTaskTrackerDisplay();
}

function deleteTask(taskId) {
    taskManager.deleteTask(taskId);
    renderTasks();
    updateTaskTrackerDisplay();
}

function updateTaskTrackerDisplay() {
    const todayStatus = taskManager.getTodayStatus();
    const statusCircle = document.getElementById('today-status');
    const statusText = document.getElementById('status-text');
    const weekProgress = document.getElementById('week-progress');
    
    // Update today's status
    statusCircle.className = 'status-circle';
    if (todayStatus !== 'none') {
        statusCircle.classList.add(todayStatus);
    }
    
    // Update status text
    const todayData = taskManager.dailyHistory[taskManager.today];
    const totalTasks = todayData?.tasks?.length || 0;
    const completedTasks = todayData?.completed?.length || 0;
    
    if (totalTasks === 0) {
        statusText.textContent = 'No tasks yet';
    } else if (completedTasks === totalTasks) {
        statusText.textContent = `All ${totalTasks} tasks completed!`;
    } else {
        statusText.textContent = `${completedTasks} of ${totalTasks} completed`;
    }
    
    // Update week progress
    const last7Days = taskManager.getLast7Days();
    weekProgress.innerHTML = last7Days.map(day => `
        <div class="day-indicator">
            <div class="day-dot ${day.status}" title="${day.date}"></div>
            <div class="day-label">${day.isToday ? 'Today' : day.name}</div>
        </div>
    `).join('');
}

// Confetti Effect
function triggerConfetti() {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

// Small Widgets Functionality
class SmallWidgets {
    constructor() {
        this.timerInterval = null;
        this.timerSeconds = 25 * 60; // 25 minutes
        this.isTimerRunning = false;
        this.initializeWidgets();
    }

    initializeWidgets() {
        this.initializeQuickNotes();
        this.initializeHabits();
        this.initializeMotivation();
        this.initializeQuickLinks();
        this.initializeTimer();
        this.initializeMoodTracker();
    }

    initializeQuickNotes() {
        const notesTextarea = document.getElementById('quick-notes');
        const savedNotes = localStorage.getItem('quickNotes');
        if (savedNotes) {
            notesTextarea.value = savedNotes;
        }

        notesTextarea.addEventListener('input', function() {
            localStorage.setItem('quickNotes', this.value);
        });
    }

    initializeHabits() {
        const today = new Date().toISOString().split('T')[0];
        const savedHabits = localStorage.getItem(`habits_${today}`);
        
        if (savedHabits) {
            const habits = JSON.parse(savedHabits);
            habits.forEach(habitId => {
                const checkbox = document.getElementById(habitId);
                if (checkbox) checkbox.checked = true;
            });
        }

        document.querySelectorAll('.habit-item input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.saveHabits());
        });
    }

    saveHabits() {
        const today = new Date().toISOString().split('T')[0];
        const checkedHabits = [];
        
        document.querySelectorAll('.habit-item input:checked').forEach(checkbox => {
            checkedHabits.push(checkbox.id);
        });
        
        localStorage.setItem(`habits_${today}`, JSON.stringify(checkedHabits));
    }

    initializeMotivation() {
        const quotes = [
            "The secret of getting ahead is getting started.",
            "Don't watch the clock; do what it does. Keep going.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "Believe you can and you're halfway there.",
            "The only way to do great work is to love what you do.",
            "Your limitation—it's only your imagination.",
            "Great things never come from comfort zones.",
            "Dream it. Wish it. Do it.",
            "Success doesn't just find you. You have to go out and get it.",
            "The harder you work for something, the greater you'll feel when you achieve it."
        ];

        const today = new Date().toDateString();
        const savedQuote = localStorage.getItem('dailyQuote');
        const savedDate = localStorage.getItem('quoteDate');
        
        if (savedDate === today && savedQuote) {
            document.getElementById('motivation-text').textContent = savedQuote;
        } else {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            document.getElementById('motivation-text').textContent = randomQuote;
            localStorage.setItem('dailyQuote', randomQuote);
            localStorage.setItem('quoteDate', today);
        }
    }

    initializeQuickLinks() {
        document.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('data-url');
                window.open(url, '_blank');
            });
        });
    }

    initializeTimer() {
        const startBtn = document.getElementById('timer-start');
        const resetBtn = document.getElementById('timer-reset');
        
        startBtn.addEventListener('click', () => this.toggleTimer());
        resetBtn.addEventListener('click', () => this.resetTimer());
        
        this.updateTimerDisplay();
        this.updateProgressRing();
    }

    toggleTimer() {
        const startBtn = document.getElementById('timer-start');
        
        if (this.isTimerRunning) {
            this.pauseTimer();
            startBtn.textContent = 'Start';
            startBtn.style.backgroundColor = '#48bb78';
        } else {
            this.startTimer();
            startBtn.textContent = 'Pause';
            startBtn.style.backgroundColor = '#ed8936';
        }
    }

    startTimer() {
        this.isTimerRunning = true;
        this.timerInterval = setInterval(() => {
            if (this.timerSeconds > 0) {
                this.timerSeconds--;
                this.updateTimerDisplay();
                this.updateProgressRing();
            } else {
                this.completeTimer();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
    }

    resetTimer() {
        this.pauseTimer();
        this.timerSeconds = 25 * 60; // Reset to 25 minutes
        this.updateTimerDisplay();
        this.updateProgressRing();
        
        // Reset button states
        const startBtn = document.getElementById('timer-start');
        startBtn.textContent = 'Start';
        startBtn.style.backgroundColor = '#48bb78';
        
        // Ensure reset button is visible
        const resetBtn = document.getElementById('timer-reset');
        resetBtn.style.display = 'inline-block';
        resetBtn.style.visibility = 'visible';
    }

    completeTimer() {
        this.pauseTimer();
        triggerConfetti();
        alert('Timer completed! Take a break!');
        this.resetTimer();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateProgressRing() {
        const progressCircle = document.querySelector('.timer-progress');
        const totalSeconds = 25 * 60; // 25 minutes in seconds
        const progress = this.timerSeconds / totalSeconds;
        const circumference = 2 * Math.PI * 54; // radius = 54
        const offset = circumference * (1 - progress);
        
        progressCircle.style.strokeDashoffset = offset;
    }

    initializeMoodTracker() {
        const today = new Date().toISOString().split('T')[0];
        const savedMood = localStorage.getItem(`mood_${today}`);
        
        // Load mood statistics
        const moodStats = this.getMoodStats();
        this.updateMoodCounts(moodStats);
        
        // Set today's mood if saved
        if (savedMood) {
            const moodItem = document.querySelector(`[data-mood="${savedMood}"]`);
            if (moodItem) {
                moodItem.classList.add('selected');
            }
        }

        // Add click handlers to mood items
        document.querySelectorAll('.mood-item').forEach(item => {
            item.addEventListener('click', () => {
                const mood = item.getAttribute('data-mood');
                this.selectMood(mood, item);
            });
        });
    }

    getMoodStats() {
        const saved = localStorage.getItem('moodStats');
        return saved ? JSON.parse(saved) : {
            great: 0,
            good: 0,
            okay: 0,
            bad: 0,
            terrible: 0
        };
    }

    saveMoodStats(moodStats) {
        localStorage.setItem('moodStats', JSON.stringify(moodStats));
    }

    updateMoodCounts(moodStats) {
        Object.keys(moodStats).forEach(mood => {
            const countElement = document.querySelector(`[data-mood="${mood}"] .mood-count`);
            if (countElement) {
                countElement.textContent = moodStats[mood];
            }
        });
    }

    selectMood(mood, item) {
        const today = new Date().toISOString().split('T')[0];
        const previousMood = localStorage.getItem(`mood_${today}`);
        
        // Remove previous selection
        document.querySelectorAll('.mood-item').forEach(i => i.classList.remove('selected'));
        
        // Add new selection
        item.classList.add('selected');
        localStorage.setItem(`mood_${today}`, mood);
        
        // Update mood statistics
        const moodStats = this.getMoodStats();
        
        // If changing mood today, decrement previous mood count
        if (previousMood && previousMood !== mood) {
            moodStats[previousMood]--;
            if (moodStats[previousMood] < 0) moodStats[previousMood] = 0;
        }
        
        // Only increment if this is a new mood for today or first time selecting
        if (!previousMood || previousMood !== mood) {
            moodStats[mood]++;
        }
        
        this.saveMoodStats(moodStats);
        this.updateMoodCounts(moodStats);
    }
}

let smallWidgets;
function addNameCustomization() {
    const userNameElement = document.getElementById('user-name');
    
    // Load saved name on page load
    const savedName = localStorage.getItem('userName');
    if (savedName && savedName.trim()) {
        userNameElement.textContent = `Welcome back, ${savedName.trim()}!`;
    }
    
    userNameElement.style.cursor = 'pointer';
    userNameElement.title = 'Click to edit your name';
    
    userNameElement.addEventListener('click', function() {
        const currentName = localStorage.getItem('userName') || '';
        const newName = prompt('Enter your name:', currentName);
        
        if (newName && newName.trim()) {
            localStorage.setItem('userName', newName.trim());
            this.textContent = `Welcome back, ${newName.trim()}!`;
        }
    });
}

// Optional: Unsplash Background
function setUnsplashBackground() {
    const unsplashUrl = 'https://source.unsplash.com/random/1920x1080/?nature,landscape';
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${unsplashUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start the clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initialize task tracker
    initializeTaskTracker();
    
    // Initialize small widgets
    smallWidgets = new SmallWidgets();
    
    // Add name customization
    addNameCustomization();
    
    // Optional: Set Unsplash background (comment out if not wanted)
    // setUnsplashBackground();
});

