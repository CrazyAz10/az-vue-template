<template>
  <div id="miniFooterBar">
    <div class="container">
      <div class="farm-footer">
        <ul>
          <li :class="{'active': $route.path=='/home'}">
            <router-link key="explain" to="/home">
              <p>
                <i class="el-icon-s-home" />
              </p>
              <p>{{ $t('l.home_index') }}</p>
            </router-link>
          </li>
          <li :class="{'active': $route.path=='/helpPage'}">
            <router-link key="explain" to="/helpPage">
              <p>
                <i class="el-icon-s-management" />
              </p>
              <p>{{ $t('l.home_top_title_6') }}</p>
            </router-link>
          </li>
          <li @click="noDeveloped">
            <a>
              <p>
                <i class="el-icon-s-cooperation" />
              </p>
              <p>{{ $t('l.home_top_title_4') }}</p>
            </a>
          </li>
          <li :class="{'active': $route.path=='/user'}" @click="toUserPage">
            <a>
              <p>
                <i class="el-icon-s-finance" />
              </p>
              <p>{{ $t('l.lable_31') }}</p>
            </a>
          </li>
          <li>
            <p>
              <i class="el-icon-menu" />
            </p>
            <p>{{ $t('l.lable_32') }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import commonMixins from '@/mixins'
export default {
  name: 'MiniFooterBar',
  components: {
  },
  mixins: [commonMixins],
  data() {
    return {
    }
  },
  computed: {
    // 钱包连接状态
    connectStatus: function() {
      return this.$store.getters.connectStatus
    }
  },
  methods: {
    toUserPage() {
      if (!this.connectStatus) {
        this.$message({
          type: 'warning',
          message: this.$t('l.info_43')
        })
      } else {
        this.$router.push({ path: '/user', query: { type: 'mutId', time: Date.now() }})
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/styles/theme.scss';
#miniFooterBar{
  .farm-footer{
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 900;
    ul{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      width: 100%;
      li{
        width: 25%;
        list-style: none;
        text-align: center;
        padding: 12px 0;
        font-size: 20px;
        color: #444;
        i{
          font-size: 42px;
        }
        img{
          height: 42px;
          margin-bottom: 5px;
        }
        .normal{
          display: inline-block;
        }
        .highlight{
          display: none;
        }
        &.active{
          color: $--color-primary;
          .normal{
            display: none;
          }
          .highlight{
            display: inline-block;
          }
        }
      }
    }
  }
  .mask .mask-content{
    width: 100%;
  }
  .more{
    color: #fff;
    text-align: center;
    padding: 80px 0;
    position: relative;
    max-height: 100vh;
    overflow: auto;
    .el-icon-close{
      font-size: 54px;
      color: #fff;
      position: absolute;
      right: 10px;
      top: 20px;
    }
    .tips{
      font-size: 28px;
      line-height: 32px;
      white-space: nowrap;
      margin-bottom: 26px;
    }
    .item{
      margin-bottom: 35px;
      img{
        width: 222px;
        margin-bottom: 10px;
      }
      font-size: 24px;
    }
  }
}
</style>
