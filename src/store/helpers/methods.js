
const NETWORK_NAMES = {
  1: 'MAIN',
  4: 'RINKEBY'
}
const NETWORK_ID = process.env.VUE_APP_NETWORK_ID

export const getDotenvAddress = (name = '') => {
  // TODO: 处理找不到时
  return process.env[`VUE_APP_${NETWORK_NAMES[NETWORK_ID]}_${name}`]
    || ''
}