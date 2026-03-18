# Oura JS 🌙

[![GitHub](https://img.shields.io/badge/GitHub-MarkSerna%2Fourajs-blue?style=for-the-badge&logo=github)](https://github.com/MarkSerna/ourajs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Oura JS** is a modern, glassmorphic notification library powered by ES6+ and TypeScript. Designed to be lightweight, customizable, and visually stunning, it brings a sleek, premium feel to your web applications' notifications, modals, and drawers.

---

## ✨ Features

- 🧊 **Glassmorphism**: Beautiful, translucent UI components out of the box.
- 📱 **Responsive**: Fully responsive design that works seamlessly on any device.
- 🔔 **Multiple Layouts**: Support for Toasts, Modals, Prompt, Confirm, and Side Drawers.
- 🌗 **Theme Sync**: Automatic system theme detection (Light/Dark glass modes).
- 🧩 **TypeScript**: Full type safety and intelligent IDE support.
- 🌍 **I18n**: Built-in support for multiple languages and easy custom localization.
- ⚡ **Lightweight**: Zero dependencies, optimized for performance.

---

## 🚀 Installation

Install via npm:

```bash
npm install oura-js
```

Or via yarn:

```bash
yarn add oura-js
```

---

## 🛠️ Quick Start

Import Oura and start firing notifications!

```javascript
import Oura from 'oura-js';

// Basic success notification
Oura.success('Success!', 'Your profile has been updated.');

// Custom Modal
Oura.fire({
  title: 'Welcome!',
  text: 'Explore the modern world of Oura JS.',
  icon: 'info',
  confirmButtonText: 'Let\'s go!'
});

// Confirm dialog
const result = await Oura.confirm({
  title: 'Delete post?',
  text: 'This action cannot be undone.',
  icon: 'warning'
});

if (result.isConfirmed) {
  // Proceed with deletion...
}
```

---

## 📖 API Reference

### Configuration

Customize the global behavior of Oura JS:

```javascript
Oura.configure({
  theme: 'system', // 'light-glass', 'dark-glass', or 'system'
  accent: '#7c3aed', // Primary accent color
  position: 'top-right', // 'top-left', 'top-center', 'bottom-right', etc.
  locale: 'en' // Default language
});
```

### Methods

| Method | Description |
| :--- | :--- |
| `Oura.fire(options)` | Opens a standard modal. |
| `Oura.confirm(options)` | Opens a confirmation dialog with Cancel/Confirm buttons. |
| `Oura.prompt(options)` | Opens a modal with an input field. |
| `Oura.toast(options)` | Fires a stackable toast notification. |
| `Oura.drawer(options)` | Opens a side drawer (sheet). |
| `Oura.promise(promise, msgs)` | Handles a promise with loading, success, and error states. |
| `Oura.success/info/warning/error(title, text)` | Shorthand methods for toast notifications. |

---

## 🎨 Layout Options

Oura supports several layout variants:

- **Modals**: Centered overlays for critical actions.
- **Toasts**: Non-blocking notifications that stack (top or bottom).
- **Drawers**: Side panels that slide in from any edge (`left`, `right`, `top`, `bottom`).
- **Progress**: Toasts with a visual timer progress bar.

---

## 📜 License

Oura JS is open-source software licensed under the [MIT License](LICENSE).

---

Developed with ❤️ by [Mark Serna](https://github.com/MarkSerna) and the Oura Team.
