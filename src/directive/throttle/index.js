import throttle from './throttle'

const install = function(Vue) {
  Vue.directive('throttle', throttle)
}

if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

throttle.install = install
export default throttle
