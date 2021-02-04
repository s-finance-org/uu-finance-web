<template>
  <div>
    <div class="h5 pb-1">{{ label }}</div>
    <a-input-group
      compact
      :class="{ 'danger': !currentToken.amount.isValidInput }"
      >
      <a-select
        class="col-6 col-sm-4 pe-0"
        v-model:value="currentCode"
        v-if="__base__.isSelectMode"
      >
        <a-select-option
          v-for="item in __base__.tokens"
          :key="`${item.code}`"
          :value=item.code
        >
          <span class="d-flex align-items-center">

            <icon-lpt :code=item.icon size=16 class="me-2" />
            {{ item.symbol.view }}
          </span>
        </a-select-option>
        <template #suffixIcon>
          <span class="h4 icon-select text-color-heading"></span>
        </template>
      </a-select>
      <span v-else class="d-flex align-items-center col-4 token-name">
        <icon-lpt :code=currentToken.icon size=16 class="me-2" />
        {{ currentToken.symbol.view }}
      </span>
      <a-tooltip :visible="isFocus && !!currentToken.amount.inputView" placement="topLeft">
        <template #title>
          {{ currentToken.amount.inputView }}
        </template>
        <a-input
          @focus=onInputFocus
          @blur=onInputFocus
          :value="currentToken.amount.input"
          class="pe-0"
          :placeholder=placeholder
          @change="changeTokenAmount"
        >
          <template #suffix>
            <a-tooltip trigger='hover' :title="$t(associatedToken.isResetApprove ? 'global.base.resetApproveTip' : 'global.base.approveTip')" placement="topRight">
              <button-busy
                :busying=associatedToken.busy
                v-show=associatedToken.isNeedApprove
                @click=onApprove
                type="link"
                size="small"
              >
                {{ $t(associatedToken.isResetApprove ? 'global.base.resetApprove' : 'global.base.approve') }}
              </button-busy>
            </a-tooltip>
          </template>
        </a-input>
      </a-tooltip>
    </a-input-group>
    <span class="pt-1 d-flex">
      <small v-if=showBalanceOf class="d-flex">
        {{ $t('global.base.maxBalanceOf') }}:
        <busy :busying="maxBalanceOf.state.loading" class="pointer px-2">
          <span @click="useMaxBalanceOf">{{ maxBalanceOf.view }}</span>
        </busy>
      </small>
      <slot name="extra"></slot>
    </span>
  </div>

  <!-- <small class="d-flex flex-column" style="overflow: hidden;">
    <a @click=_onForcedResetApprove>_onForcedResetApprove</a>
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
  </small> -->
</template>

<script>
// import { AInputGroup, ASelect, ASelectOption, ATooltip, AInput, ACheckbox } from 'ant-design-vue'

import Busy from '../components/busy'
import ButtonBusy from '../components/button-busy'
import IconLpt from '../components/icon-lpt'
import { isArray } from '../utils'

import { ModelToken, ModelValueWallet } from '../models'

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
    /**
     * 是否显示余额
     */
    showBalanceOf: {
      type: Boolean,
      default: true
    },
    /**
     * 自定义余额
     * - ModelValueWallet
     * - 否则自动获取当前 token 的钱包余额
     */
    balanceOf: {
      type: Object,
      default: null
    }
  },
  components: {
    // AInputGroup,
    // ASelect,
    // ASelectOption,
    // ATooltip,
    // AInput,
    // ACheckbox,
    Busy,
    ButtonBusy,
    IconLpt
  },
  data () {
    const { codes } = this
    // 是否为选择模式
    const isSelectMode = isArray(codes)

    return {
      isFocus: false,
      // TODO: 
      currentCode: isSelectMode
        // 默认选择第一项
        ? codes[0]
        : codes,
    }
  },
  methods: {
    /**
     * 使用最大余额
     */
    useMaxBalanceOf () {
      const { currentToken, maxBalanceOf } = this

      currentToken.amount.input = maxBalanceOf.handledView

      // TODO: 点击后也应该触发 changeTokenAmount
      this.$emit('changeAmount', currentToken)
    },
    async changeTokenAmount(e) {
      const { value } = e.target
      const { useApprove, currentToken, approveToAddress } = this

      // sync
      currentToken.amount.input = value

      // 返回当前操作的 token 对象
      this.$emit('changeAmount', currentToken)

      useApprove
        && approveToAddress
        && await currentToken.getAllowance(approveToAddress)
    },
    onInputFocus (e) {
      const { currentToken } = this
      const isFocus = e.type === 'focus'

      this.isFocus = isFocus
    },
    // 提交授权
    async onApprove () {
      const { approveToAddress, currentToken } = this

      await currentToken.approve(approveToAddress)
    },
    /**
     * 强制重置授权（私有）
     */
    async _onForcedResetApprove () {
      const { approveToAddress, currentToken } = this

      await currentToken.approve(approveToAddress, true)
    }
  },
  computed: {
    __base__ () {
      const { tokens } = this.$store
      const { codes } = this
      // 是否为选择模式
      const isSelectMode = isArray(codes)

      return {
        isSelectMode,
        tokens: isSelectMode
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
    associatedToken () {
      const { approveToAddress, useApprove, currentToken } = this
      let result = {
        isNeedApprove: false,
        busy: false,
        isResetApprove: false
      }

      if (useApprove && approveToAddress) {
        const { isNeedApprove, isResetApprove, state } = currentToken.getAssociatedToken({ address: approveToAddress })
        result = {
          // input 为空时不显示
          isNeedApprove: !currentToken.amount.isEmptyInput && isNeedApprove,
          // TODO: 由 currentToken.state 的状态变更触发
          busy: state.busy && currentToken.state.busy,
          isResetApprove,
        }
      }

      return result
    },
    maxBalanceOf () {
      const { currentToken, balanceOf } = this
      // 使用自定义
      const walletBalanceOf = balanceOf || currentToken.walletBalanceOf

      // 调整 input 最大值
      currentToken.amount.maxInput = walletBalanceOf.handled

      return walletBalanceOf
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