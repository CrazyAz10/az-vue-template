
export default function openApp() {
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

  if (browser.versions.ios) {
    window.location.href = 'metamask://dapp/192.168.10.6:9527'

    setTimeout(function() {
      window.location.href = 'metamask://dapp/192.168.10.6:9527'

      window.location.href = 'metamask://dapp/192.168.10.6:9527'
    }, 2000)
  } else if (browser.versions.android) {
    window.location.href = 'metamask://dapp/192.168.10.6:9527'

    setTimeout(function() {
      window.location.href = 'metamask://dapp/192.168.10.6:9527'
    }, 2000)
  }
}
