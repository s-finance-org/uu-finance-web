<template>
  <a-layout-content class="container-fluid px-0">
    <div class="cover d-flex py-0 py-md-5">
      <a-layout-content class="container-lg px-4 d-flex align-items-center">
        <div class="col-12 col-md-6 col-lg-6 ms-0 ms-lg-3 ps-0 ps-lg-5">
          <h1 class="mb-1">有收益的稳定币</h1>
          <span>在流通使用同时还可以领取收益的稳定币</span>
          <div class="line-frame p-3 mt-5">
            <iHomeUnion class="me-2" />UU 当前流通量
            <h5 class="fs-5 py-1">$999,999,999.99</h5>
            <a-button type="primary">立即获得 UU</a-button>
          </div>
        </div>
        <div class="col-auto ms-auto pe-4 d-none d-md-block">
          <iHomeCoverUU />
        </div>
      </a-layout-content>
    </div>
  </a-layout-content>
  <a-layout-content class="container-lg px-0">
    <div class="trait d-flex">
      <div class="d-flex flex-wrap px-2 mx-0 px-lg-5 mx-lg-4">
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <span class="line-frame p-2 d-flex justify-content-center align-items-center"><iHomeTrait1 /></span>
          <h4 class="fs-4 mb-1 mt-3">稳定币发行自由</h4>
          <span class="text-center text-lg-start">无门槛参与创造，生成即可流通</span>
        </div>
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <span class="line-frame p-2 d-flex justify-content-center align-items-center"><iHomeTrait2 /></span>
          <h4 class="fs-4 mb-1 mt-3">100% 抵押发行</h4>
          <span class="text-center text-lg-start">每一发行的 UU 都由其它主流稳定币进行抵押</span>
        </div>
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <span class="line-frame p-2 d-flex justify-content-center align-items-center"><iHomeTrait3 /></span>
          <h4 class="fs-4 mb-1 mt-3">多重收益</h4>
          <span class="text-center text-lg-start">收益包括兑换手续费、稳定币生息以及其它代币奖励</span>
        </div>
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <span class="line-frame p-2 d-flex justify-content-center align-items-center"><iHomeTrait4 /></span>
          <h4 class="fs-4 mb-1 mt-3">安全透明</h4>
          <span class="text-center text-lg-start">UU 充分利用了区块链技术的安全性与透明性，智能合约已经通过了 XXXX 和 XXXX 的安全审核</span>
        </div>
      </div>
    </div>

    <div class="d-flex flex-wrap justify-content-between align-items-center py-3 mt-4 px-4">
      <div class="joinCommunity col-12 col-lg py-3 mx-3 px-5 d-flex flex-column align-items-center align-items-lg-start">
        <h4 class="fs-4 mb-1">加入社区</h4>
        <span>深入了解 UU</span>
      </div>
      <div class="communityLinks justify-content-center p-3 d-flex text-center col-12 col-lg-auto flex-wrap">
        <a v-for="(item, key) in communityLinks"
          :key="key"
          :href=item.href
          class="text-reset mx-2 px-3 py-3 d-flex flex-column align-items-center"
          :target=item.target
          :title=item.name>
          <component :is="item.component" class="mb-2"></component>
          {{ item.name }}
        </a>
      </div>
    </div>
  </a-layout-content>
</template>

<script>
import {
  iHomeTrait1,
  iHomeTrait2,
  iHomeTrait3,
  iHomeTrait4,
  iHomeDiscord,
  iHomeGithub,
  iHomeMedium,
  iHomeTelegram,
  iHomeTwitter,
  iHomeWechat,
  iHomeCoverUU,
  iHomeUnion } from '../components/icons';
import Icon from '@ant-design/icons-vue';

export default {
  data () {
    return {
    }
  },
  components: {
    iHomeTrait1,
    iHomeTrait2,
    iHomeTrait3,
    iHomeTrait4,
    iHomeDiscord,
    iHomeGithub,
    iHomeMedium,
    iHomeTelegram,
    iHomeTwitter,
    iHomeWechat,
    iHomeCoverUU,
    iHomeUnion
  },
  computed: {
    communityLinks () {
      return [
        { href: '###', target: '_blank', name: '推特', component: iHomeTwitter },
        { href: '###', target: '_blank', name: '微信', component: iHomeWechat },
        { href: '###', target: '_blank', name: '电报', component: iHomeTelegram },
        { href: '###', target: '_blank', name: 'Discord', component: iHomeDiscord },
        { href: '###', target: '_blank', name: 'Medium', component: iHomeMedium },
        { href: '###', target: '_blank', name: 'GitHub', component: iHomeGithub },
      ]
    }
  }
};
</script>
<style scoped lang="less">
.cover {
  height: 470px;
  background: linear-gradient(269.92deg, #F2F2F2 0.07%, #FFFFFF 99.93%);
  h1 {
    font-size: 48px;
  }
}
.trait {
  background: #E5F3F3;
  border-radius: 8px;
  margin-top: 144px;
  > div {
    margin-top: -40px;
  }
  .line-frame {
    width: 104px;
    height: 104px;
  }
}
.joinCommunity {
  // padding: 0 84px;
}
.communityLinks {
  a {
    border-radius: 8px;
    min-width: 78px;
    &:hover {
      background-color: #B4F5EE;
    }
  }
}
</style>
