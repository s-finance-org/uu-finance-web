import { ModelToken, ModelValueUint8 } from '../../models'
import { getDotenvAddress } from '../helpers/methods'

export default ModelToken.create({
  code: 'DAI',
  address: getDotenvAddress('DAI_TOKEN'),
  priceSource: 'uniswapV2Router2',
  chargeToken: {
    address: getDotenvAddress('USDT_TOKEN'),
    // TODO: ModelValueUint8，不能先设定
    decimals: ModelValueUint8.create().setValue(6),
  }
})