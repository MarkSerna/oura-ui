// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import NavLangSelector from '../../components/NavLangSelector.vue'
import './custom.css'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(NavLangSelector)
    })
  }
}
