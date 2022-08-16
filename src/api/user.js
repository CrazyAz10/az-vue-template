import request from '@/utils/request'

export function getAny(params) {
  return request({
    url: '/somthing', // 假地址 自行替换
    method: 'get',
    params
  })
}

export function fetchTrx(params) {
  return request({
    url: '/api/farms/trx',
    method: 'get',
    params
  })
}

export function fetchFomo(params) {
  return request({
    url: '/api/farms/fomo',
    method: 'get',
    params
  })
}

export function fetchCommission(params) {
  return request({
    url: '/api/farms/commission',
    method: 'get',
    params
  })
}

export function seedLog(data) {
  return request({
    url: '/api/farms/seedLog',
    method: 'get',
    data
  })
}

export function claimLog(data) {
  return request({
    url: '/api/farms/claimLog',
    method: 'get',
    data
  })
}

export function commissionLog(data) {
  return request({
    url: '/api/farms/commissionLog',
    method: 'get',
    data
  })
}
