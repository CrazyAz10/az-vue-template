import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'animate.css'

import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters
// directive
import throttle from '@/directive/throttle/throttle'
import debounce from '@/directive/debounce/debounce'
Vue.directive('throttle', throttle)
Vue.directive('debounce', debounce)

// prototype
import { rpt } from '@/utils'
Vue.prototype.$rpt = rpt
import BigNumber from 'bignumber.js'
Vue.prototype.$BigNumber = BigNumber
import SwarmFarm from '@/utils/SwarmFarm'
Vue.prototype.$SwarmFarm = SwarmFarm

Vue.use(Element, {
  size: localStorage.getItem('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
var Vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
export default Vm
