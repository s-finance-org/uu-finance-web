<template>
  <Header />
  <router-view class="col" />
  <Footer />
</template>

<script>
import Header from './Header'
import Footer from './Footer'

export default {
  components: {
    Header,
    Footer,
  },
}
</script>

<style lang="less" scoped>

</style>