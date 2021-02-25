/**
 * Ant 组件解构成 Components 支持的格式
 * @param {*} arr
 * @return {!Object}
 */
export const parseAntComponent = arr => {
  const result = {}

  arr.map(item => {
    result[item.displayName || item.name] = item
  })

  return result
}
