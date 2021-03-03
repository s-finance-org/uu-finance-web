import { reactive } from 'vue'
import { ModelToken } from '../../models'

import DAI from './DAI'
import USDT from './USDT'
import UU from './UU'
import SFG from './SFG'

import SFINANCE_USD5 from './SFINANCE_USD5'
import CURVE_3CRV from './CURVE_3CRV'

/**
 * 以 token code 为 key 的数据集
 * @type {!Object}
 */
export default reactive({
  USDT,
  UU,
  CRV: ModelToken.create({
    code: 'CRV',
    dotenvAddressName: 'CRV_TOKEN',
    viewDecimal: 2
  }),
  SNX: ModelToken.create({
    code: 'SNX',
    dotenvAddressName: 'SNX_TOKEN',
    viewDecimal: 2
  }),
  SFG,

  // TODO: Rinkeby 缺失
  // TODO: 原因未知
  DAI,
  // TODO: 缺少 address、要让 ModelValueToken 支持空地址结构
  SWRV: ModelToken.create({
    code: 'SWRV',
    dotenvAddressName: 'SWRV_TOKEN'
  }),
  // TODO: 合约缺少
  USDC: ModelToken.create({
    code: 'USDC',
    dotenvAddressName: 'USDC_TOKEN',
  }),

  /* LP token */
  SFINANCE_USD5,
  CURVE_3CRV,
  // TODO: 不存在的 multi call 会卡
  // DAI_USDC: ModelToken.create({
  //   code: 'DAI_USDC',
  //   dotenvAddressName: 'DAI_USDC_TOKEN',
  //   isLpt: true,
  //   isInfiniteAllowance: true
  // })
  // DAI_USDT: ModelToken.create({
  //   code: 'DAI_USDT',
  //   dotenvAddressName: 'DAI_USDT_TOKEN',
  //   isLpt: true,
  //   isInfiniteAllowance: true
  // })
})
