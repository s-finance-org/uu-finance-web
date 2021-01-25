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
          <component :is="`token-${item.code}`" class="me-2"></component>
          {{ item.symbol.view }}
        </span>
      </a-select-option>
      <template #suffixIcon>
        <span class="h4 icon-select text-color-heading"></span>
      </template>
    </a-select>
    <span v-else class="d-flex align-items-center col-4 token-name">
      <component :is=currentToken.icon class="me-2"></component>
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
          <a-tooltip :title=$t(approve.tipI18n) placement="topRight">
            <button-busy
              :busying=approve.busy
              v-show=approve.need
              @click=onApprove
              type="link"
              size="small">
                {{ $t(approve.textI18n) }}
              </button-busy>
          </a-tooltip>
        </template>
      </a-input>
    </a-tooltip>
  </a-input-group>
  <small class="pt-1 d-flex" v-if=ensureBalance>
    {{ $t('global.base.maxBalanceOf') }}:
    <busy :busying="currentToken.walletBalanceOf.state.busy">
      <span @click="useAllBalance" class="pointer px-2">{{ currentToken.walletBalanceOf.view }}</span>
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
      toContractAddress: {{ key }}<br/>
      allowance: {{ item.allowance }} <br/>
      approve: {{ item.approve }}<br/>
    </span>
  </small>
</template>

<script>
import BN from 'bignumber.js'
import ButtonBusy from '../components/button-busy'
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
  },
  data () {
    const { codes } = this

    return {
      currentCode: isArray(codes)
        ? codes[0]
        : codes,
      showInputTip: false
    }
  },
  methods: {
    async changeTokenAmount(e) {
      const { value } = e.target
      const { useApprove, currentToken, approveToAddress } = this

      // 限制输入
      currentToken.amount.input = value
      // input自带限制
      const result = currentToken.amount.input
      // 有效输入才影响
      this.showInputTip = !!currentToken.amount.inputView

      // 返回当前操作的 token 对象
      this.$emit('changeAmount', currentToken)

      useApprove
        && await currentToken.isNeedApprove(approveToAddress)
    },
    // 使用全部余额
    useAllBalance () {
      const { tokens } = this.$store
      const { currentToken } = this

      currentToken.amount.input = currentToken.walletBalanceOf.handledView
    },
    onInputBlur (e) {
      this.showInputTip = false
    },
    onInputFocus (e) {
      this.showInputTip = !!this.currentToken.amount.inputView
    },
    async onApprove () {
      const { approveToAddress } = this

      await this.currentToken.ensureAllowance(approveToAddress)
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

      return tokens[currentCode]
    },
    approve () {
      const { useApprove, currentToken, approveToAddress } = this
      let need = false
      let reset = false
      let busy = false

      // TODO: 
      // 使用授权功能、
      if (useApprove && approveToAddress && currentToken.associatedTokens && currentToken.associatedTokens[approveToAddress]) {
        need = currentToken.associatedTokens[approveToAddress].isNeedApprove
        reset = currentToken.associatedTokens[approveToAddress].isResetApprove
        busy = currentToken.associatedTokens[approveToAddress].state.busy
      }

      return {
        need,
        tipI18n: reset ? 'global.base.resetApproveTip' : 'global.base.approveTip',
        textI18n: reset ? 'global.base.resetApprove' : 'global.base.approve',
        busy
      }
    }
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