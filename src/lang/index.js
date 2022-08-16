import Vue from 'vue'
import VueI18n from 'vue-i18n'

import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementZhTwLocale from 'element-ui/lib/locale/lang/zh-TW'// element-ui lang
import elementEsLocale from 'element-ui/lib/locale/lang/es'// element-ui lang
import elementKoLocale from 'element-ui/lib/locale/lang/ko'// element-ui lang
import elementFrLocale from 'element-ui/lib/locale/lang/fr'// element-ui lang
import elementDeLocale from 'element-ui/lib/locale/lang/de'// element-ui lang
import elementJaLocale from 'element-ui/lib/locale/lang/ja'// element-ui lang
import elementViLocale from 'element-ui/lib/locale/lang/vi'// element-ui lang

import store from '@/store'
import storage from '@/utils/storage'

export function requireLang(lang) {
  // 获取视频教程配置
  store.dispatch('settings/getHelpVieo')

  var storageKey = 'farmLanguage-' + lang
  var lang__ = localStorage.getItem(storageKey) ? storage.getItem(storageKey) : null
  if (lang__) {
    return lang__
  }
  try {
    var _url = process.env.NODE_ENV === 'development' ? '/phpProxyApi' : process.env.VUE_APP_PHPAPI
    var xhr = new XMLHttpRequest()
    xhr.open('GET', `${_url}/api/lang/langlist?&device=web&lang=${lang}&_t=${Date.now()}`, false)
    xhr.send()
    lang__ = { l: JSON.parse(xhr.responseText).data }
  } catch (error) {
    lang__ = { l: {}}
  }
  storage.setItem({
    key: storageKey, // 存储的key
    value: lang__, // 存储的值
    validity: 600000 // 过期时间 单位：毫秒 缓存10分钟有效
  })
  return lang__
}

var language = store.getters.language

Vue.use(VueI18n)

export const elementLang = {
  'zh-CN': elementZhLocale,
  'zh-TW': elementZhTwLocale,
  'cn': elementZhTwLocale,
  'es': elementEsLocale,
  'en': elementEnLocale,
  'ko': elementKoLocale,
  'fr': elementFrLocale,
  'de': elementDeLocale,
  'ja': elementJaLocale,
  'vi': elementViLocale
}

const messages = {
  [language]: Object.assign(requireLang(language), elementLang[language])
}

const i18n = new VueI18n({
  locale: language,
  messages
})

export default i18n
