import { ModelBnNotify } from '../models'

// TODO: notify 要支持 i18n 自动变更和自定义 https://docs.blocknative.com/notify#i-18-n
export default ModelBnNotify.create({
  dappId: process.env.VUE_APP_BLOCKNATIVE_KEY,
  // network: 'Rinkeby',
  desktopPosition: 'topRight'
})