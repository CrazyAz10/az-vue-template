export default {
  inserted: (el, binding) => {
    let delay = binding.args
    if (!delay) {
      delay = 500
    }
    let time
    el.addEventListener('click', () => {
      if (time) {
        clearTimeout(time)
      }
      time = setTimeout(() => {
        binding.value()
      }, delay)
    })
  }
}
