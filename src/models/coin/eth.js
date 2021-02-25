import { request } from '../../utils'

export default {
  create () {
    const __store__ = {
      ethPrice: '300'
    }

    return {
      gasPrice: '',
      gasLimit: '',
      get price () {
        return __store__.ethPrice
      },
      price1: '1',
      /**
       * 更新 ETH 价格
       * - USD 计价
       */
      async updatePrice () {
        try {
          const res = await request.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
          __store__.ethPrice = res.ethereum.usd
          console.log(res.ethereum.usd)
          this.price1 = res.ethereum.usd
        }
        catch(err) {
          console.error(err)
        }
      }
    }
  }
}