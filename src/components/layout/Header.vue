<template>
  <a-layout-header class="container-fluid px-0">
    <div class="header container-lg py-3 px-4 px-lg-0 d-flex align-items-center">
      <iLogo class="logo me-4" />
      <a-menu v-model:selectedKeys="current" mode="horizontal" class="d-flex col-auto">
        <a-menu-item v-for="(item, key) in navs"
          :key="key"
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

      <a-button class="ms-4 d-lg-none" size="small"><iMenu /></a-button>
    </div>
  </a-layout-header>
  <div class="header-holder"></div>
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
      current: ['home'],
    };
  },
  methods: {
    change(affixed) {
      console.log(affixed);
    },
  },
  computed: {
    navs () {
      return [
        { id: 'home', to: '/', name: '首页' },
        { id: 'cast', to: '/cast', name: '获得 UU' },
        { id: 'exchange', to: '/exchange', name: '稳定币兑换' },
        { id: 'yield', to: '/yield', name: '领取收益' },
        { id: 'about', to: '/about', name: 'test' },
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.logo {
  font-size: 40px;
}
.ant-layout-header {
  position: fixed;
  z-index: 1050;
  backdrop-filter: blur(60px);
}
.header-holder, .ant-layout-header {
  height: 80px;
}
.ant-menu {
  background-color: transparent;
  .ant-menu-item {
    width: auto;
  }
}
</style>