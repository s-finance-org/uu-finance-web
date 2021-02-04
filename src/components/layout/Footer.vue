<template>
  <a-layout-footer class="container-lg px-4 px-lg-0 py-4 mt-2 d-flex justify-content-between align-items-center flex-wrap">
    <span class="py-2 pe-2">{{ $t('layer.footer.slogan') }}</span>
    <a-dropdown placement="topRight" class="ms-auto">
      <a-button size="small" class="d-flex align-items-center">
        <span class="h4 icon-language pe-2"></span>
        {{ i18n.baseLang.name }}
        <span class="h4 icon-select ps-2"></span>
      </a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item
            v-for="(lang, name) of i18n.supports"
            :key="name"
            :value="name"
            @click="changedI18n">
            <span>{{ lang.name }}</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-layout-footer>
</template>

<script>
// import { AButton, ALayoutFooter, ADropdown, AMenu, AMenuItem } from 'ant-design-vue'

export default {
  components: {
    // AButton,
    // ALayoutFooter,
    // ADropdown,
    // AMenu,
    // AMenuItem
  },
  methods: {
    changedI18n({ key }) {
      this.$i18n.locale = key
    },
  },
  computed: {
    i18n () {
      return this.$store.i18n
    }
  }
};
</script>

<style lang="less" scoped>
</style>