export const cutMiddle = (text = '', left = 4, right = 4) => {
  if (text.length <= left + right) return text
  return `${text.substr(0, left).trim()}...${text.substr(-right)}`
}
