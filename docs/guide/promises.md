<script setup>
import OuraDemo from '../components/OuraDemo.vue'
</script>

# Promises

Oura has first-class support for async operations. Use `Oura.promise()` to automatically display **loading → success / error** states with a single call.

## Basic Usage

```javascript
import Oura from 'oura-js';

const fetchData = fetch('/api/data').then(r => r.json());

Oura.promise(fetchData, {
  loading: 'Fetching data...',
  success: 'Data loaded successfully!',
  error: 'Failed to load data.'
});
```

<OuraDemo type="promise" label="▶ Try Promise Toast" />

## Dynamic Messages

The `success` and `error` values can be functions that receive the resolved/rejected value:

```javascript
const p = fetch('/api/user').then(r => r.json());

Oura.promise(p, {
  loading: 'Loading user...',
  success: (user) => `Welcome back, ${user.name}!`,
  error: (err) => `Error ${err.status}: ${err.message}`
});
```

## Async/Await + preConfirm

Use `preConfirm` inside `.prompt()` or `.confirm()` to run async logic before resolving. Oura will display a loading spinner on the confirm button and show any thrown errors as validation messages:

```javascript
const result = await Oura.prompt({
  title: 'Enter Access Code',
  text: 'Type "unlock" to continue.',
  preConfirm: async (value) => {
    // Simulate an API call
    await new Promise(r => setTimeout(r, 1000));

    if (value !== 'unlock') {
      throw new Error('Invalid code. Please try again.');
    }

    return value; // returned value populates result.value
  }
});

if (result.isConfirmed) {
  Oura.success('Access granted!');
}
```

<OuraDemo type="async" label="▶ Try Async Prompt" />

:::tip
`Oura.promise()` returns a `Promise<T>` that resolves/rejects with the original value so you can still chain `.then()` and `.catch()` as normal.
:::
