<template>
  <div id="footerBar">
    <div class="container">
      <div class="farm-footer">
        <div class="farm-footer-logo">
          <router-link key="home" class="sidebar-logo-link" to="/">
            <img src="@/assets/img/logo.png" alt="">
          </router-link>
        </div>
        <div class="farm-footer-navbar">
          <ul class="farm-footer-navbar-ul">
            <li class="farm-footer-navbar-ul-li" @click="noDeveloped">
              <a key="nft">
                {{ $t('l.home_top_title_3') }}
              </a>
            </li>
            <li class="farm-footer-navbar-ul-li" @click="noDeveloped">
              <a key="forecast">
                {{ $t('l.home_top_title_4') }}
              </a>
            </li>
            <li class="farm-footer-navbar-ul-li" @click="noDeveloped">
              <a key="lottery">
                {{ $t('l.home_top_title_5') }}
              </a>
            </li>
            <li class="farm-footer-navbar-ul-li">
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

      </div>
    </div>
  </div>
</template>

<script>
import commonMixins from '@/mixins'
export default {
  name: 'FooterBar',
  mixins: [commonMixins],
  data() {
    return {}
  },
  computed: {

  }
}
</script>
<style lang="scss">
#footerBar{
  width: 100%;
  height: 136px;
  margin-top: 20px;

    background: #fff;
  .farm-footer {
    padding-top:32px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-navbar{
    height: 100%;
    display: flex;
      &-ul{
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
        &-li{
          list-style: none;
          display: flex;
          a{
            padding: 0 10px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #444;
                text-transform: uppercase;
            &:hover{
              color: #dd9231;
            }
          }
        }
      }
    }
}
}
</style>
