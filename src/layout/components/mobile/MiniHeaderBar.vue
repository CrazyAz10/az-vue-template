<template>
  <transition name="slide-transform" mode="out-in">
    <div v-if="mobileNavSlide" class="header-bar-wrap">
      <div id="miniHeaderBar">
        <div class="farm-header-logo">
          <router-link key="home" class="sidebar-logo-link" to="/home">
            <img src="@/assets/img/logo-whiter.png" alt="">
          </router-link>
          <span>{{ $t('l.home_top_title_8') }}</span>
        </div>
        <div class="farm-header">
          <WalletConnectContainer />
          <LangSelect />
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
  name: 'MiniHeaderBar',
  components: {
    LangSelect,
    WalletConnectContainer
  },
  mixins: [commonMixins],
  data() {
    return {
      showHead: true,
      showNotice: true,
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
    this.$ELEMENT.size = 'default'
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
<style lang="scss" scoped>
@import '@/styles/theme.scss';
.header-bar-wrap{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 2000;
  #miniHeaderBar{
    .farm-header-logo{
      background: $--color-primary;
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      padding: 15px 0;
      img{
        max-height: 100%;
      }
      span{
        color: #fff;
        font-size: 24px;
        font-weight: 800;
        margin-left: 10px;
      }
    }
    .farm-header{
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
      padding: 0 24px;
      background: #CB8326;
      color: #fff;
      >>>.farm-header-navbar-right-user{
        line-height: 70px;
        color: #fff;
        .farm-header-navbar-right-user-info{
          color: #fff;
        }
      }
    }
  }
}
</style>
