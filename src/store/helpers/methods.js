const NETWORK_NAMES = {
  1: 'MAIN',
  4: 'RINKEBY'
}
const NETWORK_ID = process.env.VUE_APP_NETWORK_ID

/**
 * VUE_APP_MAIN_ + name
 * @param {string} name
 * @return {string}
 */
export const getDotenvAddress = (name = '') => {
  const result = process.env[`VUE_APP_${NETWORK_NAMES[NETWORK_ID]}_${name}`]

  !result
    && console.error('Not find result value')

  return result
}