<template>
  <a-layout-header class="container-fluid px-0">
    <div class="header container-lg py-3 px-4 px-lg-0 d-flex align-items-center">
      <router-link to="/" class="d-flex">
        <iLogo class="me-4" />
      </router-link>
      <a-menu
        v-model:selectedKeys="currentViewName"
        mode="horizontal"
        class="d-flex col-auto d-none d-lg-flex">
        <a-menu-item v-for="item in navs"
          :key="item.id"
          >
          <router-link :to=item.to>{{ item.name }}</router-link>
        </a-menu-item>
      </a-menu>

      <a-dropdown placement="bottomRight" class="ms-auto">
        <a-button class="d-flex align-items-center" size="small">连接钱包<iDownOutlined class="ms-3" /></a-button>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="1">item1</a-menu-item>
            <a-menu-item key="2">item2</a-menu-item>
            <a-menu-item key="3">item3</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

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
      mode="inline"
      class="mt-4"
    >
      <a-menu-item v-for="(item, key) in navs"
        :key="key"
      >
        <router-link :to=item.to>{{ item.name }}</router-link>
      </a-menu-item>
    </a-menu>
  </a-drawer>
</template>

<script>
import { iLogo, iDownOutlined, iMenu } from '../../components/icons'

export default {
  components: {
    iLogo,
    iDownOutlined,
    iMenu,
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
    change(affixed) {
      console.log(affixed);
    },
  },
  computed: {
    navs () {
      return [
        { id: 'Home', to: '/', name: '首页' },
        { id: 'Cast', to: '/cast', name: '获得 UU' },
        { id: 'Exchange', to: '/exchange', name: '稳定币兑换' },
        { id: 'Yield', to: '/yield', name: '领取收益' },
        { id: 'About', to: '/about', name: 'test' },
      ]
    },
    currentViewName: {
      get () {
        return [this.$route.name]
      }
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
  .ant-menu-inline {
    border-right: 0px;
    .ant-menu-item {
      border-right: 0px;
    }
  }
.header-holder, .ant-layout-header {
  height: 80px;
}
</style>