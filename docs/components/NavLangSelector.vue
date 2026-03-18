<script setup>
import { onMounted, ref, shallowRef } from 'vue'

const Oura = shallowRef(null)
const langOpen = ref(false)
const currentLang = ref({ code: 'en', label: 'English', flag: 'gb' })
const langs = [
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'es', label: 'Español', flag: 'es' },
  { code: 'fr', label: 'Français', flag: 'fr' },
  { code: 'de', label: 'Deutsch', flag: 'de' },
  { code: 'ja', label: '日本語', flag: 'jp' },
  { code: 'ar', label: 'العربية', flag: 'sa' },
]

onMounted(async () => {
  const module = await import('../../src/index.ts')
  Oura.value = module.default
  document.addEventListener('click', () => { langOpen.value = false })
})

function selectLang(lang) {
  if (!Oura.value) return
  currentLang.value = lang
  langOpen.value = false
  Oura.value.configure({ locale: lang.code })
  Oura.value.toast({ title: 'Language updated', icon: 'success' })
}
</script>

<template>
  <div class="nav-lang-wrapper" @click.stop>
    <button class="nav-lang-trigger" @click="langOpen = !langOpen">
      <img :src="`https://flagcdn.com/w20/${currentLang.flag}.png`" :alt="currentLang.label">
      <span class="nav-lang-label">{{ currentLang.label }}</span>
    </button>
    <div class="nav-lang-options" v-show="langOpen">
      <div class="nav-lang-option" v-for="l in langs" :key="l.code" @click="selectLang(l)">
        <img :src="`https://flagcdn.com/w20/${l.flag}.png`" :alt="l.label">
        {{ l.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-lang-wrapper {
  position: relative;
  user-select: none;
  margin-left: 8px;
}

.nav-lang-trigger {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vp-c-text-1);
  font-family: inherit;
}

.nav-lang-trigger:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-elv);
}

.nav-lang-trigger img {
  width: 18px;
  border-radius: 2px;
}

.nav-lang-label {
  display: inline;
}

.nav-lang-options {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 150px;
  z-index: 100;
}

.nav-lang-option {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 0.85rem;
  transition: background 0.15s;
  color: var(--vp-c-text-1);
}

.nav-lang-option:hover {
  background: var(--vp-c-brand-soft);
}

.nav-lang-option img {
  width: 18px;
  border-radius: 2px;
}
</style>
