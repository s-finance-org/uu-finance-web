<template>
  swap<br/>

<br/>
address: {{ wallet.address }}<br/>
networkId: {{ wallet.networkId }}<br/>
name: {{ wallet.name }}<br/>
updated: {{ wallet.state.updated }}<br/>
busy: {{ wallet.state.busy }}<br/>
isValidated: {{ wallet.isValidated }}<br/>

<br/>
  address: {{ tokens.DAI.address }}<br/>
  name: {{ tokens.DAI.name }}<br/>
  walletBalanceOf:
  <!-- | {{ tokens.DAI.walletBalanceOf.ether }} -->
  <!-- | {{ tokens.DAI.walletBalanceOf.handled }} -->
  | {{ tokens.DAI.walletBalanceOf.view }}
  <br/>
  <br/>
  <!-- DAI: {{ tokens.DAI }} -->
</template>

<script>
export default {
  computed: {
    tokens () {
      return this.$store.tokens
    },
    wallet () {
      return this.$store.wallet
    }
  }
}
</script>

<style lang="less" scoped>
</style>