// --- MODULES ---

const GameState = (() => {
  let state = {
    playerName: "",
    currentLevel: 1,
    currentScore: 0,
    streak: 0,
    levels: [],
    currentQuestion: null,
  };

  return {
    getState: () => state,
    setState: (newState) => {
      state = { ...state, ...newState };
    },
    getLevels: () => state.levels,
    setLevels: (levels) => {
      state.levels = levels;
    },
    getCurrentLevel: () => state.currentLevel,
    setCurrentLevel: (level) => {
      state.currentLevel = level;
    },
    getCurrentScore: () => state.currentScore,
    setCurrentScore: (score) => {
      state.currentScore = score;
    },
    getStreak: () => state.streak,
    setStreak: (streak) => {
      state.streak = streak;
    },
    getPlayerName: () => state.playerName,
    setPlayerName: (name) => {
      state.playerName = name;
    },
    getCurrentQuestion: () => state.currentQuestion,
    setCurrentQuestion: (question) => {
      state.currentQuestion = question;
    },
  };
})();

const UIController = (() => {
  const DOMstrings = {
    tabs: ".tab-content",
    navButtons: ".nav-btn",
    scoreElement: "#current-score",
    levelElement: "#current-level",
    questionElement: "#question",
    answerElement: "#answer",
    submitButton: "#submit-answer",
    feedbackElement: "#feedback",
    levelListElement: "#level-list",
    settingsLevelElement: "#settings-level",
    settingsScoreElement: "#settings-score",
    playerNameInput: "#player-name",
    resetButton: "#reset-progress",
    saveSettingsButton: "#save-settings",
  };

  return {
    getDOMstrings: () => DOMstrings,
    showTab: (tabId) => {
      document
        .querySelectorAll(DOMstrings.tabs)
        .forEach((tab) => (tab.style.display = "none"));
      document.querySelector(`#${tabId}`).style.display = "block";
      document.querySelectorAll(DOMstrings.navButtons).forEach((btn) => {
        btn.classList.remove("active");
        if (btn.dataset.tab === tabId) {
          btn.classList.add("active");
        }
      });
    },
    updateScore: (score) => {
      document.querySelector(DOMstrings.scoreElement).textContent = score;
      document.querySelector(DOMstrings.settingsScoreElement).textContent =
        score;
    },
    updateLevel: (level) => {
      document.querySelector(DOMstrings.levelElement).textContent = level;
      document.querySelector(DOMstrings.settingsLevelElement).textContent =
        level;
    },
    displayQuestion: (question) => {
      const questionEl = document.querySelector(DOMstrings.questionElement);
      questionEl.innerHTML = ""; // Clear previous content

      // Use multi-line format for addition and subtraction
      if (
        (question.operator === "+" || question.operator === "−")
      ) {
        const operands = question.operands;
        let html = '<div class="question-multiline">';
        // Add all but the last operand
        for (let i = 0; i < operands.length - 1; i++) {
          html += `<div class="operand">${operands[i]}</div>`;
        }
        // Add the last operand with the operator and the line
        const lastOperand = operands[operands.length - 1];
        html += `<div class="operator-line">
                    <span class="operator">${question.operator}</span>
                    <span class="bottom-operand">${lastOperand}</span>
                 </div>`;
        html += '</div>';
        questionEl.innerHTML = html;
      } else {
        // Use single-line for everything else
        const questionText = question.operands.join(` ${question.operator} `);
        questionEl.textContent = questionText;
      }

      document.querySelector(DOMstrings.answerElement).value = "";
      document.querySelector(DOMstrings.answerElement).focus();
    },
    showFeedback: (message, isCorrect) => {
      const feedbackEl = document.querySelector(DOMstrings.feedbackElement);
      feedbackEl.textContent = message;
      feedbackEl.className = "mt-3 fs-4";
      feedbackEl.classList.add(isCorrect ? "text-success" : "text-danger");
      setTimeout(() => (feedbackEl.textContent = ""), 2000);
    },
    populateLevels: (levels) => {
      const levelListEl = document.querySelector(DOMstrings.levelListElement);
      levelListEl.innerHTML = "";

      const groupedLevels = levels.reduce((acc, level, index) => {
        const [group] = level.name.split(":");
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push({ ...level, originalIndex: index });
        return acc;
      }, {});

      const icons = {
        Addition: "plus-lg",
        Subtraction: "dash-lg",
        Multiplication: "x-lg",
        Division: "percent",
      };
      const colors = {
        Addition: "bg-primary",
        Subtraction: "bg-success",
        Multiplication: "bg-warning",
        Division: "bg-info",
      };

      let html = "";
      for (const groupName in groupedLevels) {
        html += `<h3 class="mt-4">${groupName}</h3>`;
        groupedLevels[groupName].forEach((level) => {
          const [_, description] = level.name.split(": ");

          html += `
                        <a href="#" class="level-item list-group-item list-group-item-action d-flex align-items-center mb-2" data-level="${
                          level.originalIndex + 1
                        }">
                            <div class="level-icon-container ${
                              colors[groupName]
                            } text-white me-3 d-flex align-items-center justify-content-center">
                                <i class="bi bi-${icons[groupName]}"></i>
                            </div>
                            <div class="flex-grow-1">
                                <p class="mb-0 fw-bold">${description}</p>
                            </div>
                            <i class="bi bi-chevron-right ms-auto text-muted"></i>
                        </a>
                    `;
        });
      }
      levelListEl.innerHTML = html;
    },
    updateSettings: (level, score, name) => {
      document.querySelector(DOMstrings.settingsLevelElement).textContent =
        level;
      document.querySelector(DOMstrings.settingsScoreElement).textContent =
        score;
      document.querySelector(DOMstrings.playerNameInput).value = name;
    },
    clearAnswer: () => {
      document.querySelector(DOMstrings.answerElement).value = "";
    },
  };
})();

const StorageManager = (() => {
  const STORAGE_KEY = "mathMasterState";
  return {
    saveGameState: (state) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    loadGameState: () => {
      const stateJSON = localStorage.getItem(STORAGE_KEY);
      return stateJSON ? JSON.parse(stateJSON) : null;
    },
    clearGameState: () => {
      localStorage.removeItem(STORAGE_KEY);
    },
  };
})();

const ScoreManager = (() => {
  return {
    correctAnswer: (state) => {
      const newScore = state.currentScore + 10;
      const newStreak = state.streak + 1;
      return { ...state, currentScore: newScore, streak: newStreak };
    },
    incorrectAnswer: (state) => {
      return { ...state, streak: 0 };
    },
  };
})();

const QuestionGenerator = (() => {
  const levels = [
    {
      name: "Addition: 1 digit × 2 numbers",
      type: "add",
      digits: 1,
      numbers: 2,
    },
    {
      name: "Addition: 2 digit × 2 numbers",
      type: "add",
      digits: 2,
      numbers: 2,
    },
    {
      name: "Addition: 2 digit × 3-4 numbers",
      type: "add",
      digits: 2,
      numbers: [3, 4],
    },
    {
      name: "Addition: 3-4 digit × 2 numbers",
      type: "add",
      digits: [3, 4],
      numbers: 2,
    },
    {
      name: "Addition: 3-4 digit × 3-4 numbers",
      type: "add",
      digits: [3, 4],
      numbers: [3, 4],
    },
    {
      name: "Subtraction: 1 digit × 2 numbers",
      type: "sub",
      digits: 1,
      numbers: 2,
    },
    {
      name: "Subtraction: 2 digit × 2 numbers",
      type: "sub",
      digits: 2,
      numbers: 2,
    },
    {
      name: "Subtraction: 2 digit × 2 numbers (borrowing)",
      type: "sub",
      digits: 2,
      numbers: 2,
      borrowing: true,
    },
    {
      name: "Subtraction: 3-4 digit × 2 numbers",
      type: "sub",
      digits: [3, 4],
      numbers: 2,
    },
    {
      name: "Subtraction: 3-4 digit × 2 numbers (borrowing)",
      type: "sub",
      digits: [3, 4],
      numbers: 2,
      borrowing: true,
    },
    {
      name: "Multiplication: 1 digit × 1 digit",
      type: "mul",
      digits: 1,
      numbers: 2,
    },
    {
      name: "Multiplication: 2 digit × 1 digit",
      type: "mul",
      digits: [2, 1],
      numbers: 2,
    },
    {
      name: "Multiplication: 2 digit × 2 digit",
      type: "mul",
      digits: 2,
      numbers: 2,
    },
    {
      name: "Multiplication: 3-4 digit × 1 digit",
      type: "mul",
      digits: [[3, 4], 1],
      numbers: 2,
    },
    {
        name: "Multiplication: 2 digit × 3-4 numbers",
        type: "mul",
        digits: 2,
        numbers: [3, 4],
    },
    {
        name: "Multiplication: 3-4 digit × 2 numbers",
        type: "mul",
        digits: [3, 4],
        numbers: 2,
    },
    {
        name: "Multiplication: 3-4 digit × 3-4 numbers",
        type: "mul",
        digits: [3, 4],
        numbers: [3, 4],
    },
    { name: "Division: 1 digit ÷ 1 digit", type: "div", digits: 1, numbers: 2 },
    {
      name: "Division: 2 digit ÷ 1 digit",
      type: "div",
      digits: [2, 1],
      numbers: 2,
    },
    { name: "Division: 2 digit ÷ 2 digit", type: "div", digits: 2, numbers: 2 },
  ];

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const getValue = (val) =>
    Array.isArray(val) ? getRandomInt(val[0], val[1]) : val;
  const genNum = (digits) => {
    const d = getValue(digits);
    if (d === 1) return getRandomInt(0, 9);
    return getRandomInt(Math.pow(10, d - 1), Math.pow(10, d) - 1);
  };

  return {
    getLevels: () => levels,
    generateQuestion: (levelIndex) => {
      const level = levels[levelIndex - 1];
      let operands = [];
      let answer;

      const numOperands = getValue(level.numbers);

      switch (level.type) {
        case "add":
          for (let i = 0; i < numOperands; i++) {
            operands.push(genNum(level.digits));
          }
          answer = operands.reduce((sum, num) => sum + num, 0);
          break;

        case "sub":
          let num1, num2;
          if (level.borrowing) {
            do {
              num1 = genNum(level.digits);
              num2 = genNum(level.digits);
            } while (
              num1 <= num2 ||
              !String(num1)
                .split("")
                .some(
                  (digit, i) =>
                    digit < String(num2).padStart(String(num1).length, "0")[i]
                )
            );
          } else {
            num1 = genNum(level.digits);
            num2 = genNum(level.digits);
            if (num1 < num2) [num1, num2] = [num2, num1];
          }
          operands = [num1, num2];
          answer = num1 - num2;
          break;

        case "mul":
          for (let i = 0; i < numOperands; i++) {
            const digits = Array.isArray(level.digits)
              ? level.digits[i] || level.digits[0]
              : level.digits;
            operands.push(genNum(digits));
          }
          answer = operands.reduce((prod, num) => prod * num, 1);
          break;

        case "div":
          const divisorDigits = Array.isArray(level.digits)
            ? level.digits[1]
            : level.digits;
          const answerDigits = Array.isArray(level.digits)
            ? level.digits[0]
            : level.digits;
          const divisor = genNum(divisorDigits);
          answer = genNum(answerDigits);
          operands = [divisor * answer, divisor];
          break;
      }

      return {
        operands,
        operator: { add: "+", sub: "−", mul: "×", div: "÷" }[level.type],
        answer,
      };
    },
  };
})();

const AppController = ((
  GameState,
  UIController,
  StorageManager,
  ScoreManager,
  QuestionGenerator
) => {
  const setupEventListeners = () => {
    const DOM = UIController.getDOMstrings();

    document.querySelectorAll(DOM.navButtons).forEach((btn) => {
      btn.addEventListener("click", () => {
        UIController.showTab(btn.dataset.tab);
      });
    });

    document
      .querySelector(DOM.submitButton)
      .addEventListener("click", checkAnswer);
    document
      .querySelector(DOM.answerElement)
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") checkAnswer();
      });

    document
      .querySelector(DOM.levelListElement)
      .addEventListener("click", (e) => {
        const levelItem = e.target.closest(".level-item");
        if (levelItem) {
          e.preventDefault();
          const level = parseInt(levelItem.dataset.level);
          GameState.setCurrentLevel(level);
          UIController.updateLevel(level);
          startNewRound();
          UIController.showTab("home");
        }
      });

    document.querySelector(DOM.resetButton).addEventListener("click", () => {
      if (confirm("Are you sure you want to reset all your progress?")) {
        StorageManager.clearGameState();
        location.reload();
      }
    });

    document
      .querySelector(DOM.saveSettingsButton)
      .addEventListener("click", () => {
        const playerName = document.querySelector(DOM.playerNameInput).value;
        GameState.setPlayerName(playerName);
        StorageManager.saveGameState(GameState.getState());
        alert("Settings saved!");
      });
  };

  const startNewRound = () => {
    const level = GameState.getCurrentLevel();
    const question = QuestionGenerator.generateQuestion(level);
    GameState.setCurrentQuestion(question);
    UIController.displayQuestion(question);
    StorageManager.saveGameState(GameState.getState());
  };

  const checkAnswer = () => {
    const answerInput = document.querySelector(
      UIController.getDOMstrings().answerElement
    );
    const submitButton = document.querySelector(
      UIController.getDOMstrings().submitButton
    );

    if (answerInput.value === "") return; // Don't do anything if input is empty

    const userAnswer = parseInt(answerInput.value);
    const correctAnswer = GameState.getCurrentQuestion().answer;

    if (userAnswer === correctAnswer) {
      const newState = ScoreManager.correctAnswer(GameState.getState());
      GameState.setState(newState);
      UIController.showFeedback("Correct!", true);
    } else {
      const newState = ScoreManager.incorrectAnswer(GameState.getState());
      GameState.setState(newState);
      UIController.showFeedback(
        `Try again! The correct answer was ${correctAnswer}.`,
        false
      );
    }

    UIController.updateScore(GameState.getCurrentScore());

    // Disable controls to prevent multiple submissions
    answerInput.disabled = true;
    submitButton.disabled = true;

    setTimeout(() => {
      startNewRound();
      // Re-enable for next question
      answerInput.disabled = false;
      submitButton.disabled = false;
      answerInput.focus();
    }, 2000); // 2 second delay
  };

  const init = () => {
    const savedState = StorageManager.loadGameState();
    if (savedState) {
      GameState.setState(savedState);
    }

    const levels = QuestionGenerator.getLevels();
    GameState.setLevels(levels);
    UIController.populateLevels(levels);

    UIController.updateScore(GameState.getCurrentScore());
    UIController.updateLevel(GameState.getCurrentLevel());
    UIController.updateSettings(
      GameState.getCurrentLevel(),
      GameState.getCurrentScore(),
      GameState.getPlayerName()
    );

    UIController.showTab("home");
    startNewRound();
    setupEventListeners();
  };

  return {
    init,
  };
})(GameState, UIController, StorageManager, ScoreManager, QuestionGenerator);

document.addEventListener("DOMContentLoaded", AppController.init);
