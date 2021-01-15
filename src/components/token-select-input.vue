<template>
  <div class="h5 pb-1">{{ label }}</div>
    <a-input-group compact :class="{ 'danger': !currentToken.amount.isValidInput }">
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
            {{ item.code }}
          </span>
        </a-select-option>
        <template #suffixIcon>
          <span class="h4 icon-select text-color-heading"></span>
        </template>
      </a-select>
      <span v-else class="d-flex align-items-center col-4 token-name">
        <component :is=currentToken.icon class="me-2"></component>
        {{ currentToken.code }}
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
          @change="changeAmount"
        >
          <template #suffix>
            <a-tooltip title="当前值大于已授权的" placement="topRight">
              <a-button type="link" size="small">授权</a-button>
            </a-tooltip>
          </template>
        </a-input>
      </a-tooltip>
    </a-input-group>
    <small class="py-1 d-flex">
      最多:
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
      amount: {{ currentToken.amount.ether }} | {{ currentToken.amount.handled }} |  {{ currentToken.amount.input }} | {{ currentToken.amount.view }}<br/>
      approveAmount: <br/>
      error: {{ currentToken.error }}<br/>
      associatedTokens: <br/>
      <span class="ps-5 d-flex" v-for="(item, key) of currentToken.associatedTokens"
        :key=key
        >
        toContractAddress: {{ key }}<br/>
        allowance: {{ item.allowance }} <br/>
        approve: {{ item.approve }}<br/>
        walletAddress: {{ item.walletAddress }}<br/>
      </span>
    </small>
</template>

<script>
import Busy from '../components/busy'
import { isArray } from '../utils'

export default {
  props: {
    codes: {
      type: [String, Array],
    },
    current: String,
    label: String,
    placeholder: String
  },
  // setup(props,context){
  //   const changeVal = () => {
  //     console.log('props', props, this)
  //       context.emit("update:current", '1');
  //   }
  //   // const inputBlur = (e:FocusEvent) => {
  //   //     context.emit("update:modelValue",(e.target as HTMLLIElement).value);
  //   // }
  //   return{
  //     changeVal
  //   }
  // },
  components: {
    Busy,
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
    changeAmount(e) {
      const { value } = e.target
      const { currentToken } = this

      // 限制输入
      currentToken.amount.input = value
      // 有效输入才影响
      this.showInputTip = !!currentToken.amount.inputView
    },
    // 使用全部余额
    useAllBalance () {
      const { tokens } = this.$store
      const { currentCode } = this
      const __token__ = tokens[currentCode]

      __token__.amount.input = __token__.walletBalanceOf.handledView
    },
    onInputBlur (e) {
      this.showInputTip = false
    },
    onInputFocus (e) {
      this.showInputTip = !!this.currentToken.amount.inputView
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