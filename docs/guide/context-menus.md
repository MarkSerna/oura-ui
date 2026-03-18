# Context Menus

Custom glassmorphic right-click menus. Replace the default browser context menu with a styled, accessible alternative.

## Basic Usage

```js
const cleanup = Oura.contextMenu('#my-area', [
  { label: 'Cut', shortcut: '⌘X', onClick: () => {} },
  { label: 'Copy', shortcut: '⌘C', onClick: () => {} },
  { label: 'Paste', shortcut: '⌘V', onClick: () => {} },
  { separator: true },
  { label: 'Delete', danger: true, onClick: () => {} }
]);
```

## Item Options

Same as [Dropdown Menu](/guide/dropdowns) items — supports `label`, `icon`, `shortcut`, `separator`, `disabled`, `danger`, and `onClick`.

## Example: File Manager

```js
Oura.contextMenu('#file-list', [
  { label: 'Open', icon: '📂', onClick: () => {} },
  { label: 'Rename', icon: '✏️', onClick: () => {} },
  { label: 'Share', icon: '🔗', onClick: () => {} },
  { separator: true },
  { label: 'Move to Trash', icon: '🗑️', danger: true, onClick: () => {} }
]);
```

## Cleanup

```js
const destroy = Oura.contextMenu('#el', [...]);
destroy(); // Removes context menu and listeners
```
