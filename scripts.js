// Main script file for Math Master
(function() {
    'use strict';

    /**
     * GameState module
     * Manages all application state.
     */
    const GameState = (function() {
        let state = {
            currentLevel: 1,
            totalScore: 0,
            highestStreak: 0,
            unlockedLevels: [1],
            earnedBadges: [],
            starsPerLevel: {},
            totalProblemsAttempted: 0,
            totalCorrectAnswers: 0,
            streak: 0,
            hintsRemaining: 2,
            fontSize: 'medium'
        };

        function getState() {
            return state;
        }

        function setState(newState) {
            state = { ...state, ...newState };
        }

        return {
            getState,
            setState
        };
    })();

    /**
     * StorageManager module
     * Handles saving and loading game data to and from localStorage.
     */
    const StorageManager = (function() {
        const STORAGE_KEY = 'mathMasterSaveData';

        function saveGame(gameState) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        }

        function loadGame() {
            const savedData = localStorage.getItem(STORAGE_KEY);
            return savedData ? JSON.parse(savedData) : null;
        }

        function resetProgress() {
            localStorage.removeItem(STORAGE_KEY);
        }

        return {
            saveGame,
            loadGame,
            resetProgress
        };
    })();

    /**
     * QuestionGenerator module
     * Responsible for creating and returning new math problems.
     */
    const QuestionGenerator = (function() {
        /**
         * Generates a random integer between two values, inclusive.
         * @param {number} min The minimum value.
         * @param {number} max The maximum value.
         * @returns {number} A random integer between min and max.
         */
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /**
         * Generates a question based on the current level.
         * @param {number} level The current game level.
         * @returns {object} An object with the question string and the answer.
         */
        function generateQuestion(level) {
            let operand1, operand2, operator, question, answer;

            let min, max;
            if (level >= 1 && level <= 10) {
                min = 1; max = 10;
            } else if (level >= 11 && level <= 25) {
                min = 10; max = 50;
            } else if (level >= 26 && level <= 40) {
                min = 50; max = 100;
            } else { // Levels 41-50
                min = 100; max = 200;
            }

            let operators;
            if (level >= 1 && level <= 10) {
                operators = ['+', '-'];
            } else if (level >= 11 && level <= 25) {
                operators = ['+', '-', '*'];
            } else { // Levels 26-50
                operators = ['+', '-', '*', '/'];
            }
            operator = operators[getRandomInt(0, operators.length - 1)];

            operand1 = getRandomInt(min, max);
            operand2 = getRandomInt(min, max);

            if (operator === '-') {
                if (operand1 < operand2) {
                    [operand1, operand2] = [operand2, operand1]; // Swap to avoid negative answers
                }
            }

            if (operator === '/') {
                // Ensure division results in a whole number and operands are within range.
                const possibleResults = [];
                for (let i = 2; i <= Math.floor(max / min); i++) {
                    possibleResults.push(i);
                }

                if (possibleResults.length > 0) {
                    const result = possibleResults[getRandomInt(0, possibleResults.length - 1)];
                    const divisorRangeMin = min;
                    const divisorRangeMax = Math.floor(max / result);
                    operand2 = getRandomInt(divisorRangeMin, divisorRangeMax);
                    operand1 = operand2 * result;
                } else {
                    // Fallback to multiplication if no valid division problem can be generated
                    operator = '*';
                }
            }

            switch (operator) {
                case '+':
                    answer = operand1 + operand2;
                    question = `${operand1} + ${operand2}`;
                    break;
                case '-':
                    answer = operand1 - operand2;
                    question = `${operand1} - ${operand2}`;
                    break;
                case '*':
                    answer = operand1 * operand2;
                    question = `${operand1} × ${operand2}`;
                    break;
                case '/':
                    answer = operand1 / operand2;
                    question = `${operand1} ÷ ${operand2}`;
                    break;
            }

            return { question, answer };
        }

        return {
            generateQuestion
        };
    })();

    /**
     * ScoreManager module
     * Manages scoring logic, including awarding points and calculating streaks.
     */
    const ScoreManager = (function() {
        /**
         * Updates the score based on the answer's correctness.
         * @param {object} gameState The current state of the game.
         * @param {boolean} isCorrect Whether the answer was correct.
         * @returns {object} An object with the updated score and streak.
         */
        function updateScore(gameState, isCorrect) {
            let { totalScore, streak } = gameState;

            if (isCorrect) {
                streak++;
                let points = 10;
                if (streak >= 10) {
                    points *= 3;
                } else if (streak >= 5) {
                    points *= 2;
                } else if (streak >= 3) {
                    points *= 1.5;
                }
                totalScore += points;
            } else {
                streak = 0;
            }

            return { totalScore, streak };
        }

        return {
            updateScore
        };
    })();

    /**
     * UIController module
     * Handles all DOM manipulation.
     */
    const LevelManager = (function() {
        const TOTAL_LEVELS = 50;

        function checkLevelUnlock(gameState) {
            const { currentLevel, totalProblemsAttempted, totalCorrectAnswers, unlockedLevels } = gameState;
            const accuracy = totalProblemsAttempted > 0 ? (totalCorrectAnswers / totalProblemsAttempted) * 100 : 0;

            if (accuracy >= 60 && currentLevel < TOTAL_LEVELS && !unlockedLevels.includes(currentLevel + 1)) {
                gameState.unlockedLevels.push(currentLevel + 1);
            }
        }

        return {
            TOTAL_LEVELS,
            checkLevelUnlock
        };
    })();

    const AchievementManager = (function() {
        const achievements = [
            { id: "first_steps", name: "First Steps", description: "Complete Level 1", check: (gs) => gs.currentLevel > 1 },
            { id: "streak_master", name: "Streak Master", description: "Achieve a 10-answer streak", check: (gs) => gs.highestStreak >= 10 },
            { id: "persistent_player", name: "Persistent Player", description: "Attempt 100 total problems", check: (gs) => gs.totalProblemsAttempted >= 100 },
        ];

        function checkAchievements(gameState) {
            const newBadges = [];
            achievements.forEach(ach => {
                if (!gameState.earnedBadges.includes(ach.id) && ach.check(gameState)) {
                    gameState.earnedBadges.push(ach.id);
                    newBadges.push(ach);
                }
            });
            return newBadges;
        }

        return {
            achievements,
            checkAchievements
        };
    })();

    const UIController = (function() {
        const DOM = {
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            streak: document.getElementById('streak'),
            question: document.getElementById('question'),
            answer: document.getElementById('answer'),
            submit: document.getElementById('submit'),
            feedback: document.getElementById('feedback'),
            levelSelectBtn: document.getElementById('level-select-btn'),
            achievementsBtn: document.getElementById('achievements-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            gameScreen: document.getElementById('game-screen'),
            levelSelectScreen: document.getElementById('level-select-screen'),
            achievementsScreen: document.getElementById('achievements-screen'),
            settingsScreen: document.getElementById('settings-screen'),
            levelGrid: document.getElementById('level-grid'),
            achievementsGrid: document.getElementById('achievements-grid'),
            resetProgressBtn: document.getElementById('reset-progress-btn'),
            fontSize: document.getElementById('font-size'),
            hintBtn: document.getElementById('hint-btn'),
            hintsRemaining: document.getElementById('hints-remaining'),
            notification: document.getElementById('notification')
        };

        function updateHeader(gameState) {
            DOM.score.textContent = gameState.totalScore;
            DOM.level.textContent = gameState.currentLevel;
            DOM.streak.textContent = gameState.streak;
            DOM.hintsRemaining.textContent = gameState.hintsRemaining;
        }

        function displayQuestion(question) {
            DOM.question.textContent = question;
        }

        function showFeedback(isCorrect, correctAnswer) {
            if (isCorrect) {
                DOM.feedback.textContent = 'Excellent!';
                DOM.feedback.className = 'alert alert-success';
            } else {
                DOM.feedback.textContent = `Not quite! The correct answer is ${correctAnswer}.`;
                DOM.feedback.className = 'alert alert-warning';
            }
        }

        function clearAnswerInput() {
            DOM.answer.value = '';
        }

        function focusAnswerInput() {
            DOM.answer.focus();
        }

        function renderLevelSelect(unlockedLevels) {
            DOM.levelGrid.innerHTML = '';
            for (let i = 1; i <= LevelManager.TOTAL_LEVELS; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.className = 'btn level-btn';
                if (unlockedLevels.includes(i)) {
                    button.classList.add('btn-success');
                    button.disabled = false;
                } else {
                    button.classList.add('btn-secondary');
                    button.disabled = true;
                }
                DOM.levelGrid.appendChild(button);
            }
        }

        function renderAchievements(earnedBadges) {
            DOM.achievementsGrid.innerHTML = '';
            AchievementManager.achievements.forEach(ach => {
                const earned = earnedBadges.includes(ach.id);
                const badgeEl = document.createElement('div');
                badgeEl.className = `col-md-4 badge-container text-center ${earned ? 'text-warning' : 'text-muted'}`;
                badgeEl.innerHTML = `
                    <div class="badge-icon">${earned ? '🏆' : '🔒'}</div>
                    <h5>${ach.name}</h5>
                    <p>${ach.description}</p>
                `;
                DOM.achievementsGrid.appendChild(badgeEl);
            });
        }

        function showScreen(screenId) {
            [DOM.gameScreen, DOM.levelSelectScreen, DOM.achievementsScreen, DOM.settingsScreen].forEach(screen => {
                screen.classList.add('d-none');
            });
            document.getElementById(screenId).classList.remove('d-none');
        }

        function showNotification(message) {
            DOM.notification.textContent = message;
            DOM.notification.classList.remove('d-none');
            setTimeout(() => {
                DOM.notification.classList.add('d-none');
            }, 3000);
        }

        return {
            DOM,
            updateHeader,
            displayQuestion,
            showFeedback,
            clearAnswerInput,
            focusAnswerInput,
            renderLevelSelect,
            renderAchievements,
            showScreen,
            showNotification
        };
    })();

    /**
     * Game Initialization
     */
    document.addEventListener('DOMContentLoaded', function() {
        let currentQuestion;

        function newQuestion() {
            let gameState = GameState.getState();
            if (gameState.totalProblemsAttempted > 0 && gameState.totalProblemsAttempted % 15 === 0) {
                const oldUnlockedLevels = [...gameState.unlockedLevels];
                LevelManager.checkLevelUnlock(gameState);
                const newUnlockedLevels = gameState.unlockedLevels;

                let message = `Level ${gameState.currentLevel} complete!`;
                if (newUnlockedLevels.length > oldUnlockedLevels.length) {
                    message += ` You've unlocked level ${newUnlockedLevels[newUnlockedLevels.length - 1]}!`;
                }
                UIController.showNotification(message);

                const newBadges = AchievementManager.checkAchievements(gameState);
                if (newBadges.length > 0) {
                    UIController.showNotification(`New badge unlocked: ${newBadges.map(b => b.name).join(', ')}`);
                }

                gameState.totalProblemsAttempted = 0;
                gameState.totalCorrectAnswers = 0;
            }

            const level = gameState.currentLevel;
            currentQuestion = QuestionGenerator.generateQuestion(level);
            UIController.displayQuestion(currentQuestion.question);
            UIController.clearAnswerInput();
            UIController.focusAnswerInput();
            UIController.feedback.textContent = '';
            UIController.feedback.className = '';
            GameState.setState(gameState);
            UIController.updateHeader(gameState);
        }

        function checkAnswer() {
            const userAnswer = parseInt(UIController.DOM.answer.value, 10);
            if (isNaN(userAnswer)) {
                return; // Ignore non-numeric input
            }

            const isCorrect = userAnswer === currentQuestion.answer;

            let gameState = GameState.getState();
            gameState.totalProblemsAttempted++;
            if (isCorrect) {
                gameState.totalCorrectAnswers++;
            }

            const { totalScore, streak } = ScoreManager.updateScore(gameState, isCorrect);
            gameState.totalScore = totalScore;
            gameState.streak = streak;
            if (streak > gameState.highestStreak) {
                gameState.highestStreak = streak;
            }

            GameState.setState(gameState);
            StorageManager.saveGame(gameState);

            UIController.updateHeader(gameState);
            UIController.showFeedback(isCorrect, currentQuestion.answer);

            setTimeout(() => {
                newQuestion();
            }, 2000); // 2-second delay as per REQ-FN-018
        }

        function useHint() {
            let gameState = GameState.getState();
            if (gameState.hintsRemaining > 0) {
                gameState.hintsRemaining--;
                const answerString = currentQuestion.answer.toString();
                const hint = `The answer starts with ${answerString[0]}.`;
                UIController.DOM.feedback.textContent = hint;
                UIController.DOM.feedback.className = 'alert alert-info';
                GameState.setState(gameState);
                UIController.updateHeader(gameState);
            }
        }

        function init() {
            const savedData = StorageManager.loadGame();
            if (savedData) {
                GameState.setState(savedData);
                const gameState = GameState.getState();
                document.body.className = `font-${gameState.fontSize}`;
                UIController.DOM.fontSize.value = gameState.fontSize;
            }
            UIController.updateHeader(GameState.getState());
            newQuestion();
        }

        UIController.DOM.submit.addEventListener('click', checkAnswer);
        UIController.DOM.answer.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                checkAnswer();
            }
        });
        UIController.DOM.hintBtn.addEventListener('click', useHint);

        UIController.DOM.levelSelectBtn.addEventListener('click', () => {
            UIController.renderLevelSelect(GameState.getState().unlockedLevels);
            UIController.showScreen('level-select-screen');
        });

        UIController.DOM.achievementsBtn.addEventListener('click', () => {
            UIController.renderAchievements(GameState.getState().earnedBadges);
            UIController.showScreen('achievements-screen');
        });

        UIController.DOM.settingsBtn.addEventListener('click', () => {
            UIController.showScreen('settings-screen');
        });

        // Add event listeners for level selection and settings
        UIController.DOM.levelGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('level-btn')) {
                const level = parseInt(e.target.textContent, 10);
                let gameState = GameState.getState();
                gameState.currentLevel = level;
                gameState.totalProblemsAttempted = 0;
                gameState.totalCorrectAnswers = 0;
                GameState.setState(gameState);
                newQuestion();
                UIController.showScreen('game-screen');
            }
        });

        UIController.DOM.resetProgressBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all your progress?')) {
                StorageManager.resetProgress();
                location.reload();
            }
        });

        UIController.DOM.fontSize.addEventListener('change', (e) => {
            let gameState = GameState.getState();
            gameState.fontSize = e.target.value;
            document.body.className = `font-${gameState.fontSize}`;
            GameState.setState(gameState);
        });

        init();
        console.log('Math Master game initialized!');
    });

})();
