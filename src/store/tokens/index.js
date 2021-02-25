import { reactive } from 'vue'
import { ModelToken } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

import DAI from './DAI'
import USDT from './USDT'
import UU from './UU'
import SFG from './SFG'
import SWRV from './SWRV'

import DAI_USDC from './DAI_USDC'
import DAI_USDT from './DAI_USDT'
import SFINANCE_USD5 from './SFINANCE_USD5'
import CURVE_3CRV from './CURVE_3CRV'


/**
 * 以 token code 为 key 的数据集
 * @type {!Object}
 */
export default reactive({
  DAI,
  USDT,
  USDC: ModelToken.create({
    code: 'USDC',
    address: getDotenvAddress('USDC_TOKEN'),
  }),
  UU,
  CRV: ModelToken.create({
    code: 'CRV',
    address: getDotenvAddress('CRV_TOKEN'),
    viewDecimal: 2
  }),
  SNX: ModelToken.create({
    code: 'SNX',
    address: getDotenvAddress('SNX_TOKEN'),
    viewDecimal: 2
  }),
  SFG,
  SWRV,

  /* LP token */
  SFINANCE_USD5,
  CURVE_3CRV,
  // TODO: 不存在的 multi call 会卡
  // DAI_USDC, // test
  // DAI_USDT, // test
})
