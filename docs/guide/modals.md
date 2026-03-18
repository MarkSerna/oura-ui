<script setup>
import OuraDemo from '../components/OuraDemo.vue'
</script>

# Modals

Oura provides huge flexibility for generating center-screen dialogs perfect for warnings, configurations, or input capture.

## Fire a Custom Modal

Use the `Oura.fire()` method with a configuration object map.

```javascript
import Oura from 'oura-js';

Oura.fire({
  title: 'Network Error',
  text: 'Unable to sync with the central database.',
  icon: 'error',
  confirmButtonText: 'Retry Connection'
});
```

<OuraDemo type="error" label="▶ Try Custom Error Modal" />

## Confirm Action

The `.confirm` method automatically binds a Cancel and Confirm UI.

```javascript
const result = await Oura.confirm('Delete Workspace?', 'This action cannot be undone.');

if (result.isConfirmed) {
  Oura.success('Workspace Terminated!');
} else {
  Oura.info('Action canceled.');
}
```

<OuraDemo type="confirm" label="▶ Try Confirm Action" />

## Input Prompt

Capture direct user input elegantly without needing form structures!

```javascript
const result = await Oura.prompt('Enter your email', 'We will send a reset link', 'email');

if (result.isConfirmed && result.value) {
  Oura.toast(`Link safely dispatched to ${result.value}`);
}
```

<OuraDemo type="prompt" label="▶ Try Input Prompt" />
