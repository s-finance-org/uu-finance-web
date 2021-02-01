<template>
  <a-layout-header ref="header" class="container-fluid px-0 d-flex justify-content-center align-items-center">
    <div class="header container-lg px-4 px-lg-0 d-flex align-items-center">
      <router-link to="/" class="d-flex logo-mark pe-2">
        <iLogo class="me-3" />
      </router-link>
      <a-menu
        v-model:selectedKeys="currentViewName"
        mode="horizontal"
        class="d-flex col-auto d-none d-lg-flex navSide">
        <a-menu-item v-for="item in navs"
          :key="item.id"
          >
          <router-link :to=item.to>{{ $t(item.i18n) }}</router-link>
        </a-menu-item>
      </a-menu>

      <div class="ms-auto">
        <!-- <a-dropdown v-if=wallet.isValidated placement="bottomRight">
          <a-button class="d-flex align-items-center" size="small" :title="wallet.address">
            <span class="point point-primary me-2"></span>
            {{ wallet.addressShortened }}
            <span class="icon-downOutlined ms-2"></span>
          </a-button>
          <template #overlay>
            <a-menu @click="onWalletMenuClick">
              <a-menu-item key="change">{{ $t('layer.header.wallet.change') }}</a-menu-item>
              <a-menu-item key="reset">{{ $t('layer.header.wallet.disconnect') }}</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown> -->
        <a-button @click="onWalletMenuClick" class="d-flex align-items-center pe-3" size="small">
          <template v-if=wallet.isValidated>
            <span class="point point-primary me-2"></span>
            {{ wallet.addressShortened }}
          </template>
          <template v-else>
            <span class="h4 icon-wallet pe-2"></span>
            {{ $t('layer.header.wallet.connect') }}
          </template>
        </a-button>

        <a-modal
          v-model:visible="walletAccountInfoVisible"
          :title="$t('global.base.account')"
          centered
          class="walletAccountInfo"
          okText=''
          maskClosable
          cancelText=''
          :footer="null"
        >
          <template #closeIcon>
            <span class="icon-cancel"></span>
          </template>
          <span class="d-flex justify-content-between align-items-center">
            <small>{{ $t('global.base.connectedWallet', [wallet.name] ) }}</small>
            <a-button @click="onWalletMenuClick" size="small" type="link">{{ $t('layer.header.wallet.change') }}</a-button>
          </span>
          <span class="fs-4">{{ wallet.addressShortened }}</span>
          <small class="d-flex align-items-center pt-2">
            <a href="javascript:void(0);" :data-clipboard-text=wallet.address.handled class="copyAddress d-flex align-items-center">
              <span class="h4 icon-copy me-1"></span>
              {{ $t(copied
                ? 'layer.header.wallet.copiedAddress'
                : 'layer.header.wallet.copyAddress') }}
            </a>
            <a :href=wallet.getEtherscanUrl target="_blank" class="d-flex align-items-center">
              <span class="h4 icon-maximize me-1 ms-3"></span>
              {{ $t('layer.header.wallet.viewOnEtherscan') }}
            </a>
          </small>
        </a-modal>
      </div>

      <a-button class="ms-4 d-lg-none py-1" @click="showDrawer" size="small">
        <span class="h4 icon-menu"></span>
      </a-button>
    </div>
  </a-layout-header>
  <div class="header-holder"></div>

  <a-drawer
    placement="right"
    v-model:visible="menuVisible"
  >
    <a-menu
      v-model:selectedKeys="currentViewName"
      mode="vertical-right"
      class="mt-4 navSide">
      <a-menu-item v-for="item in navs"
        :key="item.id"
        >
        <router-link :to=item.to>{{ $t(item.i18n) }}</router-link>
      </a-menu-item>
    </a-menu>
  </a-drawer>
</template>

<script>
import { iLogo } from '../../components/icons'
import ClipboardJS from 'clipboard'

export default {
  components: {
    iLogo,
  },
  data() {
    return {
      menuVisible: false,
      walletAccountInfoVisible: false,
      copied: false,
    };
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll, true) // 监听滚动事件
    this.handleScroll()

    this.copyAddress()
  },
  beforeUnmount () {
    window.removeEventListener('scroll', this.scrollToTop, true)
  },
  methods: {
    handleScroll () {
      const scrollTop = Math.min(document.documentElement.scrollTop || document.body.scrollTop, 200)

      if (this.$refs.header.$el) {
        this.$refs.header.$el.style.backgroundColor = `rgba(255, 255, 255, ${scrollTop / 333} )`
        this.$refs.header.$el.style.height = 120 - scrollTop / 5 + 'px'
      }
    },
    showDrawer() {
      this.menuVisible = true;
    },
    copyAddress () {
      const { wallet } = this.$store
      // TODO:
      let clipboard = new ClipboardJS('.copyAddress');

      clipboard.on('success', e => {
        this.copied = true
        setTimeout(() => {
          this.copied = false
        } ,750)
      });

      // clipboard.on('error', function(e) {
      //     console.log(e);
      // });
    },
    onWalletMenuClick (val) {
      const { wallet } = this.$store
      const walletAccountInfoVisible = this.walletAccountInfoVisible

      if (wallet.isValidated) {
        walletAccountInfoVisible
          && wallet.changeWallet()

        this.walletAccountInfoVisible = !walletAccountInfoVisible
      } else {
        wallet.changeWallet()
      }

      // const KEYS = {
      //   change: () => { wallet.changeWallet() },
      //   reset: () => { wallet.resetWallet() },
      // }

      // KEYS[val.key]
      //   && KEYS[val.key]()
    }
  },
  computed: {
    navs () {
      return [
        { id: 'Home', to: '/', i18n: 'layer.header.nav.home' },
        { id: 'Mint', to: '/mint', i18n: 'layer.header.nav.mint' },
        // { id: 'Swap', to: '/swap', i18n: 'layer.header.nav.swap' },
        { id: 'Claim', to: '/claim', i18n: 'layer.header.nav.claim' },
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

<style lang="less">
.ant-layout-header {
  position: fixed;
  z-index: 10;
  backdrop-filter: blur(60px);
  // background-color: rgba(255, 255, 255, 0.6);
}
// .logo-mark::before {
//   content: 'alpha';
//   position: absolute;
//   font-size: 12px;
//   background-color: #428e8e;
//   color: #fff;
//   padding: 4px;
//   line-height: 9px;
//   margin: -4px 0 0 27px;
// }

.navSide {
  &.ant-menu {
    background-color: transparent;
    &:not(.ant-menu-horizontal) .ant-menu-item-selected {
      background-color: transparent;
    }
    .ant-menu-item {
      width: auto;
    }
  }
  &.ant-menu-horizontal {
    border-bottom: 0px;
    .ant-menu-item, .ant-menu-item:hover {
      border-bottom: 0px;
    }
  }
  &.ant-menu-vertical-right {
    border: 0;
  }
  .ant-menu-inline {
    border-right: 0px;
    .ant-menu-item {
      border-right: 0px;
    }
  }
}

.header-holder, .ant-layout-header{
  height: 120px;
}

.walletAccountInfo {
  .ant-modal-content {
    border-radius: 8px !important;
    padding-bottom: 20px;
    .ant-modal-header {
      padding: 20px 24px;
      border-radius: 8px 8px 0 0;
      border-bottom: 0;
      .ant-modal-title {
        font-size: 16px;
        line-height: 24px;
        font-weight: normal;
        color: rgba(17, 20, 20, 0.9);
      }
    }
    .ant-modal-body {
      padding: 8px 8px 8px 16px;
      border: 1px solid rgba(17, 20, 20, 0.1);
      border-radius: 4px;
      margin: 0 24px;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>