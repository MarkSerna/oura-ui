# Dropdown Menus

Glassmorphic dropdown menus with icons, keyboard shortcuts, separators, danger items, and disabled states.

## Basic Usage

```js
const cleanup = Oura.dropdown('#menu-trigger', {
  items: [
    { label: 'Edit', icon: '✏️', onClick: () => console.log('Edit') },
    { label: 'Duplicate', icon: '📋', onClick: () => console.log('Duplicate') },
    { separator: true },
    { label: 'Delete', icon: '🗑️', danger: true, onClick: () => console.log('Delete') }
  ]
});
```

## Item Options

| Option | Type | Description |
|--------|------|-------------|
| `label` | `string` | Display text |
| `icon` | `string` | Emoji or HTML icon |
| `shortcut` | `string` | Keyboard shortcut label |
| `separator` | `boolean` | Renders a divider line |
| `disabled` | `boolean` | Grays out and disables click |
| `danger` | `boolean` | Red color styling |
| `onClick` | `() => void` | Click handler |

## Placement

```js
Oura.dropdown('#btn', {
  placement: 'bottom-end', // bottom-start | bottom-end | top-start | top-end
  items: [...]
});
```

## With Shortcuts

```js
Oura.dropdown('#file-menu', {
  items: [
    { label: 'New File', shortcut: '⌘N', onClick: () => {} },
    { label: 'Open', shortcut: '⌘O', onClick: () => {} },
    { label: 'Save', shortcut: '⌘S', onClick: () => {} },
    { separator: true },
    { label: 'Close', shortcut: '⌘W', onClick: () => {} }
  ]
});
```
