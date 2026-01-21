import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Icon from './components/Icon.vue'
import FeatureIcon from './components/FeatureIcon.vue'
import CheckList from './components/CheckList.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Icon', Icon)
    app.component('FeatureIcon', FeatureIcon)
    app.component('CheckList', CheckList)
  }
}
