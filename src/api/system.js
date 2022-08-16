import request from '@/utils/request'

export function getExplain(data) {
  return request({
    url: '/api/cms/explain',
    method: 'get',
    data
  })
}

export function getExplainDetails(data) {
  return request({
    url: '/api/cms/explainDetail',
    method: 'get',
    data
  })
}

export function getHelpVieo(data) {
  return request({
    url: '/api/cms/video',
    method: 'get',
    data
  })
}
