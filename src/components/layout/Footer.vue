<template>
  <a-layout-footer class="container-lg px-4 px-lg-0 d-flex justify-content-between align-items-center">
    <span>{{ $t('layer.footer.slogan') }}</span>
    <a-dropdown placement="topRight">
      <a-button size="small" class="d-flex">
        <iLanguage />
        <span class="mx-2">{{ i18n.baseLang.name }}</span>
        <iSelect />
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
import { iLanguage, iSelect } from '@/components/icons'

export default {
  components: {
    iLanguage,
    iSelect,
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