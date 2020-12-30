<template>
  <a-layout-header class="container-fluid px-0 d-flex justify-content-center align-items-center">
    <div class="header container-lg px-4 px-lg-0 d-flex align-items-center">
      <router-link to="/" class="d-flex logo-mark">
        <iLogo class="me-4" />
      </router-link>
      <a-menu
        v-model:selectedKeys="currentViewName"
        mode="horizontal"
        class="d-flex col-auto d-none d-lg-flex">
        <a-menu-item v-for="item in navs"
          :key="item.id"
          >
          <router-link :to=item.to>{{ $t(item.i18n) }}</router-link>
        </a-menu-item>
      </a-menu>

      <div class="ms-auto">
        <a-dropdown v-if=wallet.isValidated placement="bottomRight">
          <a-button class="d-flex align-items-center" size="small" :title="wallet.address">
            <span class="point point-primary me-2"></span>
            {{ wallet.addressShortened }}
            <iDownOutlined class="ms-2" />
          </a-button>
          <template #overlay>
            <a-menu @click="walletMenuClick">
              <a-menu-item key="change">{{ $t('layer.header.wallet.change') }}</a-menu-item>
              <a-menu-item key="reset">{{ $t('layer.header.wallet.disconnect') }}</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button v-else @click=changeWallet class="d-flex align-items-center" size="small">
          {{ $t('layer.header.wallet.connect') }}
        </a-button>
      </div>

      <a-button class="ms-4 d-lg-none" @click="showDrawer" size="small"><iMenu /></a-button>
    </div>
  </a-layout-header>
  <div class="header-holder"></div>

  <a-drawer
    placement="right"
    v-model:visible="visible"
  >
    <a-menu
      v-model:selectedKeys="currentViewName"
      mode="vertical-right"
      class="mt-4">
      <a-menu-item v-for="item in navs"
        :key="item.id"
        >
        <router-link :to=item.to>{{ $t(item.i18n) }}</router-link>
      </a-menu-item>
    </a-menu>
  </a-drawer>
</template>

<script>
import { LoadingOutlined } from '@ant-design/icons-vue';
import { iLogo, iDownOutlined, iMenu } from '../../components/icons'

export default {
  components: {
    iLogo,
    iDownOutlined,
    iMenu,
    LoadingOutlined
  },
  data() {
    return {
      visible: false,
      top: 10,
      bottom: 10,
    };
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    changeWallet () {
      this.$store.wallet.changeWallet()
    },
    resetWallet () {
      this.$store.wallet.resetWallet()
    },
    walletMenuClick (val) {
      const KEYS = {
        change: this.changeWallet,
        reset: this.resetWallet
      }
      console.log(KEYS[val.key])
      KEYS[val.key]
        && KEYS[val.key]()

    }
  },
  computed: {
    navs () {
      return [
        { id: 'Home', to: '/', i18n: 'layer.header.nav.home' },
        { id: 'Cast', to: '/cast', i18n: 'layer.header.nav.cast' },
        { id: 'Exchange', to: '/exchange', i18n: 'layer.header.nav.exchange' },
        { id: 'Yield', to: '/yield', i18n: 'layer.header.nav.yield' },
        // { id: 'About', to: '/about', i18n: 'test' },
      ]
    },
    currentViewName: {
      get () {
        return [this.$route.name]
      }
    },
    wallet () {
      const { wallet } = this.$store

      return wallet
    }
  }
}
</script>

<style lang="less" scoped>
.ant-layout-header {
  position: fixed;
  z-index: 10;
  backdrop-filter: blur(60px);
}
.logo-mark::before {
  content: 'alpha';
  position: absolute;
  font-size: 12px;
  background-color: #428e8e;
  color: #fff;
  padding: 4px;
  line-height: 9px;
  margin: -4px 0 0 27px;
}
.ant-menu {
  background-color: transparent;
  .ant-menu-item {
    width: auto;
  }
}
.ant-menu-horizontal {
  border-bottom: 0px;
  .ant-menu-item, .ant-menu-item:hover {
    border-bottom: 0px;
  }
}
.ant-menu-vertical-right {
  border: 0;
}
.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: transparent;
}
.ant-menu-inline {
  border-right: 0px;
  .ant-menu-item {
    border-right: 0px;
  }
}
.header-holder, .ant-layout-header{
  height: 80px;
}
</style>