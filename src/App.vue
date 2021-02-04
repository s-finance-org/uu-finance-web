<template>
  <a-config-provider :locale="i18n.language.ant">
    <a-layout class="container-fluid px-0 min-100vh">
      <router-view />
    </a-layout>
  </a-config-provider>
</template>

<script>
// import { AConfigProvider, ALayout } from 'ant-design-vue'

export default {
  components: {
    // AConfigProvider,
    // ALayout
  },
  computed: {
    i18n () {
      const { i18n } = this.$store
      // TODO:
      i18n.locale = this.$i18n.locale

      return i18n
    }
  }
}
</script>

<style lang="less" scoped>
</style>