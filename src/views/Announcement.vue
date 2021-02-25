<template>
  <a-layout-content class="container-lg px-4">
    <div class="px-lg-5 mx-lg-3">
      <div class="mt-lg-4 mb-4 mb-lg-5 pb-4">
        <h2 class="fs-2 mb-1">{{ $t('layer.header.nav.announcement') }}</h2>
        <span class="fs-6 pe-5 d-block"></span>
      </div>

      <busy :busying=ixd.state.loading>
        <a-list
          item-layout="vertical"
          :data-source="structure.notices"
        >
          <template #renderItem="{ item, index }">
            <div :key="'item-' + index" class="mb-5 pb-4">
              <h4 class="mb-1">{{ item[$i18n.locale].title }}</h4>
              <small class="text-color-secondary d-block py-2">{{ item[$i18n.locale].createAt }}</small>
              <p class="h5 mt-1 text-align-justify" v-html="item[$i18n.locale].content"></p>
            </div>
          </template>
        </a-list>
      </busy>
    </div>
  </a-layout-content>
</template>

<script>
import { Layout, List } from 'ant-design-vue'
import { parseAntComponent } from '../utils/helpers'

import Busy from '../components/busy'

export default {
  components: {
    ...parseAntComponent([Layout.Content, List]),
    Busy
  },
  computed: {
    // 结构性
    structure () {
      const { announcements: { notices } } = this.$store

      return {
        notices,
      }
    },
    // 交互
    ixd () {
      const { announcements: { state } } = this.$store

      return {
        state
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>