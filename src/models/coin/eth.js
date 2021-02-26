import axios from 'axios'

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
          const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')

          __store__.ethPrice = res.data.ethereum.usd
          this.price1 = res.data.ethereum.usd
        }
        catch(err) {
          console.error(err)
        }
      }
    }
  }
}