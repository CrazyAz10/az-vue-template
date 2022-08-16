<template>
  <el-dropdown trigger="hover" class="international" @command="handleSetLanguage">
    <div>
      <img class="icon" src="@/assets/img/map48.png" alt="" style="vertical-align: middle;cursor: pointer;">
    </div>
    <el-dropdown-menu slot="dropdown">
      <!-- <el-dropdown-item :disabled="language==='zh-CN'" command="zh-CN">
        中文
      </el-dropdown-item> -->
      <!-- <el-dropdown-item :disabled="language==='zh-TW'" command="zh-TW">
        繁体中文
      </el-dropdown-item> -->
      <el-dropdown-item :disabled="language==='cn'" command="cn">
        繁体中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">
        English
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='es'" command="es">
        Español
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='ko'" command="ko">
        한국어
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='fr'" command="fr">
        Français
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='de'" command="de">
        Deutsch
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='ja'" command="ja">
        日本語
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='vi'" command="vi">
        Tiếng Việt
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { requireLang, elementLang } from '@/lang'
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('app/setLanguage', lang)
      this.$i18n.mergeLocaleMessage(lang, Object.assign(requireLang(lang), elementLang[lang]))
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-dropdown-menu{
  border-radius: 32px !important;
}
>>> .el-dropdown-menu__item{
  font-size: 16px;
font-family: Microsoft YaHei;
font-weight: 400;
color: #666666;
line-height: 40px;
padding: 0 30px;
}
>>> .el-dropdown-menu__item.is-disabled{
  color: #6f65ee ;
}
>>> .el-dropdown-menu__item--divided:before{
  margin: 0 -30px !important;
}

>>> .el-dropdown-menu__item:hover{
  color: #6f65ee ;

background: #F7F6FE;
}
.mobile{
  .international{
    .icon{
      height: 40px;
    }
  }
}
</style>
