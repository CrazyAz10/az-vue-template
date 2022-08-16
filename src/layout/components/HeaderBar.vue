<template>
  <transition name="slide-transform" mode="out-in">
    <div v-if="mobileNavSlide" class="header-bar-wrap">
      <div v-if="noticeSlideBar" class="notice">
        <div class="container">
          <img src="@/assets/img/bees-img.png" alt="">
          <div class="box-wrap">
            <div ref="noticeBox" class="box" @click="$router.push({ path: 'helpPage', query: {id: 23} })">
              <p ref="noticeText" class="animate" :style="animateStyle">{{ $t('l.home_top_notice_1') }}{{ $t('l.home_top_notice_2') }}</p>
            </div>
          </div>
        </div>
        <i class="el-icon-close" @click="closeNotice" />
      </div>
      <div id="headerBar">
        <div class="">
          <div class="farm-header">
            <div class="farm-header-logo">
              <router-link key="home" class="sidebar-logo-link" to="/home">
                <img src="@/assets/img/logo.png" alt="">
              </router-link>
              <span>{{ $t('l.home_top_title_8') }}</span>
            </div>
            <div class="farm-header-navbar">
              <div class="farm-header-navbar-left">
                <ul class="farm-header-navbar-left-ul">
                  <li class="farm-header-navbar-left-ul-li" @click="noDeveloped">
                    <a key="nft">
                      {{ $t('l.home_top_title_3') }}
                    </a>
                  </li>
                  <li class="farm-header-navbar-left-ul-li" @click="noDeveloped">
                    <a key="forecast">
                      {{ $t('l.home_top_title_4') }}
                    </a>
                  </li>
                  <li class="farm-header-navbar-left-ul-li" @click="noDeveloped">
                    <a key="lottery">
                      {{ $t('l.home_top_title_5') }}
                    </a>
                  </li>
                  <li class="farm-header-navbar-left-ul-li">
                    <router-link key="explain" to="/helpPage">
                      {{ $t('l.home_top_title_6') }}
                    </router-link>
                  </li>
                  <li class="farm-header-navbar-left-ul-li">
                    <a key="lottery" target="_blank" href="/whitepaper.pdf">
                      {{ $t('l.home_top_title_1') }}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="farm-header-navbar-right">
                <WalletConnectContainer />
                <LangSelect />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import WalletConnectContainer from '@/components/WalletConnectContainer'
import commonMixins from '@/mixins'
export default {
  name: 'HeaderBar',
  components: {
    LangSelect,
    WalletConnectContainer
  },
  mixins: [commonMixins],
  data() {
    return {
      scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
      noticeBoxWidth: 0,
      noticeTextWidth: 0
    }
  },
  computed: {
    animateStyle: function() {
      if (this.noticeBoxWidth > this.noticeTextWidth) {
        return {}
      } else {
        return { 'animation-duration': Math.floor(this.noticeTextWidth / 40) + 's' }
      }
    },
    mobileNavSlide: function() {
      return this.$store.getters.mobileNavSlide
    },
    noticeSlideBar: function() {
      return this.$store.getters.noticeSlideBar
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.noticeText) {
        this.noticeBoxWidth = this.$refs.noticeBox.offsetWidth
        this.noticeTextWidth = this.$refs.noticeText.offsetWidth
      }
    })
  },
  created() {
    this.$ELEMENT.size = 'medium'
    window.onscroll = () => {
      // 监听滚动条控制头部菜单栏下拉隐藏上拉显示
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 160 && scrollTop > this.scrollTop) {
        this.$store.dispatch('app/setMobileNavSlide', false)
      } else {
        this.$store.dispatch('app/setMobileNavSlide', true)
      }
      this.scrollTop = scrollTop
    }
  },
  methods: {
    closeNotice() {
      this.$store.dispatch('app/setNoticeSlideBar', false)
    }
  }
}
</script>

<style lang="scss" scoped src="./index.scss">
</style>
