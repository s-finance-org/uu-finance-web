

const ModelETH = {
  create () {
    const __store__ = {
      ethPrice: '300'
    }

    return {
      gasPrice: '',
      gasLimit: '',
      get ethPrice () {
        return __store__.ethPrice
      },
      /**
       * 更新 ETH 价格
       * - USD 计价
       */
      async updateETHPrice () {
        try {
          const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd').json()
          __store__.ethPrice = res.ethereum.usd
        }
        catch(err) {
          console.error(err)
        }
      }
    }
  }
}


export default {
  price: ''
  limit: 0
}