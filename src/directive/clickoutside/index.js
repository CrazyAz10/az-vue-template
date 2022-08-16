import clickOutside from './clickoutside'

const install = function(Vue) {
  Vue.directive('click-outside', clickOutside)
}

if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

clickOutside.install = install
export default clickOutside
