import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/element-variables.scss'

import VueAddition from '@/addition'
import PortalVue from 'portal-vue'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAddition)
Vue.use(PortalVue)

let instance = null
function render(props = {}) {
  const { container } = props
  instance = new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

if (!window.__POWERED_BY_QIANKUN__) { render() }

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

export async function bootstrap() {
  console.log('app bootstrap')
}
export async function mount(props) {
  console.log('app mount')
  Vue.prototype.$onGlobalStateChange = props.onGlobalStateChange
  Vue.prototype.$setGlobalState = props.setGlobalState
  localStorage.setItem('configData', props?.configData)
  render(props)
}
export async function unmount() {
  instance.$destroy()
}
