<script setup>
import { onMounted, ref, shallowRef } from 'vue'

const Oura = shallowRef(null)
let currentTheme = ref('light-glass')

onMounted(async () => {
  const module = await import('../../src/index.ts')
  Oura.value = module.default
})

// ── Theme ──
function toggleTheme() {
  if (!Oura.value) return
  currentTheme.value = currentTheme.value === 'light-glass' ? 'dark-glass' : 'light-glass'
  Oura.value.configure({ theme: currentTheme.value })
}
function setTheme(t) {
  if (!Oura.value) return
  currentTheme.value = t
  Oura.value.configure({ theme: t })
}

// ── Position ──
const activePos = ref('top-right')
function setPos(pos) {
  if (!Oura.value) return
  activePos.value = pos
  Oura.value.configure({ position: pos })
  Oura.value.toast({ title: 'Position Updated', text: `Aligned to ${pos}`, icon: 'success' })
}

// ── Language ──
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
function selectLang(lang) {
  if (!Oura.value) return
  currentLang.value = lang
  langOpen.value = false
  Oura.value.configure({ locale: lang.code })
  Oura.value.toast({ title: 'Language updated', icon: 'success' })
}

// ── Demos ──
function triggerDrawer() {
  if (!Oura.value) return
  Oura.value.drawer({
    title: 'User Preferences',
    html: `<div style="display:flex;flex-direction:column;gap:20px;">
      <p>Change your global application settings here.</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <input type="checkbox" id="check1" checked> <label for="check1">Enable Notifications</label>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <input type="checkbox" id="check2"> <label for="check2">Beta Features</label>
      </div>
    </div>`,
    side: 'right',
    confirmButtonText: 'Save Settings',
    width: '450px'
  }).then(r => {
    if (r.isConfirmed) Oura.value.success('Settings Saved')
  })
}

function triggerPromise() {
  if (!Oura.value) return
  const p = new Promise((resolve, reject) => {
    setTimeout(() => Math.random() > 0.3 ? resolve("v1.3.0 Payload") : reject("Timeout 404"), 2000)
  })
  Oura.value.promise(p, {
    loading: 'Fetching Data...',
    success: (d) => `Received: ${d}`,
    error: (e) => `Error: ${e}`
  })
}

async function triggerAsync() {
  if (!Oura.value) return
  const res = await Oura.value.prompt({
    title: 'Authentication',
    text: 'Enter "unlock" to proceed',
    preConfirm: async (val) => {
      await new Promise(r => setTimeout(r, 1000))
      if (val !== 'unlock') throw new Error('Invalid Code')
    }
  })
  if (res.isConfirmed) Oura.value.success('Access Granted')
}

function triggerStack() {
  if (!Oura.value) return
  const msgs = ["System Initialized", "Checking Records", "Compiling Assets", "Deploying Grid", "Done!"]
  msgs.forEach((m, i) => {
    setTimeout(() => {
      Oura.value.toast({ title: m, icon: i === 4 ? 'success' : 'info' })
    }, i * 150)
  })
}

const positions = [
  { key: 'top-left', label: 'TL' },
  { key: 'top-center', label: 'TC' },
  { key: 'top-right', label: 'TR' },
  { key: 'bottom-left', label: 'BL' },
  { key: 'bottom-center', label: 'BC' },
  { key: 'bottom-right', label: 'BR' },
]
</script>

<template>
  <div class="pg-root" @click="langOpen = false">
    <!-- TOP BAR -->
    <div class="pg-top-bar">
      <div class="pg-lang-wrapper" @click.stop>
        <div class="pg-lang-trigger" @click="langOpen = !langOpen">
          <img :src="`https://flagcdn.com/w20/${currentLang.flag}.png`" :alt="currentLang.label">
          {{ currentLang.label }}
        </div>
        <div class="pg-lang-options" v-show="langOpen">
          <div class="pg-lang-option" v-for="l in langs" :key="l.code" @click="selectLang(l)">
            <img :src="`https://flagcdn.com/w20/${l.flag}.png`" :alt="l.label">
            {{ l.label }}
          </div>
        </div>
      </div>
      <button class="pg-icon-btn" @click="toggleTheme" title="Toggle Theme">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
    </div>

    <div class="pg-layout">
      <!-- SIDEBAR -->
      <aside class="pg-sidebar">
        <h1 class="pg-logo">
          <div class="pg-logo-icon"></div>
          Oura
        </h1>
        <p class="pg-logo-sub">
          <strong>v1.3.0 "Glass Edition"</strong><br>
          The industry's most versatile glassmorphism component library.
        </p>

        <div class="pg-section-title">Layout &amp; Position</div>
        <div class="pg-pos-grid">
          <button
            v-for="p in positions" :key="p.key"
            class="pg-pos-btn"
            :class="{ active: activePos === p.key }"
            @click="setPos(p.key)"
          >{{ p.label }}</button>
        </div>

        <div class="pg-section-title">Next-Gen Components</div>
        <div class="pg-grid-controls">
          <button class="pg-btn" @click="triggerDrawer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
            <span>Side Sheet</span>
          </button>
          <button class="pg-btn" @click="triggerPromise">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Promises</span>
          </button>
          <button class="pg-btn" @click="triggerAsync">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Async Validate</span>
          </button>
          <button class="pg-btn" @click="triggerStack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span>3D Stack</span>
          </button>
        </div>

        <div class="pg-section-title">Theme Control</div>
        <div class="pg-grid-controls">
          <button class="pg-btn" @click="setTheme('light-glass')">Light</button>
          <button class="pg-btn" @click="setTheme('dark-glass')">Dark</button>
          <button class="pg-btn" @click="setTheme('system')">System Sync</button>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="pg-main">
        <div class="pg-glass-card">
          <h2 class="pg-card-title">Live Integration</h2>
          <pre class="pg-code">Oura.configure({
  position: '{{ activePos }}',
  theme: 'system'
});

Oura.drawer({
  title: 'Settings',
  side: 'right',
  html: '&lt;p&gt;Configure your app data...&lt;/p&gt;'
});</pre>
        </div>

        <div class="pg-glass-card">
          <h3 style="margin-top:0">v1.3.0 Engine</h3>
          <p class="pg-engine-desc">
            - <strong>Sheets</strong>: Floating side panels with glass physics.<br>
            - <strong>Universal Positioning</strong>: 6-way anchor system.<br>
            - <strong>Auto-Theme</strong>: Native OS light/dark detection.
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.pg-root {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background:
    radial-gradient(circle at 10% 20%, #eff6ff, transparent 40%),
    radial-gradient(circle at 90% 80%, #f5f3ff, transparent 40%),
    radial-gradient(circle at 40% 60%, #e0f2fe, transparent 50%),
    radial-gradient(circle at 80% 20%, #fce7f3, transparent 40%),
    #f8fafc;
  min-height: 100vh;
  color: #1e293b;
  transition: all 0.5s ease;
}

.pg-top-bar {
  position: fixed; top: 24px; right: 24px; z-index: 1000;
  display: flex; gap: 12px; align-items: center;
}

.pg-icon-btn {
  width: 42px; height: 42px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(16px);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease; color: #475569;
}
.pg-icon-btn:hover { background: rgba(255,255,255,0.9); transform: translateY(-2px); }
.pg-icon-btn svg { width: 18px; height: 18px; }

/* Lang Dropdown */
.pg-lang-wrapper { position: relative; user-select: none; }
.pg-lang-trigger {
  padding: 10px 18px; border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(16px);
  font-size: 0.95rem; font-weight: 600; cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  display: flex; align-items: center; gap: 8px;
}
.pg-lang-trigger:hover { background: rgba(255,255,255,0.9); transform: translateY(-2px); }
.pg-lang-trigger img { width: 20px; border-radius: 3px; }
.pg-lang-options {
  position: absolute; top: 115%; right: 0;
  background: rgba(255,255,255,0.85); backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.8); border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  overflow: hidden; display: flex; flex-direction: column; min-width: 140px;
}
.pg-lang-option {
  padding: 10px 18px; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  font-weight: 500; transition: background 0.2s;
}
.pg-lang-option:hover { background: rgba(59,130,246,0.1); }
.pg-lang-option img { width: 20px; border-radius: 3px; }

/* Layout */
.pg-layout {
  display: grid; grid-template-columns: 350px 1fr; min-height: 100vh;
}

/* Sidebar */
.pg-sidebar {
  background: rgba(255,255,255,0.3); backdrop-filter: blur(30px);
  border-right: 1px solid rgba(255,255,255,0.5);
  padding: 40px; overflow-y: auto;
  position: sticky; top: 0; height: 100vh; box-sizing: border-box;
}

.pg-logo {
  font-size: 2.5rem; font-weight: 700; letter-spacing: -0.05em;
  margin: 0 0 24px; display: flex; align-items: center; gap: 12px;
}
.pg-logo-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 12px; box-shadow: 0 8px 16px rgba(59,130,246,0.3);
}
.pg-logo-sub {
  font-size: 0.9rem; color: #64748b; line-height: 1.6;
}

.pg-section-title {
  font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;
  color: #64748b; margin: 24px 0 12px; font-weight: 700;
}

.pg-grid-controls { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }

.pg-btn {
  background: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.8);
  padding: 12px; border-radius: 14px; cursor: pointer; font-weight: 600;
  display: flex; align-items: center; gap: 10px;
  transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
  color: #334155; font-size: 0.85rem; font-family: inherit;
}
.pg-btn:hover { background: white; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
.pg-btn svg { width: 18px; height: 18px; opacity: 0.7; }

/* Position Grid */
.pg-pos-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 20px; }
.pg-pos-btn {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; border: 2px dashed rgba(0,0,0,0.1); background: transparent;
  cursor: pointer; border-radius: 10px; transition: all 0.2s;
  font-family: inherit; font-weight: 600; color: #64748b;
}
.pg-pos-btn:hover { border-color: #3b82f6; color: #3b82f6; }
.pg-pos-btn.active { background: rgba(59,130,246,0.1); border-color: #3b82f6; color: #3b82f6; font-weight: bold; }

/* Main */
.pg-main {
  padding: 60px; display: flex; flex-direction: column; gap: 32px;
}

.pg-glass-card {
  background: rgba(255,255,255,0.5); backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.4); border-radius: 20px;
  padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.03);
}
.pg-card-title { margin: 0 0 12px; font-weight: 700; }

.pg-code {
  background: #1e293b; border-radius: 16px; padding: 24px;
  color: #94a3b8; font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.85rem; line-height: 1.6;
  box-shadow: 0 30px 60px rgba(0,0,0,0.2);
  white-space: pre; overflow-x: auto; margin: 0;
}

.pg-engine-desc { font-size: 0.9rem; color: #64748b; }
</style>
