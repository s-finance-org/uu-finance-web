<template>
  <a-layout-footer class="container-lg px-4 px-lg-0 d-flex justify-content-between align-items-center" style="background-color: #f0f000">
    <span>{{ $t('base.footer.slogan') }}</span>
    <a-dropdown placement="topRight">
      <a-button size="small">
        <DownOutlined />
        <span class="mx-2">{{ i18n.baseLang.name }}</span>
        <DownOutlined />
      </a-button>
      <template #overlay>
        <a-menu>
          <a-menu-item
            v-for="(lang, name) of i18n.supports"
            :key="`Lang_${name}`"
            :value="name">
            <span>{{ lang.name }}</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-layout-footer>


  <a-radio-group v-model:value="$i18n.locale">
      <a-radio-button
        v-for="(lang, name) of i18n.supports"
        :key="`Lang_${name}`"
        :value="name">
        {{ lang.name }}
      </a-radio-button>
    </a-radio-group>

    <br/>
    <h1 class="">.fs-1 text</h1>
    <h2>.fs-1 text</h2>
    <h3>.fs-1 text</h3>
    <h4 class="fs-4">.fs-1 text</h4>
    <h5>.fs-1 text</h5>
    <h6>.fs-1 text</h6>
    <p class="fs-1">.fs-1 text</p>
    <p class="fs-2">.fs-2 text</p>
    <p class="fs-3">.fs-3 text</p>
    <p class="fs-4">.fs-4 text</p>
    <p class="fs-5">.fs-5 text</p>
    <p class="fs-6">.fs-6 text</p>
    <small>small</small>
</template>

<script>
import { DownOutlined } from '@ant-design/icons-vue';

export default {
  data () {
    return {
      value: { key: 'lucy' },
    };
  },
  components: {
    DownOutlined,
  },
  methods: {
  },
  computed: {
    i18n () {
      const { i18n } = this.$store
      // TODO:
      i18n.locale = this.$i18n.locale

      return i18n
    }
  }
};
</script>

<style lang="less" scoped>

</style>