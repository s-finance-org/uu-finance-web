<template>
  <a-layout-header class="container-fluid px-0">
    <div class="header container-lg py-3 px-4 px-lg-0 d-flex align-items-center">
      <WechatOutlined class="logo me-4" />
      <a-menu v-model:selectedKeys="current" mode="horizontal" class="d-flex col-auto">
        <a-menu-item v-for="(item, key) in navs"
          :key="key"
          >
          <router-link :to=item.to>{{ item.name }}</router-link>
        </a-menu-item>
      </a-menu>

      <a-dropdown placement="bottomRight">
        <a-button size="small">连接钱包 <DownOutlined /></a-button>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="1"><UserOutlined />1st menu item</a-menu-item>
            <a-menu-item key="2"><UserOutlined />2nd menu item</a-menu-item>
            <a-menu-item key="3"><UserOutlined />3rd item</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script>
import { DownOutlined, WechatOutlined } from '@ant-design/icons-vue';

export default {
  components: {
    DownOutlined,
    WechatOutlined
  },
  data() {
    return {
      current: ['home'],
    };
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
  height: 80px;
  backdrop-filter: blur(60px);
}
.ant-menu {
  background-color: transparent;
  .ant-menu-item {
    width: auto;
  }
}
// header {
//   position: 'fixed';
//   z-index: 99;
//   width: '100%';
// }
</style>