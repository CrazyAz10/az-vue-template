<template>
  <div id="HelpPage" class="container-wrap">
    <div class="container">
      <div class="filter-bar">
        <div class="crumb">
          <span v-if="device!=='mobile'">{{ $t('l.home_top_title_2') }}>  {{ $t('l.personal_text1') }}</span>
        </div>
        <div class="search-bar">
          <div class="search-input">
            <i class="el-icon-search" />
            <input v-model="searchText" :placeholder="$t('l.introduction_box_text')" type="text">
            <button @click="search">{{ $t('l.button_11') }}</button>
          </div>
        </div>
      </div>
      <div class="article-chunk">
        <transition name="fade-transform" mode="out-in">
          <div class="category-list" :class="slideClass">
            <div v-if="device==='mobile'" class="slide-controller">
              <span />
              <i v-if="slide" class="el-icon-s-fold" @click="slide = !slide" />
              <i v-else class="el-icon-s-unfold" @click="slide = !slide" />
            </div>
            <div class="scroll-bar">
              <div v-for="(item, index) in categoryList" :key="index" class="category">
                <p class="tips">{{ item.category }}</p>
                <ul>
                  <li v-for="(item_, ind) in item.info" :key="ind" :class="{ 'active': details.id == item_.id,}" @click="checkItem(item_)">
                    <div class="title-wrap">
                      <img :src="item_.icon" alt="">
                      {{ item_.title }}
                      <i class="icons el-icon-arrow-right" />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </transition>
        <div class="details-bar">
          <el-empty v-if="!article.content" :description="$t('l.info_23')" />
          <div v-else>
            <div class="title">
              {{ article.title }}
            </div>
            <div class="content" v-html="article.content" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as system from '@/api/system'
import { scrollTo } from '@/utils/scrollTo'
export default {
  name: 'HelpPage',
  components: {
  },
  data() {
    return {
      searchText: '',
      categoryList: [],
      details: {
        id: '',
        title: ''
      },
      article: {
        title: '',
        content: ''
      },
      slide: false
    }
  },
  computed: {
    device() {
      return this.$store.getters.device
    },
    slideClass: function() {
      return {
        'slide-show': this.slide
      }
    }
  },
  created() {
    this.search()
    if (this.$route.query && this.$route.query.id) {
      this.details.id = this.$route.query.id
    }
  },
  methods: {
    search() {
      // 查询
      this.getCategory()
    },
    checkItem(item) {
      this.details = item
      this.slide = false
      this.getDetails()
      scrollTo(0)
    },
    getCategory() {
      system.getExplain({ keyword: this.searchText, lang: this.$store.getters.language })
        .then(res => {
          if (res.code === 1) {
            this.categoryList = res.data.list
            if (this.categoryList.length) {
              if (this.categoryList[0].info.length) {
                if (!this.details.id) {
                  this.details = this.categoryList[0].info[0]
                }
                this.getDetails()
              } else {
                this.details = {}
                this.article = {}
              }
            } else {
              this.details = {}
              this.article = {}
            }
          } else {
            this.details = {}
            this.article = {}
          }
        })
    },
    getDetails() {
      system.getExplainDetails({ id: this.details.id, lang: this.$store.getters.language })
        .then(res => {
          console.log(res)
          if (res.code === 1) {
            this.article = res.data
          } else {
            this.article = {}
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/theme.scss";
  #HelpPage{
    height: 100%;
    padding-bottom: 50px;
    // background: url('~@/assets/img/user/bg.png') no-repeat top center/ 100% auto, linear-gradient(180deg, #FFEED8, #FFF7EB, #FFF9F1);;
    .filter-bar{
      padding: 35px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .crumb{
        font-size: 14px;
        color: #555;
      }
      .search-bar{
        .search-input{
          height: 50px;
          padding: 3px;
          background: #fff;
          border-radius: 25px;
          i{
            font-size: 30px;
            display: inline-block;
            margin: 5px 15px;
            color: #999;
            vertical-align: middle;
          }
          input{
            background: none;
            outline: none;
            border: none;
            vertical-align: middle;
          }
          button{
            vertical-align: middle;
            border: none;
            padding: 14px 21px;
            line-height: 1em;
            background: linear-gradient(0deg, #FE9B40, #FFB744);
            border-radius: 21px;
            color: #fff;
            cursor: pointer;
            &:hover{
              background: linear-gradient(0deg, #FFB744, #FE9B40);
            }
          }
        }
      }
    }
    .article-chunk{
      min-height: 1100px;
      background: #FFFFFF;
      border-radius: 32px;
      display: flex;
      justify-content: space-between;
      .category-list{
        width: 485px;
        max-width: 100%;
        border-right: 6px solid #F4F4F4;
        .category{
          overflow: auto;
          .tips{
            margin-top: 20px;
            font-size: 18px;
            color: #444;
            padding: 15px 60px;
            font-weight: bold;
          }
          ul{
            li{
              list-style-type: none;
              padding: 0 60px;
              margin-top: -1px;
              cursor: pointer;
              &:hover,
              .active{
                background: #F4F4F4;
                .title-wrap{
                  color: $--color-primary;
                  border-color: transparent;
                  img{
                    filter: none;
                  }
                }
              }
              .title-wrap{
                position: relative;
                padding: 14px 0;
                border-top: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                img{
                  height: 42px;
                  margin-right: 10px;
                  vertical-align: middle;
                  filter: brightness(0);
                }
                .icons{
                  position: absolute;
                  right: 0;
                  top: 26px;
                  font-size: 16px;
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
      .details-bar{
        padding: 60px;
        flex: 1;
        .title{
          font-size: 36px;
          margin-bottom: 30px;
          color: $--color-primary-vice;
          padding-bottom: 20px;
          border-bottom: 1px solid #ccc;
        }
        .content{
          >>> img{
            max-width: 100%;
          }
        }
      }
    }
  }

.mobile{
  &.mobile-nav-slide{
    #HelpPage{
      .article-chunk{
        .category-list{
          top: 80px;
        }
      }
    }
    &.notice{
      #HelpPage{
        .article-chunk{
          .category-list{
            top: 160px;
          }
        }
      }
    }
  }
  #HelpPage{
    .article-chunk{
      .scroll-bar{
        height: 100%;
        overflow: auto;
      }
      .category-list{
        position: fixed;
        left: 0;
        top: 0;
        bottom: 89px;
        background: #fff;
        padding-top: 80px;
        transition: all .5s;
        transform: translateX(-100%);
        &.slide-show{
          transform: translateX(0);
          .slide-controller{
            transform: translateX(0);
            box-shadow: none;
          }
        }
        .slide-controller{
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          height: 80px;
          font-size: 40px;
          line-height: 80px;
          padding: 0 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transform: translateX(110px);
          background: #fff;
          color: $--color-primary;
          transition: all .5s;
          box-shadow: 10px 10px 10px rgba(0,0,0,.4);
          i{
            font-size: 50px;
          }
        }
      }
      .details-bar{

      }
    }
  }
}
</style>
