// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'
import BigNumber from 'bignumber.js'
import Vm from '@/main'
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

// uint256数据类型转换
export function formatUint256(val) {
  if (isNaN(val * 1)) {
    return val
  } else {
    var val_ = new BigNumber(val)
    var x = new BigNumber(10)
    return val_.div(x.exponentiatedBy(18)).toFormat()
  }
}

// bigBunber 数字转字符串格式化
export function numberToFomart(val) {
  if (isNaN(val)) {
    return val
  } else {
    var val_ = new BigNumber(val)
    return val_.toFormat()
  }
}

// 时间格式化成最大单位值
export function formateTimeUnit(val) {
  if (!isNaN(val * 1)) {
    if (val * 1 > (60 * 60 * 24)) {
      return Math.floor(val / (60 * 60 * 24)) + Vm.$t('l.unit_2')
    } else if (val * 1 > (60 * 60)) {
      return Math.floor(val / (60 * 60)) + Vm.$t('l.unit_3')
    } else if (val * 1 > 60) {
      return Math.floor(val / 60) + Vm.$t('l.unit_4')
    } else {
      return val + Vm.$t('l.unit_5')
    }
  }
}

/**
 * 钱包地址缩略显示
 * @param {*} val 钱包地址
 * @param {*} sub 保留可见前后字符串长度
 * @returns String
 */
export function addressHide(val, sub = 6) {
  if (!val || val.length !== 42) {
    return val
  }
  var startStr = val.substring(0, sub)
  var endStr = val.substring(42 - sub)
  return startStr + '******' + endStr
}
