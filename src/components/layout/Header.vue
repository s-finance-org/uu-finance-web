<template>
  <a-layout-header ref="header" class="container-fluid px-0 d-flex flex-column justify-content-center align-items-center">
    <div class="latest-banner container-fluid p-1" v-show="ixd.latest">
      <span v-html=ixd.latest></span>
      <a class="px-2" @click="onLatest" href="javascript:void(0);">{{ $t('global.base.more') }}</a>
    </div>
    <div ref="headerContent" class="header-content container-lg px-4 px-lg-0 d-flex align-items-center">
      <router-link to="/" class="d-flex pe-2">
        <iLogo class="me-3" />
      </router-link>
      <a-menu
        v-model:selectedKeys="ixd.currentViewName"
        mode="horizontal"
        class="d-flex col-auto d-none d-lg-flex navSide">
        <a-menu-item v-for="item in navs"
          :key="item.id"
          >
          <router-link :to=item.to>{{ $t(item.i18n) }}</router-link>
        </a-menu-item>
      </a-menu>

      <div class="ms-auto">
        <a-button @click="onWalletMenuClick" class="d-flex align-items-center pe-3" size="small">
          <template v-if=ixd.wallet.isValidated>
            <span class="point point-primary me-2"></span>
            {{ ixd.wallet.addressShortened }}
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
            <small>{{ $t('global.base.connectedWallet', [ixd.wallet.name] ) }}</small>
            <a-button @click="onWalletMenuClick" size="small" type="link">{{ $t('layer.header.wallet.change') }}</a-button>
          </span>
          <span class="fs-4">{{ ixd.wallet.addressShortened }}</span>
          <small class="d-flex align-items-center pt-2">
            <a href="javascript:void(0);" :data-clipboard-text=ixd.wallet.address.handled class="copyAddress d-flex align-items-center">
              <span class="h4 icon-copy me-1"></span>
              {{ $t(copied
                ? 'layer.header.wallet.copiedAddress'
                : 'layer.header.wallet.copyAddress') }}
            </a>
            <a :href=ixd.wallet.getEtherscanUrl target="_blank" class="d-flex align-items-center">
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
  <div ref="headerHolder" class="header-holder"></div>

  <a-drawer
    placement="right"
    v-model:visible="menuVisible"
  >
    <a-menu
      v-model:selectedKeys="ixd.currentViewName"
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
import { h } from 'vue'
import { Button, Layout, Menu, Drawer, Modal } from 'ant-design-vue'
import { iLogo } from '../../components/icons'
import { parseAntComponent } from '../../utils/helpers'
import ClipboardJS from 'clipboard'

export default {
  components: {
    ...parseAntComponent([Button, Layout.Header, Drawer, Menu, Menu.Item, Modal]),
    iLogo,
  },
  data() {
    return {
      menuVisible: false,
      walletAccountInfoVisible: false,
      copied: false,
    };
  },
  async mounted () {
    window.addEventListener('scroll', this.handleScroll, true) // 监听滚动事件
    this.copyAddress()

    await this.$store.announcements.update()
    this.handleScroll()
  },
  beforeUnmount () {
    window.removeEventListener('scroll', this.scrollToTop, true)
  },
  methods: {
    handleScroll () {
      const scrollTop = Math.min(document.documentElement.scrollTop || document.body.scrollTop, 200)

      if (this.$refs.header.$el) {
        this.$refs.header.$el.style.backgroundColor = `rgba(255, 255, 255, ${scrollTop / 333} )`
        this.$refs.headerContent.style.marginTop = 20 - scrollTop / 10 + 'px'
        this.$refs.headerContent.style.marginBottom = 20 - scrollTop / 10 + 'px'
        this.$refs.headerHolder.style.height = this.$refs.header.$el.offsetHeight + 'px'
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
    },
    onLatest () {
      const { $router, $store } = this
      const { i18n: { $i18n, locale }, announcements: { latest } } = $store

      const modal = Modal.confirm({
        title: h('div', {
          class: ['fs-5', 'pb-3'],
          innerHTML: latest[locale].title,
        }),
        width: 720,
        forceRender: true,
        content: h('p', {
          class: ['fs-6'],
          innerHTML: latest[locale].content,
        }),
        centered: true,
        mask: false,
        okText: $i18n.global.t('layer.header.latest.close'),
        cancelText: $i18n.global.t('layer.header.latest.more'),
        onCancel (close) {
          $router.push({ name: 'Announcement', path: '/announcement' })
          close()
        }
      })
    }
  },
  computed: {
    navs () {
      return [
        { id: 'Home', to: '/', i18n: 'layer.header.nav.home' },
        { id: 'Mint', to: '/mint', i18n: 'layer.header.nav.mint' },
        // { id: 'Swap', to: '/swap', i18n: 'layer.header.nav.swap' },
        { id: 'Claim', to: '/claim', i18n: 'layer.header.nav.claim' },
        { id: 'Announcement', to: '/announcement', i18n: 'layer.header.nav.announcement' },
      ]
    },
    ixd () {
      const { $route } = this
      const { wallet, announcements: { latest }, i18n: { locale } } = this.$store

      return {
        currentViewName: [this.$route.name],
        wallet,
        latest: latest
          && latest[locale]
          && latest[locale].title
      }
    }
  }
}
</script>

<style lang="less">
.ant-layout-header {
  height: auto !important;
  position: fixed;
  z-index: 10;
  backdrop-filter: blur(60px);
  // background-color: rgba(255, 255, 255, 0.6);
  .latest-banner {
    background-color: #50B2B2;
    color: rgba(255,255,255,0.85);
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    a {
      color: #fff;
      padding-right: 8px;
      text-decoration: underline;
    }
  }
  .header-content {
    padding-top: 20px;
    padding-bottom: 20px;
  }
}

.header-holder {
  height: 148px;
}

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