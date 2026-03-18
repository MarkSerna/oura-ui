<script setup>
import OuraDemo from '../components/OuraDemo.vue'
</script>

# Toasts

Toasts are non-blocking, transient notifications that elegantly stack in the corner of the user's screen.

## Simple Toast

Standard toast invocation:
```javascript
import Oura from 'oura-js';

Oura.success('Profile saved successfully');
Oura.error('Failed to upload file');
Oura.info('New message received');
```

<div style="display:flex; gap:10px;">
  <OuraDemo type="success" label="▶ Success Toast" />
</div>

## Progress Toast

You can display an animated progress bar indicating time left before dismissal. This is highly recommended for loading states.

```javascript
Oura.toast({
  title: 'Uploading 3 files...',
  type: 'progress',
  timer: 4500, // Duration of the progress bar in ms
  icon: 'progress'
});
```

<OuraDemo type="progress" label="▶ Progress Toast" />
