<template>
  DAI_USDC LPT 添加 <br/>
  <token-select-input codes="DAI" />
  <token-select-input codes="USDT" />
  <a-button @click=onStake>存</a-button>

  <p class="fs-1">.fs-1 text</p><h1>text 24</h1>
  <p class="fs-2">.fs-2 text</p><h2>text 24</h2>
  <p class="fs-3">.fs-3 text</p><h3>text</h3>
  <p class="fs-4">.fs-4 text</p><h4>text 16</h4>
  <p class="fs-5">.fs-5 text</p><h5>text 13.28</h5>
  <p class="fs-6">.fs-6 text</p><h6>text 12</h6>

</template>
<script>
import TokenSelectInput from '../components/token-select-input'

export default {
  components: {
    TokenSelectInput,
  },
  data() {
    return {
    }
  },
  methods: {
    async onStake () {
      const { tokens } = this.$store

      // await tokens.DAI.ensureAllowance(tokens.DAI_USDT.address)
      await tokens.USDT.ensureAllowance(tokens.DAI_USDT.address)
      await tokens.DAI_USDT.onStake()

      // DAI_USDT.ensureAllowance(1, )
    }
  },
  computed: {
  }
};
</script>
<style scoped>
</style>
