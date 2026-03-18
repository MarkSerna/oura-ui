<template>
  <button class="oura-demo-btn" @click="trigger">
    {{ label }}
  </button>
</template>

<script setup>
import { onMounted, shallowRef } from 'vue'

const props = defineProps(['type', 'label'])
const Oura = shallowRef(null)

onMounted(async () => {
  // We import dynamically from source to avoid Server-Side Rendering (SSR) issues in VitePress during build.
  // We bind it directly to the Vite compilation tree natively.
  const module = await import('../../src/index.ts')
  Oura.value = module.default
  
  // Set configuration to match the stylish dark glassmorphism of a documentation context
  Oura.value.configure({ theme: 'dark-glass', accent: '#8b5cf6' })
})

const trigger = async () => {
  if (!Oura.value) return
  
  const oura = Oura.value

  if (props.type === 'success') {
    oura.success('Profile saved successfully', 'Configuration merged.')
  } 
  else if (props.type === 'error') {
    oura.fire({
      title: 'Network Error',
      text: 'Unable to sync with the central database.',
      icon: 'error',
      confirmButtonText: 'Retry Connection'
    })
  }
  else if (props.type === 'confirm') {
    const res = await oura.confirm('Delete Workspace?', 'This action cannot be undone.')
    if (res.isConfirmed) {
      oura.success('Workspace Terminated!', 'All instances have been removed.')
    } else {
      oura.info('Action canceled.', 'Nothing was deleted.')
    }
  }
  else if (props.type === 'prompt') {
    const res = await oura.prompt('Enter your email', 'We will send a reset link', 'email')
    if (res.isConfirmed && res.value) {
      oura.toast({title: `Link sent to ${res.value}`, type: 'progress', timer: 3000, icon: 'success'})
    }
  }
  else if (props.type === 'progress') {
    oura.toast({
      title: 'Uploading 3 files...',
      type: 'progress',
      timer: 4500,
      icon: 'progress'
    })
  }
}
</script>

<style scoped>
.oura-demo-btn {
  background-color: var(--vp-c-brand-1);
  color: #fff;
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  font-weight: 600;
  font-family: system-ui, -apple-system, sans-serif;
  cursor: pointer;
  margin: 12px 0;
  font-size: 0.95rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}
.oura-demo-btn:hover {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
}
.oura-demo-btn:active {
  transform: translateY(0);
}
</style>
