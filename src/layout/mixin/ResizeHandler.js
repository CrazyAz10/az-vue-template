import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  watch: {
    $route(route) {
      // eslint-disable-next-line no-empty
    },
    device() {
      // var nowMeta = document.getElementsByName('meta')
      // console.log(nowMeta)
      // if (this.device === 'mobile') {
      //   // 当处于移动端状态时 缩放比例显示
      //   var meta = document.createElement('meta')
      //   meta.setAttribute('name', 'viewport')
      //   meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=1, user-scalable=no')
      //   document.head.appendChild(meta)
      // } else {
      //   var metaDom = document.createElement('meta')
      //   metaDom.setAttribute('name', 'viewport')
      //   metaDom.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
      //   document.head.appendChild(metaDom)
      // }
    }
  },
  beforeMount() {
  },
  computed: {
    device: function() {
      return this.$store.getters.device
    }
  },
  mounted() {
    const isMobile = this.isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
    }
    window.addEventListener('resize', this.resizeHandler)
  },
  methods: {
    isMobile() {
      const rect = body.getBoundingClientRect()
      // console.log(rect.width)
      return rect.width - 1 < WIDTH
    },
    resizeHandler() {
      if (!document.hidden) {
        const isMobile = this.isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        // eslint-disable-next-line no-empty
        if (isMobile) {
        }
      }
    }
  }
}
