class QuizApp {
    constructor() {
        this.dataManager = new QuizDataManager();
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeRemaining = 60;
        this.timer = null;
        this.startTime = null;
        this.questionTimes = [];
        this.correctAnswersCount = 0; 
        this.isAnswered = false;
        this.hintsUsed = 0;
        
        this.elements = {};
        this.screens = {};
        
        this.init();
    }

    /*Inisiasi*/
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.initializeSlider();
        this.showScreen('welcome-screen');
        
        // Preload sounds
        this.preloadSounds();
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheDOMElements() {
        // Screens
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            quiz: document.getElementById('quiz-screen'),
            result: document.getElementById('result-screen'),
            loading: document.getElementById('loading-screen')
        };

        // Form elements
        this.elements = {
            setupForm: document.getElementById('setup-form'),
            username: document.getElementById('username'),
            difficulty: document.getElementById('difficulty'),
            category: document.getElementById('category'),
            amount: document.getElementById('amount'),
            amountDisplay: document.getElementById('amount-display'),
            
            // Quiz elements
            progressFill: document.getElementById('progress-fill'),
            questionCounter: document.getElementById('question-counter'),
            timer: document.getElementById('timer'),
            currentScore: document.getElementById('current-score'),
            questionText: document.getElementById('question-text'),
            optionsList: document.getElementById('options-list'),
            skipBtn: document.getElementById('skip-btn'),
            hintBtn: document.getElementById('hint-btn'),
            
            // Result elements
            resultIcon: document.getElementById('result-icon'),
            resultTitle: document.getElementById('result-title'),
            resultMessage: document.getElementById('result-message'),
            finalScore: document.getElementById('final-score'),
            correctAnswers: document.getElementById('correct-answers'),
            avgTime: document.getElementById('avg-time'),
            playAgainBtn: document.getElementById('play-again-btn'),
            shareBtn: document.getElementById('share-btn'),
            
            // Audio elements
            correctSound: document.getElementById('correct-sound'),
            wrongSound: document.getElementById('wrong-sound')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Setup form submission
        this.elements.setupForm.addEventListener('submit', (e) => this.handleSetupSubmit(e));
        
        // Slider update
        this.elements.amount.addEventListener('input', (e) => {
            this.elements.amountDisplay.textContent = e.target.value;
        });
        
        // Quiz buttons
        this.elements.skipBtn.addEventListener('click', () => this.skipQuestion());
        this.elements.hintBtn.addEventListener('click', () => this.showHint());
        
        // Result buttons
        this.elements.playAgainBtn.addEventListener('click', () => this.resetQuiz());
        this.elements.shareBtn.addEventListener('click', () => this.shareScore());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevent form submission on Enter in inputs
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.type !== 'submit') {
                    e.preventDefault();
                }
            });
        });
    }

    /**
     * Initialize amount slider
     */
    initializeSlider() {
        const slider = this.elements.amount;
        const display = this.elements.amountDisplay;
        
        // Update display
        display.textContent = slider.value;
        
        // Update slider background
        this.updateSliderBackground(slider);
        
        slider.addEventListener('input', () => {
            display.textContent = slider.value;
            this.updateSliderBackground(slider);
        });
    }

    /**
     * Update slider background for visual feedback
     */
    updateSliderBackground(slider) {
        const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${value}%, var(--bg-tertiary) ${value}%, var(--bg-tertiary) 100%)`;
    }

    /**
     * Preload sound effects
     */
    preloadSounds() {
        try {
            this.elements.correctSound.load();
            this.elements.wrongSound.load();
        } catch (error) {
            console.warn('Could not preload sounds:', error);
        }
    }

    /**
     * Handle setup form submission
     */
    async handleSetupSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.elements.setupForm);
        const config = {
            username: formData.get('username').trim(),
            difficulty: formData.get('difficulty'),
            category: parseInt(formData.get('category')),
            amount: parseInt(formData.get('amount'))
        };

        // Validate input
        if (!config.username) {
            this.showError('Nama tidak boleh kosong!');
            return;
        }

        if (config.username.length < 2) {
            this.showError('Nama minimal 2 karakter!');
            return;
        }

        await this.startQuiz(config);
    }

    /**
     * Start the quiz with given configuration
     */
    async startQuiz(config) {
        this.showScreen('loading-screen');
        
        try {
            // Get questions
            const result = await this.dataManager.getQuestions(
                config.amount,
                config.category,
                config.difficulty
            );

            if (!result.questions || result.questions.length === 0) {
                throw new Error('Tidak dapat memuat soal. Silakan coba lagi.');
            }

            // Initialize quiz state
            this.currentQuiz = {
                ...config,
                questions: result.questions,
                source: result.source,
                categoryName: this.dataManager.getCategoryName(config.category)
            };

            this.resetQuizState();
            this.showScreen('quiz-screen');
            this.displayQuestion();
            this.startTimer();

        } catch (error) {
            console.error('Error starting quiz:', error);
            this.showError(error.message || 'Terjadi kesalahan saat memuat quiz.');
            this.showScreen('welcome-screen');
        }
    }

    /**
     * Reset quiz state
     */
    resetQuizState() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeRemaining = 60;
        this.startTime = Date.now();
        this.questionTimes = [];
        this.correctAnswersCount = 0; // FIXED: Reset correct answers count
        this.isAnswered = false;
        this.hintsUsed = 0;
        
        this.updateScore();
        this.updateProgress();
    }

    /**
     * Display current question
     */
    displayQuestion() {
        if (!this.currentQuiz || this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.endQuiz();
            return;
        }

        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        this.isAnswered = false;
        
        // Update question counter
        this.elements.questionCounter.textContent = 
            `${this.currentQuestionIndex + 1} / ${this.currentQuiz.questions.length}`;
        
        // Display question
        this.elements.questionText.textContent = question.question;
        
        // Prepare answers
        const allAnswers = [question.correct_answer, ...question.incorrect_answers];
        const shuffledAnswers = this.shuffleArray(allAnswers);
        
        // Create options
        this.createOptions(shuffledAnswers, question.correct_answer);
        
        // Update progress
        this.updateProgress();
        
        // Reset timer for new question
        this.resetTimer();
        
        // Enable hint button
        this.elements.hintBtn.disabled = false;
        this.elements.hintBtn.classList.remove('disabled');
    }

    /**
     * Create answer options
     */
    createOptions(answers, correctAnswer) {
        this.elements.optionsList.innerHTML = '';
        
        answers.forEach((answer, index) => {
            const li = document.createElement('li');
            li.className = 'option-item';
            li.setAttribute('data-answer', answer);
            li.setAttribute('tabindex', '0');
            
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            
            li.innerHTML = `
                <span class="option-letter">${letter}</span>
                <span class="option-text">${answer}</span>
            `;
            
            // Add click and keyboard event listeners
            li.addEventListener('click', () => this.selectAnswer(answer, correctAnswer, li));
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectAnswer(answer, correctAnswer, li);
                }
            });
            
            this.elements.optionsList.appendChild(li);
        });
    }

    /**
     * Handle answer selection
     */
    selectAnswer(selectedAnswer, correctAnswer, selectedElement) {
        if (this.isAnswered) return;
        
        this.isAnswered = true;
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Record question time
        const questionTime = Date.now() - this.startTime;
        this.questionTimes.push(questionTime);
        
        // Update score and correct answers count
        if (isCorrect) {
            this.correctAnswersCount++; // FIXED: Increment only when answer is correct
            this.score += this.calculateScore();
            this.updateScore();
            this.playSound('correct');
        } else {
            this.playSound('wrong');
        }
        
        // Show correct/incorrect feedback
        this.showAnswerFeedback(selectedAnswer, correctAnswer, selectedElement);
        
        // Move to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    /**
     * Show answer feedback
     */
    showAnswerFeedback(selectedAnswer, correctAnswer, selectedElement) {
        const options = this.elements.optionsList.querySelectorAll('.option-item');
        
        options.forEach(option => {
            const answer = option.getAttribute('data-answer');
            
            if (answer === correctAnswer) {
                option.classList.add('correct');
            } else if (answer === selectedAnswer && selectedAnswer !== correctAnswer) {
                option.classList.add('wrong');
            }
            
            option.classList.add('disabled');
        });
    }

    /**
     * Calculate score based on time and difficulty
     */
    calculateScore() {
        const baseScore = 100;
        const timeBonus = Math.max(0, this.timeRemaining - 10) * 2;
        const difficultyMultiplier = {
            'easy': 1,
            'medium': 1.5,
            'hard': 2
        };
        
        const multiplier = difficultyMultiplier[this.currentQuiz.difficulty] || 1;
        return Math.floor((baseScore + timeBonus) * multiplier);
    }

    /**
     * Move to next question
     */
    nextQuestion() {
        this.currentQuestionIndex++;
        this.startTime = Date.now();
        this.displayQuestion();
    }

    /**
     * Skip current question
     */
    skipQuestion() {
        if (this.isAnswered) return;
        
        this.isAnswered = true;
        const questionTime = Date.now() - this.startTime;
        this.questionTimes.push(questionTime);
        
        // FIXED: Don't increment correctAnswersCount for skipped questions
        
        // Show correct answer
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const options = this.elements.optionsList.querySelectorAll('.option-item');
        
        options.forEach(option => {
            const answer = option.getAttribute('data-answer');
            if (answer === question.correct_answer) {
                option.classList.add('correct');
            }
            option.classList.add('disabled');
        });
        
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    /**
     * Show hint for current question
     */
    showHint() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const hint = question.hint || "Pikirkan dengan baik sebelum menjawab!";
        
        this.hintsUsed++;
        
        // Create hint popup
        const hintPopup = document.createElement('div');
        hintPopup.className = 'hint-popup';
        hintPopup.innerHTML = `
            <div class="hint-content">
                <i class="fas fa-lightbulb"></i>
                <p>${hint}</p>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-outline btn-sm">
                    Tutup
                </button>
            </div>
        `;
        
        // Add styles for hint popup
        hintPopup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        const hintContent = hintPopup.querySelector('.hint-content');
        hintContent.style.cssText = `
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 30px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(hintPopup);
        
        // Disable hint button
        this.elements.hintBtn.disabled = true;
        this.elements.hintBtn.classList.add('disabled');
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (hintPopup.parentElement) {
                hintPopup.remove();
            }
        }, 5000);
    }

    /**
     * Start question timer
     */
    startTimer() {
        this.timeRemaining = 60;
        this.updateTimer();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    /**
     * Reset timer for new question
     */
    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.startTimer();
    }

    /**
     * Handle time up
     */
    timeUp() {
        if (this.isAnswered) return;
        
        this.isAnswered = true;
        this.questionTimes.push(60000); // 60 seconds in milliseconds
        
        // FIXED: Don't increment correctAnswersCount for timed out questions
        
        // Show correct answer
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const options = this.elements.optionsList.querySelectorAll('.option-item');
        
        options.forEach(option => {
            const answer = option.getAttribute('data-answer');
            if (answer === question.correct_answer) {
                option.classList.add('correct');
            }
            option.classList.add('disabled');
        });
        
        this.playSound('wrong');
        
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    /**
     * Update timer display
     */
    updateTimer() {
        this.elements.timer.textContent = this.timeRemaining;
        
        // Change color based on time remaining
        if (this.timeRemaining <= 10) {
            this.elements.timer.style.color = 'var(--danger-color)';
            this.elements.timer.style.animation = 'pulse 1s infinite';
        } else if (this.timeRemaining <= 30) {
            this.elements.timer.style.color = 'var(--warning-color)';
            this.elements.timer.style.animation = 'none';
        } else {
            this.elements.timer.style.color = 'var(--accent-color)';
            this.elements.timer.style.animation = 'none';
        }
    }

    /**
     * Update score display
     */
    updateScore() {
        this.elements.currentScore.textContent = this.score;
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        const progress = ((this.currentQuestionIndex) / this.currentQuiz.questions.length) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
    }

    /**
     * End the quiz and show results
     */
    endQuiz() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.calculateFinalResults();
        this.showScreen('result-screen');
    }

    /**
     * Calculate and display final results
     */
    calculateFinalResults() {
        // FIXED: Use the actual correct answers count instead of total answered
        const correctAnswers = this.correctAnswersCount;
        const totalQuestions = this.currentQuiz.questions.length;
        const averageTime = this.questionTimes.length > 0 
            ? Math.round(this.questionTimes.reduce((a, b) => a + b, 0) / this.questionTimes.length / 1000)
            : 0;
        
        // Update result elements
        this.elements.finalScore.textContent = this.score;
        this.elements.correctAnswers.textContent = `${correctAnswers}/${totalQuestions}`;
        this.elements.avgTime.textContent = `${averageTime}s`;
        
        // Determine result message and icon
        const percentage = (correctAnswers / totalQuestions) * 100;
        let message, icon, title;
        
        if (percentage >= 80) {
            title = "Luar Biasa! 🎉";
            message = `Sempurna ${this.currentQuiz.username}! Anda menguasai materi ${this.currentQuiz.categoryName} dengan sangat baik.`;
            icon = "fas fa-trophy";
            this.elements.resultIcon.style.color = "var(--accent-color)";
        } else if (percentage >= 60) {
            title = "Bagus Sekali! 👏";
            message = `Kerja yang baik ${this.currentQuiz.username}! Pengetahuan Anda tentang ${this.currentQuiz.categoryName} cukup solid.`;
            icon = "fas fa-medal";
            this.elements.resultIcon.style.color = "var(--success-color)";
        } else if (percentage >= 40) {
            title = "Lumayan! 👍";
            message = `Tidak buruk ${this.currentQuiz.username}! Masih ada ruang untuk meningkatkan pengetahuan ${this.currentQuiz.categoryName} Anda.`;
            icon = "fas fa-thumbs-up";
            this.elements.resultIcon.style.color = "var(--primary-color)";
        } else {
            title = "Jangan Menyerah! 💪";
            message = `Tetap semangat ${this.currentQuiz.username}! Belajar lebih banyak tentang ${this.currentQuiz.categoryName} dan coba lagi.`;
            icon = "fas fa-heart";
            this.elements.resultIcon.style.color = "var(--danger-color)";
        }
        
        this.elements.resultTitle.textContent = title;
        this.elements.resultMessage.textContent = message;
        this.elements.resultIcon.innerHTML = `<i class="${icon}"></i>`;
    }

    /**
     * Reset quiz and return to welcome screen
     */
    resetQuiz() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.currentQuiz = null;
        this.showScreen('welcome-screen');
        
        // Reset form
        this.elements.setupForm.reset();
        this.elements.amountDisplay.textContent = '10';
        this.updateSliderBackground(this.elements.amount);
    }

    /**
     * Share score functionality
     */
    shareScore() {
        const text = `Saya baru saja menyelesaikan quiz ${this.currentQuiz.categoryName} di Quiz Master dengan skor ${this.score}! 🎯\n\nCoba juga di: ${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Quiz Master - Skor Saya',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Skor berhasil disalin ke clipboard!');
            }).catch(() => {
                this.fallbackShare(text);
            });
        } else {
            this.fallbackShare(text);
        }
    }

    /**
     * Fallback share method
     */
    fallbackShare(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Skor berhasil disalin!');
        } catch (error) {
            console.error('Could not copy text:', error);
            this.showNotification('Tidak dapat menyalin teks.');
        }
        
        document.body.removeChild(textArea);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        if (this.screens.quiz.classList.contains('active') && !this.isAnswered) {
            // Answer shortcuts (A, B, C, D)
            const key = e.key.toLowerCase();
            if (['a', 'b', 'c', 'd'].includes(key)) {
                const index = key.charCodeAt(0) - 97; // Convert to 0-3
                const options = this.elements.optionsList.querySelectorAll('.option-item');
                if (options[index]) {
                    options[index].click();
                }
            }
            // Skip with Space
            else if (e.key === ' ') {
                e.preventDefault();
                this.skipQuestion();
            }
            // Hint with H
            else if (e.key === 'h' || e.key === 'H') {
                this.showHint();
            }
        }
    }

    /**
     * Play sound effect
     */
    playSound(type) {
        try {
            const sound = type === 'correct' ? this.elements.correctSound : this.elements.wrongSound;
            sound.currentTime = 0;
            sound.play().catch(console.warn);
        } catch (error) {
            console.warn('Could not play sound:', error);
        }
    }

    /**
     * Show screen with transition
     */
    showScreen(screenId) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 100);
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 16px 24px;
            color: var(--text-primary);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        // Add type-specific styling
        if (type === 'error') {
            notification.style.borderLeftColor = 'var(--danger-color)';
            notification.style.borderLeftWidth = '4px';
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    /**
     * Utility: Shuffle array
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .btn-sm {
        padding: 8px 16px;
        font-size: 0.875rem;
    }
    
    .disabled {
        opacity: 0.6;
        cursor: not-allowed !important;
    }
    
    .hint-popup .hint-content i {
        font-size: 2rem;
        color: var(--accent-color);
        margin-bottom: 16px;
        display: block;
    }
    
    .hint-popup .hint-content p {
        margin-bottom: 20px;
        font-size: 1.1rem;
        line-height: 1.5;
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new QuizApp();
});

// Handle page visibility change to pause timer
document.addEventListener('visibilitychange', () => {
    if (window.quizApp && window.quizApp.timer) {
        if (document.hidden) {
            // Page is hidden, pause timer
            clearInterval(window.quizApp.timer);
        } else {
            // Page is visible, resume timer if quiz is active
            if (window.quizApp.screens.quiz.classList.contains('active') && !window.quizApp.isAnswered) {
                window.quizApp.startTimer();
            }
        }
    }
});

// Handle beforeunload to warn user
window.addEventListener('beforeunload', (e) => {
    if (window.quizApp && window.quizApp.currentQuiz && 
        window.quizApp.screens.quiz.classList.contains('active')) {
        e.preventDefault();
        e.returnValue = 'Quiz sedang berlangsung. Yakin ingin keluar?';
        return e.returnValue;
    }
});