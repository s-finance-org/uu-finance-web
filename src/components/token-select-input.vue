<template>
  <div class="h5 pb-1">{{ label }}</div>
  <a-input-group
    compact
    :class="{ 'danger': !currentToken.amount.isValidInput }"
    >
    <a-select
      class="col-4 pe-0"
      v-model:value="currentCode"
      v-if="__base__.isSelect"
    >
      <a-select-option
        v-for="item in __base__.tokens"
        :key="`${item.code}`"
        :value=item.code
      >
        <span class="d-flex align-items-center">
          <icon-lpt :code=currentToken.code size=16 class="me-2" />
          {{ item.symbol.view }}
        </span>
      </a-select-option>
      <template #suffixIcon>
        <span class="h4 icon-select text-color-heading"></span>
      </template>
    </a-select>
    <span v-else class="d-flex align-items-center col-4 token-name">
      <icon-lpt :code=currentToken.code size=16 class="me-2" />
      {{ currentToken.symbol.view }}
    </span>
    <a-tooltip :visible=showInputTip placement="topLeft">
      <template #title>
        {{ currentToken.amount.inputView }}
      </template>
      <a-input
        @focus=onInputFocus
        @blur=onInputBlur
        :value="currentToken.amount.input"
        class="pe-0"
        :placeholder=placeholder
        @change="changeTokenAmount"
      >
        <template #suffix>
          <a-tooltip :title="$t(associatedToken.isResetApprove ? 'global.base.resetApproveTip' : 'global.base.approveTip')" placement="topRight">
            <button-busy
              :busying=associatedToken.state.busy
              v-show=associatedToken.isNeedApprove
              @click=onApprove
              type="link"
              size="small">
                {{ $t(associatedToken.isResetApprove ? 'global.base.resetApprove' : 'global.base.approve') }}
              </button-busy>
          </a-tooltip>
        </template>
      </a-input>
      associatedToken.isNeedApprove: {{ associatedToken.isNeedApprove }}
    </a-tooltip>
  </a-input-group>
  <small class="pt-1 d-flex" v-if=ensureBalance>
    {{ $t('global.base.maxBalanceOf') }}:
    <busy :busying="currentToken.walletBalanceOf.state.busy">
      <span @click="currentToken.useAllBalanceOf" class="pointer px-2">{{ currentToken.walletBalanceOf.view }}</span>
    </busy>
  </small>

  <small class="d-flex flex-column" style="overflow: hidden;">
    <span>是否输入错误: {{ !currentToken.amount.isValidInput }}</span>
    <span>name: {{ currentToken.name.view }}</span>
    decimals: {{ currentToken.decimals.handled }}<br/>
    totalSupply: {{ currentToken.totalSupply.handled }}<br/>
    <a-checkbox v-model:checked="currentToken.isInfiniteAllowance">
      isInfiniteAllowance: {{ currentToken.isInfiniteAllowance }}
    </a-checkbox>
    precision: {{ currentToken.precision }}<br/>
    walletBalanceOf: {{ currentToken.walletBalanceOf.handled }}<br/>
    amount: <br/>
    {{ currentToken.amount.ether }} | <br/>
    {{ currentToken.amount.handled }} |  <br/>
    {{ currentToken.amount.input }} | <br/>
    {{ currentToken.amount.inputView }} | <br/>
    {{ currentToken.amount.handledView }}<br/>
    {{ currentToken.amount.view }}<br/>
    approveAmount: <br/>
    error: {{ currentToken.error }}<br/>
    associatedTokens: <br/>
    <span class="ps-5 d-flex" v-for="(item, key) of currentToken.associatedTokens"
      :key=key
      >
      toContractAddress: {{ item.address.handled }}<br/>
      allowance: {{ item.allowance.ether }} | {{ item.allowance.handled }} <br/>
      approve: {{ item.approve.ether }} | {{ item.approve.handled }}<br/>
    </span>
  </small>
</template>

<script>
import BN from 'bignumber.js'
import ButtonBusy from '../components/button-busy'
import IconLpt from '../components/icon-lpt'
import { isArray } from '../utils'

export default {
  props: {
    codes: {
      type: [String, Array],
    },
    current: String,
    label: String,
    placeholder: String,
    changeAmount: Function,
    // 授权到的目标地址
    approveToAddress: String,
    // 是否使用授权功能（
    useApprove: {
      type: Boolean,
      default: true
    },
    // 是否校验余额
    ensureBalance: {
      type: Boolean,
      default: true
    }
  },
  components: {
    ButtonBusy,
    IconLpt
  },
  data () {
    const { codes } = this

    return {
      currentCode: isArray(codes)
        ? codes[0]
        : codes,
      showInputTip: false,
      associatedToken: {
        isNeedApprove: false,
        state: { busy: false },
        isResetApprove: false
      }
    }
  },
  methods: {
    async changeTokenAmount(e) {
      const { value } = e.target
      const { useApprove, currentToken, approveToAddress } = this

      // sync
      currentToken.amount.input = value
      // 有效输入才影响
      const isValidInput = this.showInputTip = !!currentToken.amount.inputView

      // 返回当前操作的 token 对象
      this.$emit('changeAmount', currentToken)

      if (!(useApprove && approveToAddress)) return false

      await currentToken.getAllowance(approveToAddress)
      // sync
      // TODO: 待优化，由input 触发
      const { isNeedApprove, isResetApprove, state } = currentToken.getAssociatedToken({ address: approveToAddress })
      // sync
      this.associatedToken = {
        isNeedApprove,
        isResetApprove,
        state
      }
    },
    onInputBlur (e) {
      this.showInputTip = false
    },
    onInputFocus (e) {
      this.showInputTip = !!this.currentToken.amount.inputView
    },
    // 提交授权
    async onApprove () {
      const { approveToAddress } = this

      await this.currentToken.approve(approveToAddress)
    }
  },
  computed: {
    __base__ () {
      const { tokens } = this.$store
      const { codes } = this

      const isSelect = isArray(codes)

      return {
        // 是否为选择模式
        isSelect,
        tokens: isSelect
          ? codes.map(code => tokens[code])
          : tokens[codes]
      }
    },
    // 当前(选中)的 token
    currentToken () {
      const { tokens } = this.$store
      const { currentCode } = this

      this.$emit('update:current', currentCode)
// TODO: icon-lpt 部分要支持 lpt、token
      return tokens[currentCode]
    },
  }
}
</script>

<style>
.token-name {
  background-color: #fff;
  border: 1px solid #d9d9d9;
  padding: 0 31px 0 11px;
}
</style>