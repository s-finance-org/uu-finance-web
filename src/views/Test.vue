<template>
{{ test1 }}<br/>
-----<br/>

-----<br/>
  DAI_USDC LPT 添加 <br/>
  <token-select-input codes="DAI" />
  {{ $store.tokens.DAI.walletBalanceOf.decimals.handled }}<br/>
  {{ $store.tokens.DAI.walletBalanceOf.ether }}<br/>
  <token-select-input codes="USDT" />
  {{ $store.tokens.USDT.walletBalanceOf.decimals.handled }}<br/>
  {{ $store.tokens.USDT.walletBalanceOf.ether }}<br/>
  <token-select-input codes="USDC" />
  {{ $store.tokens.USDC.walletBalanceOf.decimals.handled }}<br/>
  {{ $store.tokens.USDC.walletBalanceOf.ether }}<br/>
  <a-button @click=onStake>存</a-button>
-----<br/>
{{ $store.coins.ETH.price1 }}


</template>
<script>
import { Button } from 'ant-design-vue'
import TokenSelectInput from '../components/token-select-input'
import { parseAntComponent } from '../utils/helpers'
import { ceil, floor, round, toFixed, request } from '../utils'

import { nativeNavigatorLanguage, queryUriParse, nativeLocation } from '../utils'

export default {
  components: {
    ...parseAntComponent([Button]),
    TokenSelectInput,
  },
  data() {
    return {
      test1: {}

    }
  },
  async mounted () {
        try {
  const res = await request.settings().get('https://api.s.finance/f/a/uu')
  this.test1 = res
        } catch(e) {
          this.test1 = e
        }

    await this.$store.coins.ETH.updatePrice()
console.log('ceil', ceil(1.154, 2), ceil(1.155, 2), ceil(1.159, 2), ceil(1.1, 2) )
console.log('floor', floor(1.154, 2), floor(1.155, 2), floor(1.159, 2), floor(1.1, 2) )
console.log('round', round(1.154, 2), round(1.155, 2), round(1.159, 2), round(1.1, 2) )
console.log('toFixed', toFixed(1.154, 2), toFixed(1.155, 2), toFixed('1231231231231231231231231231231231231.159111111111111111111111111', 2), toFixed(1.1, 2), toFixed(0, 2) )



    // console.log(
    //   'price ',
    //   await this.$store.swaps.uniswapV2Router2.getPrice(this.$store.tokens.CRV, this.$store.tokens.USDT)
    // )
  },
  methods: {
    async onStake () {
      const { tokens, pools } = this.$store

      // await tokens.DAI.approve(tokens.DAI_USDT.address)
      // await tokens.USDT.approve(tokens.DAI_USDT.address)
    }
  },
  computed: {
    ixd () {
      const cacheLocaleKey = '__Global_I18n_locale'

  

      return {
        
      }
    },
    test () {
      const { wallet } = this.$store
      window.imToken || window.ethereum.isImToken
      const result = window.imToken + '   ' + window.ethereum.isImToken
// return 'currentProvider' + wallet.web3.currentProvider.isImToken
// return wallet.infuraWeb3.currentProvider
return ': ' + result

    }

  }
};
</script>
<style scoped>
</style>
