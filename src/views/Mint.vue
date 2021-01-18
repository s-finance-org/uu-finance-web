<template>
  <a-layout-content class="container-lg px-4">
    <div class="px-lg-5 mx-lg-3">
      <div class="mt-lg-4 mb-lg-5 pb-4">
        <h2 class="fs-2 mb-1">{{ $t('global.mint.title') }}</h2>
        <span class="fs-6 pe-5 d-block">{{ $t('global.mint.subtitle') }}</span>
      </div>

      <a-tabs animated type="card" defaultActiveKey=structure.mintActionsDefaultKey v-model:activeKey=tabMintAction>
        <a-tab-pane
          v-for="(actionItem, key) of structure.mintActions"
          :key=key
          :tab=$t(actionItem.tabI18n)
          class="d-flex flex-wrap">
          <div class="d-flex flex-column flex-wrap col-12 col-md-8 pe-md-4">
            <span class="h5 d-block py-1 pt-4">{{ $t(actionItem.selectAssetesI18n) }}</span>
            <a-radio-group :defaultValue=structure.selectTokenTypeDefaultValue size="small" class="pb-3">
              <a-radio-button
                v-for="(item, idx) in structure.selectTokenTypes"
                :key="'selectTokenType' + idx"
                :value=item.value
                :disabled=item.disabled>
                {{ $t(item.i18n) }}
              </a-radio-button>
            </a-radio-group>

            <a-tabs size="small" animated type="card" defaultActiveKey="single" v-model:activeKey="mintAssetMode">
              <a-tab-pane key="multiple" :tab="$t(actionItem.mintAssetMode.multipleTabI18n)" class="pt-2">
                <token-select-input
                  v-for="tokenItem in structure.multipleAssetTokens"
                  :key="'multipleAssetTokens-' + tokenItem"
                  :label="$t('global.base.deposit')"
                  :placeholder="$t(actionItem.mintAssetMode.placeholderI18n)"
                  v-on:changeAmount=changeAmount
                  :approveToAddress=structure.approveToAddress
                  :codes=tokenItem
                  :useApprove=structure.useApprove />
              </a-tab-pane>
              <a-tab-pane key="single" :tab="$t(actionItem.mintAssetMode.singleTabI18n)" class="pt-2">
                <token-select-input
                  v-model:current="singleSelectCode"
                  :label="$t('global.base.deposit')"
                  :placeholder="$t(actionItem.mintAssetMode.placeholderI18n)"
                  v-on:changeAmount=changeAmount
                  :approveToAddress=structure.approveToAddress
                  :codes=structure.singleAssetTokens
                  :useApprove=actionItem.useApprove />
              </a-tab-pane>
            </a-tabs>
          </div>

          <div class="line-frame-thin d-flex p-3 p-md-4 pb-2 pb-md-3 flex-column col-12 col-md-4">
            <span class="d-flex flex-wrap text-nowrap pb-2">
              {{ $t('global.mint.liquidityPool') }}
              <span class="h4 col text-end ps-3">UU</span>
            </span>
            <span class="d-flex flex-wrap text-nowrap pb-2 text-color-primary">
              {{ $t(actionItem.preview.leastI18n) }}
              <span class="h4 col text-end ps-3">
                <busy :busying="ixd.preview.leastBusy">
                  {{ ixd.preview.leastVol }} UU
                </busy>
              </span>
            </span>
            <iIntersect class="d-none d-md-block" />
          </div>

          <div class="d-flex flex-wrap col-12 col-md-8 pe-md-4 pt-4 justify-content-between align-items-end">
            <a-button type="link" size="small" class="p-0 mt-2 order-1 order-md-12 col-12 col-md-auto">
              高级选项
            </a-button>
            <button-busy
              :busying=ixd.mintBtn.busy
              className="col-12 col-md-auto order-12 order-md-1"
              :disabled=ixd.mintBtn.disabled
              type="primary"
              @click=actionItem.mintBtnClick
              >
              {{ $t(actionItem.mintBtnI18n)}}
            </button-busy>
          </div>
        </a-tab-pane>
      </a-tabs>

      <div class="flex-wrap row" v-if=false>
        <div class="col-12 col-md">
          <h5 class="py-3 mb-0">最大滑点</h5>
          <a-radio-group v-model:value="value1" size="small" @change="onChange" class="pb-3">
            <a-radio-button value="a">
              0.5%
            </a-radio-button>
            <a-radio-button value="b">
              1.0%
            </a-radio-button>
            <a-radio-button value="c">
              2.0%
            </a-radio-button>
            <a-radio-button value="d">
              自定义
            </a-radio-button>
          </a-radio-group>
          <a-input suffix="%" disabled="true" placeholder="输入数值"/>
        </div>
        <div class="col-12 col-md">
          <h5 class="py-3 mb-0">Gas 费用</h5>
          <a-radio-group v-model:value="value1" size="small" @change="onChange" class="pb-3">
            <a-radio-button value="a">标准（x）</a-radio-button>
            <a-radio-button value="b">快速（x）</a-radio-button>
            <a-radio-button value="c">极速（x）</a-radio-button>
            <a-radio-button value="d">自定义</a-radio-button>
          </a-radio-group>
          <a-input disabled="true" placeholder="输入数值" value="99"/>
        </div>
      </div>

      <h4 class="my-4 pt-2">{{ $t('global.base.reserves') }}</h4>
      <ul class="d-flex flex-wrap">
        <li v-for="item in reserves"
          class="h5 text-color-heading pb-2 col-12 col-sm-4"
          :key="`${item.code}-balance`"
          >
          <span class="d-block text-color-secondary">{{ item.code }}</span>
          {{ item.balance }} ({{ item.proportion }}%)
        </li>
      </ul>
    </div>
  </a-layout-content>
</template>

<script>
import {
  iIntersect,
} from '@/components/icons'

import TokenSelectInput from '../components/token-select-input'
import ButtonBusy from '../components/button-busy'
import Busy from '../components/busy'

export default {
  components: {
    iIntersect,
    TokenSelectInput,
    ButtonBusy,
    Busy
  },
  data() {
    return {
      singleSelectCode: '',
      mintAssetMode: 'single',
      mintAction: 'deposit',

      // TEMP:
      value1: 'a',
      value: undefined,
    };
  },
  // TODO: temp
  async mounted () {
    const { UU, DAI_USDC } = this.$store.tokens

    await UU.lptBalance(DAI_USDC)
  },
  methods: {
    onChange (e) {
      console.log(`checked = ${e.target.value}`);
    },
    async onMint () {
      const { tokens } = this.$store
      const singleToken = tokens[this.singleSelectCode]

      await singleToken.ensureAllowance(tokens.UU.address)

      await tokens.UU.mint(singleToken)
    },
    async onBurn () {
      const { tokens } = this.$store
      const singleToken = tokens[this.singleSelectCode]

      // await singleToken.ensureAllowance(tokens.UU.address)

      await tokens.UU.burn(singleToken)
    },
    async changeAmount (tokenObj) {
      const { UU } = this.$store.tokens
      const { mintAction } = this

      // TODO: multi
      if (mintAction === 'deposit') {
        
        await UU.getLpt2UUVol(tokenObj)
      } else if (mintAction === 'withdraw') {
        await UU.getUU2LptVol(tokenObj)
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
          { value: '1', i18n: 'global.mint.selectTokenTypes.lpt' },
          { value: '2', i18n: 'global.mint.selectTokenTypes.interestToken', disabled: true },
          { value: '3', i18n: 'global.mint.selectTokenTypes.stablecoin', disabled: true }
        ],

        mintActionsDefaultKey: 'deposit',
        mintActions: {
          deposit: {
            tabI18n: 'global.mint.deposit.tab',
            selectAssetesI18n: 'global.mint.deposit.selectAssetes',
            mintAssetMode: {
              multipleTabI18n: 'global.mint.deposit.mintAssetMode.multipleTab',
              singleTabI18n: 'global.mint.deposit.mintAssetMode.singleTab',
              placeholderI18n: 'global.mint.deposit.mintAssetMode.placeholder',
            },
            useApprove: true,
            mintBtnI18n: 'global.mint.deposit.mintBtn',
            mintBtnClick: this.onMint,
            preview: {
              leastI18n: 'global.mint.deposit.previewReceiveLeast'
            }
          },
          withdraw: {
            tabI18n: 'global.mint.withdraw.tab',
            selectAssetesI18n: 'global.mint.withdraw.selectAssetes',
            mintAssetMode: {
              multipleTabI18n: 'global.mint.withdraw.mintAssetMode.multipleTab',
              singleTabI18n: 'global.mint.withdraw.mintAssetMode.singleTab',
              placeholderI18n: 'global.mint.withdraw.mintAssetMode.placeholder',
            },
            useApprove: false,
            mintBtnI18n: 'global.mint.withdraw.mintBtn',
            mintBtnClick: this.onBurn,
            preview: {
              leastI18n: 'global.mint.withdraw.previewNeedLeast'
            }
          },
        },

        // TODO: 
        multipleAssetTokens: [ 'DAI_USDC'],
        singleAssetTokens: ['DAI_USDC'],

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

        // sync
        // 切换存款、取款类型时，同步变成值时的事件
        this.changeAmount(singleToken)
      }
    },
    // 交互
    ixd () {
      const { wallet, tokens } = this.$store
      const { singleSelectCode, mintAssetMode, structure } = this
      // 量值

      let mintBtnDisabled = !wallet.isValidated
            // TODO: 多币种模式下暂时关闭
            || mintAssetMode === 'multiple'
            // singleSelectCode 初始为空，由 select 自动填充
            || singleSelectCode && !tokens[singleSelectCode].amount.isValidInput
            // TODO: 不能为空来提交
            || singleSelectCode && tokens[singleSelectCode].amount.input === ''


      const singleToken = tokens[this.singleSelectCode]
      let leastVol = ''
      let leastBusy = false
console.log(this.mintAction)
      // TODO: temp 单选以及实现方法 （用Model 结构初始化来解决）
      if (this.mintAction === 'deposit') {
        if (singleToken && singleToken.associatedTokens && singleToken.associatedTokens[structure.approveToAddress]) {
          let aaa  = singleToken.associatedTokens[structure.approveToAddress].needApprove
          if (aaa) {
            mintBtnDisabled = true
          }
        }

        if (singleToken && tokens.UU.associatedTokens[singleToken.address] && tokens.UU.associatedTokens[singleToken.address].mintGainAmount) {

          leastVol = tokens.UU.associatedTokens[singleToken.address].mintGainAmount.view
          leastBusy = tokens.UU.associatedTokens[singleToken.address].mintGainAmount.state.busy
        }
      } else if (this.mintAction === 'withdraw') {
        if (singleToken && tokens.UU.associatedTokens[singleToken.address] && tokens.UU.associatedTokens[singleToken.address].burnGainAmount) {
          leastVol = tokens.UU.associatedTokens[singleToken.address].burnGainAmount.view
          leastBusy = tokens.UU.associatedTokens[singleToken.address].burnGainAmount.state.busy
        }
      }

      return {
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
      // TODO: temp
      const { UU, DAI_USDC } = this.$store.tokens

      let result = []

      if (UU.associatedTokens[DAI_USDC.address] && UU.associatedTokens[DAI_USDC.address].balance) {
        result.push({
          code: DAI_USDC.symbol.view, balance: UU.associatedTokens[DAI_USDC.address].balance.view, proportion: '100'
        })
      }

      // TODO: 链数据
      return result
    }
  }
}
</script>

<style lang="less" scoped>

</style>