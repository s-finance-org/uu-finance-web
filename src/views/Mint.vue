<template>
  <a-layout-content class="container-lg px-4">
    <div class="px-lg-5 mx-lg-3">
      <div class="mt-lg-4 mb-lg-5 pb-4">
        <h2 class="fs-2 mb-1">存入稳定币资产，获得 UU</h2>
        <span class="fs-6 pe-5 d-block">你可以选择存入稳定币池流动性凭证、生息代币或直接存入稳定币获得 UU</span>
      </div>

      <a-tabs animated type="card" defaultActiveKey=structure.mintActionsDefaultKey>
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
                  :codes=tokenItem />
              </a-tab-pane>
              <a-tab-pane key="single" :tab="$t(actionItem.mintAssetMode.singleTabI18n)" class="pt-2">
                <token-select-input
                  v-model:current="singleSelectCode"
                  :label="$t('global.base.deposit')"
                  :codes=structure.singleAssetTokens />
              </a-tab-pane>
            </a-tabs>
          </div>

          <div class="line-frame-thin d-flex p-3 p-md-4 pb-2 pb-md-3 flex-column col-12 col-md-4">
            <span
              v-for="(item, idx) in preview"
              :key="`preview-${idx}`"
              class="d-flex flex-wrap text-nowrap pb-2"
              :class="item.class"
            >
              {{ item.name }}
              <span class="h4 col text-end">{{ item.view }}</span>
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
tokenAddresses
{{ Object.keys($store.tokenAddresses) }}
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

export default {
  components: {
    iIntersect,
    TokenSelectInput,
    ButtonBusy
  },
  data() {
    return {
      singleSelectCode: '',
      mintAssetMode: 'single',

      // TEMP:
      value1: 'a',
      value: undefined,
    };
  },
  methods: {
    onChange (e) {
      console.log(`checked = ${e.target.value}`);
    },
    async onMint () {
      const { tokens } = this.$store
      const singleToken = tokens[this.singleSelectCode]

      await singleToken.ensureAllowance(tokens.UU.address)

      await tokens.UU.mint(singleToken.address, singleToken.amount.ether, '1')
    },
    async onBurn () {
      const { tokens } = this.$store
      const singleToken = tokens[this.singleSelectCode]

      // await singleToken.ensureAllowance(tokens.UU.address)

      await tokens.UU.burn(singleToken)
    }
  },
  computed: {
    // 结构性
    structure () {
      return {
        mintActionsDefaultKey: 'deposit',
        mintActions: {
          deposit: {
            tabI18n: '存入获得 UU',
            selectAssetesI18n: '选择存入资产类型',
            mintAssetMode: {
              multipleTabI18n: '多资产存入',
              singleTabI18n: '单资产存入',
              placeholderI18n: '输入存入数量',
            },
            mintBtnI18n: '存款',
            mintBtnClick: this.onMint
          },
          withdraw: {
            tabI18n: '取出销毁 UU',
            selectAssetesI18n: '选择取出资产类型',
            mintAssetMode: {
              multipleTabI18n: '多资产取出',
              singleTabI18n: '单资产取出',
              placeholderI18n: '输入取出数量',
            },
            mintBtnI18n: '取款',
            mintBtnClick: this.onBurn
          },
        },

        selectTokenTypeDefaultValue: '1',
        selectTokenTypes: [
          { value: '1', i18n: '流动性凭证' },
          { value: '2', i18n: '生息代币', disabled: true },
          { value: '3', i18n: '稳定币', disabled: true }
        ],

        multipleAssetTokens: [ 'DAI_USDT', 'DAI_USDC', 'DAI', 'USDC', 'USDT'],
        singleAssetTokens: ['DAI_USDC', 'DAI_USDT', 'USDC', 'USDT', 'DAI', 'UU'],
      }
    },
    // 交互
    ixd () {
      const { wallet, tokens } = this.$store
      const { singleSelectCode, mintAssetMode } = this
      // 量值
      
      

      return {
        mintBtn: {
          // TODO: 操作的币种
          disabled: !wallet.isValidated
            // TODO: 暂时关闭
            || mintAssetMode === 'multiple'
            // singleSelectCode 初始为空，由 select 自动填充
            || singleSelectCode && !tokens[singleSelectCode].amount.isValidInput,
          busy: tokens.UU.state.busy
        }
      }
    },
    preview () {
      const { tokens } = this.$store

      const singleToken = tokens[this.singleSelectCode]
      let minVol = ''
      // TODO: temp
      if (singleToken && tokens.UU.associatedTokens[singleToken.address]) {
        minVol = tokens.UU.associatedTokens[singleToken.address].burnUUGetMinVol.view
      }
      


      // TODO: 链数据
      return [
        { name: '预计矿工费', view: 'x.xx 美元' },
        { name: '最大滑点', view: 'x.xx %' },
        { name: '流动性池', view: 'UU' },
        { name: '你将至少收到', view: minVol + ' UU', class: [ 'text-color-primary' ] },
      ]
    },
    reserves () {
      // TODO: 链数据
      return [
        { code: 'USD5', balance: '66,887,766.54', proportion: '20',  },
        { code: 'USD5', balance: '66,887,766.54', proportion: '20',  },
        { code: 'USD5', balance: '66,887,766.54', proportion: '20',  },
        { code: 'USD5', balance: '66,887,766.54', proportion: '20',  },
      ]
    }
  }
}
</script>

<style lang="less" scoped>

</style>