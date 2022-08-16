<template>
  <div :class="classObj" class="app-wrapper">
    <div class="main-container">
      <mini-header-bar v-if="device==='mobile'" />
      <header-bar v-else />
      <app-main />
      <mini-footer-bar v-if="device==='mobile'" />
      <footer-bar v-else />
      <back-to-top :icon-size="iconSize" :custom-style="customStyle" />
    </div>
    <!-- 微信端浏览器提示跳转默认浏览器打开 -->
    <mask-pop :center-box="false" :visible.sync="showWXTips">
      <div class="weixin-tips">
        <svg-icon icon-class="top-right-arrow" />
        <p>{{ $t('l.info_45') }}</p>
      </div>
    </mask-pop>
  </div>
</template>

<script>
import { AppMain, HeaderBar, FooterBar, MiniHeaderBar, MiniFooterBar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import BackToTop from '@/components/BackToTop'
import maskPop from '@/views/home/components/maskPop'

export default {
  name: 'Layout',
  components: {
    HeaderBar,
    AppMain,
    FooterBar,
    BackToTop,
    MiniHeaderBar,
    MiniFooterBar,
    maskPop
  },
  mixins: [ResizeMixin],
  data() {
    return {
      showWXTips: false
    }
  },
  computed: {
    ...mapState({
      device: state => state.app.device,
      noticeSlideBar: state => state.app.noticeSlideBar
    }),
    mobileNavSlide: function() {
      return this.$store.getters.mobileNavSlide
    },
    iconSize: function() {
      if (this.device === 'mobile') {
        return 24
      } else {
        return 16
      }
    },
    // 调整回到顶部的样式
    customStyle: function() {
      if (this.device === 'mobile') {
        return {
          'z-index': 20,
          right: '50px',
          bottom: '120px',
          width: '80px',
          height: '80px',
          'border-radius': '8px',
          'line-height': '80px',
          'font-size': '30px',
          background: '#e7eaf1'
        }
      } else {
        return {
          'z-index': 20,
          right: '50px',
          bottom: '100px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px',
          'font-size': '16px',
          background: '#e7eaf1'
        }
      }
    },
    classObj() {
      return {
        // 适配开启
        mobile: this.device === 'mobile',
        notice: this.noticeSlideBar,
        'mobile-nav-slide': this.mobileNavSlide
      }
    }
  },
  created() {
    // 移动端强制转https协议访问
    if (this.device === 'mobile' && process.env.NODE_ENV !== 'development' && window.location.protocol !== 'https:') {
      window.location.href = window.location.href.replace('http:', 'https:')
    }
    this.weixinTips()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    weixinTips() {
      var browser = {
        versions: (function() {
          var u = navigator.userAgent
          return {
            trident: u.indexOf('Trident') > -1,
            presto: u.indexOf('Presto') > -1,
            webKit: u.indexOf('AppleWebKit') > -1,
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1,
            iPad: u.indexOf('iPad') > -1,
            webApp: u.indexOf('Safari') === -1,
            souyue: u.indexOf('souyue') > -1,
            superapp: u.indexOf('superapp') > -1,
            weixin: u.toLowerCase().indexOf('micromessenger') > -1,
            Safari: u.indexOf('Safari') > -1
          }
        }()),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
      }
      if (browser.versions.weixin) {
        this.showWXTips = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  .weixin-tips{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    font-size: 60px;
    color: #fff;
    padding-top: 100px;
    z-index: 10;
    .svg-icon{
      font-size: 100px;
      position: absolute;
      right: 8%;
      top: 10px;
    }
    p{
      text-align: center;
      padding: 20px;
    }
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    padding-top: 80px;
    // transition: all .5s;
    &.notice{
      padding-top: 160px;
    }
    &.mobile{
      .app-main{
        padding-bottom: 89px;
      }
    }
    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
