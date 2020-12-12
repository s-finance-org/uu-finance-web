<template>
  <a-layout-content class="container-fluid px-0" style="background-color: #f00f00">
    <div class="cover d-flex py-0 py-md-5">
      <div class="col-12 col-md-6 col-lg-4">
        <h1 class="fs-1">有收益的稳定币</h1>
        <span>在流通使用同时还可以领取收益的稳定币</span>
        <div class="line-frame p-3">
          <WechatOutlined />UU 当前流通量
          <h5 class="fs-5">$999,999,999.99</h5>
          <a-button type="primary">立即获得 UU</a-button>
        </div>
      </div>
      <WechatOutlined />
    </div>
  </a-layout-content>

  <a-layout-content class="container-lg px-0" style="background-color: red;">
    <div class="trait d-flex">
      <div class="d-flex flex-wrap">
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <WechatOutlined class="line-frame p-2 d-flex justify-content-center align-items-center" />
          <h4 class="fs-4 mb-1 mt-3">稳定币发行自由</h4>
          <span>无门槛参与创造，生成即可流通</span>
        </div>
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <WechatOutlined class="line-frame p-2 d-flex justify-content-center align-items-center" />
          <h4 class="fs-4 mb-1 mt-3">100% 抵押发行</h4>
          <span>每一发行的 UU 都由其它主流稳定币进行抵押</span>
        </div>
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <WechatOutlined class="line-frame p-2 d-flex justify-content-center align-items-center" />
          <h4 class="fs-4 mb-1 mt-3">多重收益</h4>
          <span>收益包括兑换手续费、稳定币生息以及其它代币奖励</span>
        </div>
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <WechatOutlined class="line-frame p-2 d-flex justify-content-center align-items-center" />
          <h4 class="fs-4 mb-1 mt-3">安全透明</h4>
          <span>UU 充分利用了区块链技术的安全性与透明性，智能合约已经通过了 XXXX 和 XXXX 的安全审核</span>
        </div>
      </div>
    </div>

    <div class="d-flex flex-wrap justify-content-between align-items-center py-3 mt-4">
      <div class="joinCommunity col-12 col-lg py-3 d-flex flex-column align-items-center align-items-lg-start">
        <h4 class="fs-4 mb-1">加入社区</h4>
        <span>深入了解 UU</span>
      </div>
      <div class="communityLinks justify-content-center py-3 d-flex text-center col-12 col-lg-auto flex-wrap">
        <a v-for="(item, key) in communityLinks"
          :key="key"
          :href=item.href
          class="text-reset mx-2 px-3 py-2"
          :target=item.target>
          <WechatOutlined class="mb-2" />
          {{ item.name }}
        </a>
      </div>
    </div>
  </a-layout-content>
</template>
<script>
import { WechatOutlined } from '@ant-design/icons-vue';

export default {
  data () {
    return {
    }
  },
  components: {
    WechatOutlined,
  },
  computed: {
    communityLinks () {
      return [
        { href: '###', target: '_blank', name: '推特' },
        { href: '###', target: '_blank', name: '微信' },
        { href: '###', target: '_blank', name: '电报' },
        { href: '###', target: '_blank', name: 'Discord' },
        { href: '###', target: '_blank', name: 'Medium' },
        { href: '###', target: '_blank', name: 'GitHub' },
      ]
    }
  }
};
</script>
<style scoped lang="less">
.cover {
  height: 470px;
}
.trait {
  background: #E5F3F3;
  border-radius: 8px;
  padding: 0 74px;
  margin-top: 40px;
  > div {
    margin-top: -40px;
  }
  .anticon {
    font-size: 86px;
  }
}
.joinCommunity {
  padding: 0 98px;
}
.communityLinks {
  a {
    border-radius: 8px;
    min-width: 78px;
    .anticon {
      font-size: 38px;
      display: block;
      &.anticon-wechat {
        color: #4CBF00;
      }
    }
    &:hover {
      background-color: #B4F5EE;
    }
  }
}
</style>
