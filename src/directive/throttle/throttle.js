export default {
  inserted: (el, binding) => {
    let delay = binding.args
    if (!delay) delay = 500
    let time = null
    el.addEventListener('click', () => {
      if (!time) {
        time = setTimeout(() => {
          binding.value()
          time = null
        }, delay)
      }
    })
  }
}
