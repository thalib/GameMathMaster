# AI Agent Coding Guidelines for Math Master

This document provides explicit coding guidelines, constraints, and best practices for AI coding agents working on the Math Master educational game project. All development MUST strictly follow the requirements and specifications defined in **[SPEC.md](./SPEC.md)**, which is the single source of truth for all project requirements.

Your primary goal is to produce code that is **simple, readable, and easy for humans to maintain.**

---

## 1. Guiding Principles

- **Clarity Over Cleverness:** Write straightforward code that is easy to understand. Avoid complex one-liners or obscure language features.
- **Single Responsibility Principle (SRP):** Every function and module should have one, and only one, reason to change.
- **Don't Repeat Yourself (DRY):** Avoid duplicating code. Use functions and modules to create reusable logic.
- **Modularity:** Keep different parts of the application separate. Changes to the UI should not break the game logic.

---

## 2. Code Architecture

As specified in `REQ-NFR-001`, the code SHALL be organized into logical modules. Adhere to the following structure:

- **`GameState`:** Manages all application state, including the current score, level, streak, and player progress. It should be the single source of truth for all data.
- **`QuestionGenerator`:** Responsible for creating and returning new math problems based on the current level and difficulty rules in `SPEC.md`.
- **`UIController`:** Handles all DOM manipulation. It listens for user input, displays questions, renders feedback, and updates the screen based on changes in the `GameState`.
- **`ScoreManager`:** Manages scoring logic, including awarding points, calculating streaks, and tracking high scores.
- **`StorageManager`:** Handles saving and loading game data to and from `localStorage`.

This modular approach ensures that the application is easy to debug, maintain, and extend.

---

## 3. JavaScript Best Practices

- **Use Modern Syntax:** Use `const` for variables that are not reassigned and `let` for variables that are. Avoid using `var` to prevent scope issues.
- **Avoid Global Variables:** Encapsulate all code within modules or immediately-invoked function expressions (IIFEs) to avoid polluting the global namespace.
- **Write Pure Functions:** Whenever possible, write functions that do not have side effects. A pure function will always return the same output for the same input and does not modify any external state.
- **JSDoc Comments:** Document all functions with JSDoc-style comments explaining their purpose, parameters, and return values. For example:
  ```javascript
  /**
   * Generates a random integer between two values, inclusive.
   * @param {number} min The minimum value.
   * @param {number} max The maximum value.
   * @returns {number} A random integer between min and max.
   */
  function getRandomInt(min, max) {
    // ...
  }
  ```

---

## 4. Technology Stack Constraints

### Allowed Technologies

- **HTML5** - Semantic markup only
- **CSS3** - Bootstrap 5.3 is permitted but not required.
- **Vanilla JavaScript (ES6+)** - No frameworks or libraries.
- **Web APIs:** `localStorage`, Web Audio API (optional).

### Prohibited Technologies

❌ **NO** React, Vue, Angular, or any other JavaScript frameworks.
❌ **NO** jQuery, Lodash, or other utility libraries.
❌ **NO** TypeScript, CoffeeScript, or other languages that transpile to JavaScript.
❌ **NO** Webpack, Vite, Parcel, or other build tools.
❌ **NO** `npm` packages or any external dependencies.
❌ **NO** Canvas API (use DOM manipulation instead).
❌ **NO** Server-side code or backend APIs.
❌ **NO** WebAssembly or native modules.

---

## 5. File Structure

- `index.html`
- `scripts.js`
- `main.css`
