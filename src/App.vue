<template>
  <a-config-provider :locale="i18n.language.ant">
    <a-layout class="container-fluid px-0">
      <router-view />
    </a-layout>
  </a-config-provider>
</template>

<script>
export default {
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