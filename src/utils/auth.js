export const farmToken = 'farmToken'

export function getToken() {
  return localStorage.getItem(farmToken)
}

export function setToken(token) {
  return localStorage.setItem(farmToken, token)
}

export function removeToken() {
  return localStorage.removeItem(farmToken)
}
