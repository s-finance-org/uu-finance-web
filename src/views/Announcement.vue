<template>
  <a-layout-content class="container-lg px-4">
    <div class="px-lg-5 mx-lg-3">
      <div class="mt-lg-4 mb-4 mb-lg-5 pb-4">
        <h2 class="fs-2 mb-1">{{ $t('layer.header.nav.announcement') }}</h2>
        <span class="fs-6 pe-5 d-block"></span>
      </div>

      <div class="mb-5 pb-4">
        {{ $t('layer.coming.title') }}
        <!-- <h4 class="mb-1">title</h4>
        <small class="text-color-secondary d-block py-2">date</small>
        <p class="h5 mt-1 text-align-justify">
          cont
        </p> -->
      </div>
    </div>
  </a-layout-content>
</template>

<script>
// import { ATabs, ATabPane, ARadioGroup, ARadioButton, AInput } from 'ant-design-vue'
import {
  iIntersect,
} from '@/components/icons'
import BN from 'bignumber.js'

import { ModelValueWallet } from '../models'

import TokenSelectInput from '../components/token-select-input'
import ButtonBusy from '../components/button-busy'
import Busy from '../components/busy'

export default {
  components: {
    // ATabs,
    // ATabPane,
    // ARadioGroup,
    // ARadioButton,
    // AInput,
    iIntersect,
    TokenSelectInput,
    ButtonBusy,
    Busy
  },
  data() {
    return {
      singleSelectCode: '',
      mintAction: 'deposit',

      // TEMP:
      value1: 'a',
      value: undefined,
      // TODO: 
      maxBalanceOf: null
    };
  },
  methods: {
    onChange (e) {
      console.log(`checked = ${e.target.value}`);
    },
    async onMint () {
      const { tokens } = this.$store
      const singleToken = tokens[this.singleSelectCode]

      await tokens.UU.mint(singleToken)
    },
    async onBurn () {
      const { tokens } = this.$store
      const { UU } = this.$store.tokens

      const singleToken = tokens[this.singleSelectCode]
// XXX: 要测试
      // await singleToken.approve(tokens.UU.address)

      const data = await tokens.UU.burn(singleToken)

      await UU.walletBalanceOf.trigger()

      await this.changeAmount(singleToken)
    },
    async changeAmount (_token) {
      const { UU } = this.$store.tokens
      const { mintAction } = this

      // TODO: multi
      if (mintAction === 'deposit') {
        // TODO: 切换 code、数据缓存存在时，数据会没有及时更新，这里要做过度
                // 超过上限
        this.maxBalanceOf = null

        await UU.getLpt2UUVol(_token)
      } else if (mintAction === 'withdraw') {
        // TODO: 恢复最大值 (存入 超出范围，切回取出无问题，再切回存入还是超出的这种触发关系，)
        // TODO: 在初始时，这里 UU 的余额正在 busy，所以 handled 为 0
        // TODO: UU 余额 / lpt 单价 = 最大值
        // TODO: multi
        // TODO: lpt 要全部提出时，按照 上面的公式，与 getUU2LptVol 会有偏差
        this.maxBalanceOf = ModelValueWallet.create({
            ..._token.parameters,
            async trigger () {
              // TODO: 1e18
              return BN(UU.walletBalanceOf.ether).div(await UU.getLptPrice(_token)).times(_token.precision).toString()
            }
            // TODO: temp 临时写法
          }).setEther(BN(UU.walletBalanceOf.ether).div(await UU.getLptPrice(_token)).times(_token.precision).toString())


        await UU.getUU2LptVol(_token)
      }
    }
  },
  computed: {
    // 结构性
    structure () {
      const { UU } = this.$store.tokens

      return {
        selectTokenTypeDefaultValue: '1',
        selectTokenTypes: [
          // TODO: value 的定义
          { value: '1', i18n: 'global.mint.selectTokenTypes.lpt' },
          // { value: '2', i18n: 'global.mint.selectTokenTypes.interestToken' },
          // { value: '3', i18n: 'global.mint.selectTokenTypes.stablecoin' }
        ],

        mintActions: {
          deposit: {
            tabI18n: 'global.mint.deposit.tab',
            selectAssetesI18n: 'global.mint.deposit.selectAssetes',
            labelI18n: 'global.base.deposit',
            placeholderI18n: 'global.mint.deposit.placeholder',
            useApprove: true,
            hasExtra: true,
            mintBtnI18n: 'global.mint.deposit.mintBtn',
            mintBtnClick: this.onMint,
            preview: {
              leastI18n: 'global.mint.deposit.previewReceiveLeast'
            }
          },
          withdraw: {
            tabI18n: 'global.mint.withdraw.tab',
            selectAssetesI18n: 'global.mint.withdraw.selectAssetes',
            labelI18n: 'global.base.withdraw',
            placeholderI18n: 'global.mint.withdraw.placeholder',
            useApprove: false,
            hasExtra: false,
            mintBtnI18n: 'global.mint.withdraw.mintBtn',
            mintBtnClick: this.onBurn,
            preview: {
              leastI18n: 'global.mint.withdraw.previewNeedLeast'
            }
          },
        },

        // TODO: 要由 UU 自动获取列出
        // TODO: RINKEBY:
        // singleAssetTokens: ['DAI_USDC', 'DAI_USDT'],
        singleAssetTokens: ['SFINANCE_USD5', 'CURVE_3CRV'],

        // 授权操作的目标地址
        approveToAddress: UU.address
      }
    },
    // 切换行为类型
    tabMintAction: {
      get () {
        return this.mintAction
      },
      set (val) {
        const { tokens } = this.$store
        const { singleSelectCode } = this
        const singleToken = tokens[singleSelectCode]

        this.mintAction = val
        // 切换时重置 input 内容为空
        singleToken.amount.resetInput()

        // sync
        // 切换存款、取款类型时，同步变成值时的事件
        this.changeAmount(singleToken)
      }
    },
    // 交互
    ixd () {
      const { wallet, tokens } = this.$store
      const { singleSelectCode, structure } = this
      // 量值

      let mintBtnDisabled = !wallet.isValidated
            // singleSelectCode 初始为空，由 select 自动填充
            || singleSelectCode && !tokens[singleSelectCode].amount.isValidInput
            // TODO: 不能为空来提交
            || singleSelectCode && tokens[singleSelectCode].amount.input === ''


      const singleToken = tokens[this.singleSelectCode]
      let leastVol = ''
      let leastBusy = false

      // TODO: temp 单选以及实现方法 （用Model 结构初始化来解决）
      if (this.mintAction === 'deposit') {
        // TODO: 
        if (singleToken) {
          const associatedToken = singleToken.getAssociatedToken(tokens.UU)

          // 没授权、input 无效
          mintBtnDisabled = associatedToken.isNeedApprove
            || !singleToken.amount.isValidInput
            // TODO: 
            || singleToken.amount.input === ''

          // TODO: 
          const foo = tokens.UU.getAssociatedToken(singleToken)

          leastVol = foo.mintGainAmount.view
          leastBusy = foo.mintGainAmount.state.busy
        }
      } else if (this.mintAction === 'withdraw') {
        // TODO: 
        if (singleToken) {
          // TODO: 
          const foo = tokens.UU.getAssociatedToken(singleToken)

          leastVol = foo.burnGainAmount.view
          leastBusy = foo.burnGainAmount.state.busy
        }
      }

      return {
        singleToken,
        mintBtn: {
          // TODO: 操作的币种
          disabled: mintBtnDisabled,
          busy: tokens.UU.state.busy
        },
        preview: {
          leastVol,
          leastBusy
          // { name: '预计矿工费', view: 'x.xx 美元' },
          // { name: '最大滑点', view: 'x.xx %' },
        }
      }
    },
    reserves () {
      const { tokenAddresses, tokens } = this.$store
      // TODO: 自动连接数据，并考虑数据同步更新的可能性
      let totalBalanceHandled = '0'

      const result = tokens.UU.supportedLptAddresses.map(_address => {
        if (!_address.handled) {
          return {
            code: '-',
            balance: '-',
            proportion: '-'
          }
        }
        const _token = tokenAddresses[_address.handled]
        const associatedToken = tokens.UU.getAssociatedToken(_token)
        const balanceHandled = associatedToken.balance.handled
        totalBalanceHandled = BN(totalBalanceHandled).plus(balanceHandled).toString()

        return {
          code: _token.symbol.view,
          balance: associatedToken.balance.view,
          // TODO: temp
          balanceHandled,
          proportion: '-'
        }
      })

      return result.map(item => {
        if (totalBalanceHandled > 0) {
          item.proportion = BN(item.balanceHandled).div(totalBalanceHandled).times(100).toFixed(2)
        }
        return item
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>