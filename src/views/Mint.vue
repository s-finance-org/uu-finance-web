<template>
  <a-layout-content class="container-lg px-4">
    <div class="px-lg-5 mx-lg-3">
      <div class="mt-lg-4 mb-lg-5 pb-4">
        <h2 class="fs-2 mb-1">存入稳定币资产，获得 UU</h2>
        <span class="fs-6 pe-5 d-block">你可以选择存入稳定币池流动性凭证、生息代币或直接存入稳定币获得 UU</span>
      </div>

      <a-tabs animated type="card" defaultActiveKey="deposit">
        <a-tab-pane key="deposit" tab="存入获得 UU" class="d-flex flex-wrap">

            <div class="d-flex flex-column flex-wrap col-12 col-md-8 pe-md-4">
              <span class="h5 d-block py-1 pt-4">选择存入资产类型</span>
              <a-radio-group defaultValue="1" size="small" class="pb-3">
                <a-radio-button value="1">
                  流动性凭证
                </a-radio-button>
                <a-radio-button value="2" disabled>
                  生息代币
                </a-radio-button>
                <a-radio-button value="3">
                  稳定币
                </a-radio-button>
              </a-radio-group>

              <a-tabs size="small" animated type="card" defaultActiveKey="single" v-model:activeKey="mintAssetMode">
                <a-tab-pane key="multiple" tab="多资产存入" class="pt-2">
                  <token-select-input
                    v-for="item in once.multipleAssetTokens"
                    :key="'multipleAssetTokens-' + item"
                    :label="$t('global.base.deposit')"
                    placeholder="输入存入数量"
                    :codes=item />
                </a-tab-pane>
                <a-tab-pane key="single" tab="单资产存入" class="pt-2">
                  <token-select-input
                    v-model:current="singleSelectCode"
                    :label="$t('global.base.deposit')"
                    :codes=once.singleAssetTokens />
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
                @click=onMinit
                >
                存款
              </button-busy>
            </div>
        </a-tab-pane>

        <a-tab-pane key="withdraw" tab="取出销毁 UU">
2
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
    async onMinit () {
      const { tokens } = this.$store
      const singleToken = tokens[this.singleSelectCode]

      await singleToken.ensureAllowance(tokens.UU.address)

      await tokens.UU.mint(singleToken.address, singleToken.amount.ether, '1')
    }
  },
  computed: {
    store () {
      const { wallet, tokens } = this.$store

      return {
        wallet,
        tokens
      }
    },
    // 结构性只一次
    once () {
      return {
        multipleAssetTokens: [ 'DAI_USDT', 'DAI_USDC', 'DAI', 'USDC', 'USDT'],
        singleAssetTokens: ['DAI_USDC', 'DAI_USDT', 'USDC', 'USDT', 'DAI', 'UU']
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
      // TODO: 链数据
      return [
        { name: '预计矿工费', view: 'x.xx 美元' },
        { name: '最大滑点', view: 'x.xx %' },
        { name: '流动性池', view: 'UU' },
        { name: '你将至少收到', view: 'x.xx UU', class: [ 'text-color-primary' ] },
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