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
        text: 'Overlays',
        items: [
          { text: 'Modals', link: '/guide/modals' },
          { text: 'Toasts', link: '/guide/toasts' },
          { text: 'Drawers', link: '/guide/drawers' },
          { text: 'Popovers', link: '/guide/popovers' },
          { text: 'Tooltips', link: '/guide/tooltips' },
          { text: 'Hover Cards', link: '/guide/hover-cards' },
        ]
      },
      {
        text: 'Menus',
        items: [
          { text: 'Dropdown Menus', link: '/guide/dropdowns' },
          { text: 'Context Menus', link: '/guide/context-menus' },
        ]
      },
      {
        text: 'Feedback',
        items: [
          { text: 'Inline Alerts', link: '/guide/alerts' },
          { text: 'Skeletons', link: '/guide/skeletons' },
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
