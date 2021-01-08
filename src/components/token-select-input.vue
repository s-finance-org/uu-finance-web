<template>
  <div class="h5 pb-1">{{ label }}</div>
    <a-input-group compact>
      <a-select
        class="col-4 pe-0"
        v-model:value="currentCode"
        :filter-option="filterOption"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        v-if="select"
      >
        <a-select-option
          v-for="item in __tokens__"
          :key="`${item.code}`"
          :value=item.code
        >
          <span class="d-flex">
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
      <a-input v-model:value="inputValue" type="number" class="pe-0">
        <template #suffix>
          <a-tooltip title="当前值大于已授权的">
            <a-button type="link" size="small">授权</a-button>
          </a-tooltip>
        </template>
      </a-input>
    </a-input-group>
    <small class="py-1 mb-2 d-flex">
      最多:
      <spin :spinning="currentToken.walletBalanceOf.state.busy">
        <span class="pointer px-2">{{ currentToken.walletBalanceOf.view }}</span>
      </spin>
    </small>
    name: {{ currentToken.name.view }}<br/>
    decimals: {{ currentToken.decimals.view }}<br/>
    totalSupply: {{ currentToken.totalSupply.view }}
</template>

<script>
import Spin from '../components/spin'
import { isArray } from '../utils'

export default {
  props: {
    codes: {
      type: [String, Array],
    },
    label: String,
    approve: Boolean,
    select: Boolean
  },
  components: {
    Spin,
  },
  data () {
    const { codes } = this

    return {
      currentCode: isArray(codes)
        ? codes[0]
        : codes,
      inputValue: '',
    }
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    handleBlur() {
      console.log('blur');
    },
    handleFocus() {
      console.log('focus');
    },
    filterOption(input, option) {
      return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
  computed: {
    __tokens__ () {
      const { tokens } = this.$store
      const { codes } = this
      // TODO: 缺省第一个，但
// if (isArray(codes)) {
// this.currentCode = codes[0]
// } else {
// this.currentCode = codes
// }
      return isArray(codes)
        ? codes.map(code => tokens[code])
        : tokens[codes]
    },
    // 当前(选中)的 token
    currentToken () {
      const { tokens } = this.$store
      const { currentCode } = this

      return tokens[currentCode]
    }
    // tokens1 () {
    //   return [
    //     { code: 'iUSD' },
    //     { code: 'USD5' },
    //     { code: 'USDC' },
    //     { code: 'USDT' },
    //     { code: 'USDx' },
    //   ]
    // },
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