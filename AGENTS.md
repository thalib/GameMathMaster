# AI Agent Coding Guidelines for Math Master

This document provides explicit coding guidelines, constraints, and best practices for AI coding agents working on the Math Master educational game project. All development MUST strictly follow the requirements and specifications defined in **[design/SPEC.md](./design/SPEC.md)**, which is the single source of truth for all project requirements.

Your primary goal is to produce code that is **simple, readable, and easy for humans to maintain.**

## Directory Structure

- `index.html`
- `scripts.js`
- `main.css`

## Guiding Principles

- **Clarity Over Cleverness:** Write straightforward code that is easy to understand. Avoid complex one-liners or obscure language features.
- **Single Responsibility Principle (SRP):** Every function and module should have one, and only one, reason to change.
- **Don't Repeat Yourself (DRY):** Avoid duplicating code. Use functions and modules to create reusable logic.
- **Modularity:** Keep different parts of the application separate. Changes to the UI should not break the game logic.

## Code Architecture

As specified in `REQ-NFR-001`, the code SHALL be organized into logical modules. Adhere to the following structure:

- **`GameState`:** Manages all application state, including the current score, level, streak, and player progress. It should be the single source of truth for all data.
- **`QuestionGenerator`:** Responsible for creating and returning new math problems based on the current level and difficulty rules in `SPEC.md`.
- **`UIController`:** Handles all DOM manipulation. It listens for user input, displays questions, renders feedback, and updates the screen based on changes in the `GameState`.
- **`ScoreManager`:** Manages scoring logic, including awarding points, calculating streaks, and tracking high scores.
- **`StorageManager`:** Handles saving and loading game data to and from `localStorage`.

This modular approach ensures that the application is easy to debug, maintain, and extend.

## JavaScript Best Practices

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


## Technology Stack Constraints

### Allowed Technologies

### Prohibited Technologies

❌ **NO** React, Vue, Angular, or any other JavaScript frameworks.
❌ **NO** jQuery, Lodash, or other utility libraries.
❌ **NO** TypeScript, CoffeeScript, or other languages that transpile to JavaScript.
❌ **NO** Webpack, Vite, Parcel, or other build tools.
❌ **NO** `npm` packages or any external dependencies.
❌ **NO** Canvas API (use DOM manipulation instead).
❌ **NO** Server-side code or backend APIs.
❌ **NO** WebAssembly or native modules.

## Styling and Script Guidelines

- **Bootstrap Reuse:** Always use Bootstrap classes for styling and layout. Only create custom CSS classes if no Bootstrap class meets the requirement.
- **No Inline Styles:** Do not use inline styles or inline CSS. All custom styles must go in `main.css`.
- **Reusable Scripts:** Use `scripts.js` as the main script file for reusable code. For maintainability, you may add additional `.css` and `.js` files if needed.
