import debounce from './debounce'

const install = function(Vue) {
  Vue.directive('throttle', debounce)
}

if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

debounce.install = install
export default debounce
