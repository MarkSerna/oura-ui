import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Oura.js",
  description: "A premium, lightweight, glassmorphism notification library.",
  base: '/ourajs/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'Modals', link: '/guide/modals' },
          { text: 'Toasts', link: '/guide/toasts' },
          { text: 'Drawers', link: '/guide/drawers' },
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Promises & Async', link: '/guide/promises' },
          { text: 'Positioning', link: '/guide/positioning' },
          { text: 'Internationalization', link: '/guide/i18n' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MarkSerna/ourajs' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Oura Open Source'
    }
  }
})
