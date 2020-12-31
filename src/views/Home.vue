<template>
  <a-layout-content class="container-fluid px-0">
    <div class="cover d-flex py-0 py-md-5">
      <a-layout-content class="container-lg px-4 d-flex align-items-center">
        <div class="col-12 col-md-6 col-lg-6 ms-0 ms-lg-3 ps-0 ps-lg-5">
          <h1 class="mb-1">{{ $t('global.home.cover_t') }}</h1>
          <span>{{ $t('global.home.cover_c') }}</span>
          <div class="line-frame p-3 mt-5">
            <iHomeUnion class="me-2" />{{ $t('global.home.cover_circulation') }}
            <h5 class="fs-5 py-1">
              <a-spin spin :spinning="tokens.UU.totalSupply.state.busy">
                $ {{ tokens.UU.totalSupply.view }}
              </a-spin>
            </h5>
            <a-button type="primary">
              <router-link to="/exchange" class="d-flex logo-mark">
                {{ $t('global.home.cover_cast') }}
              </router-link>
            </a-button>
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
      <div class="d-flex flex-wrap px-2 px-lg-5 mx-lg-4">
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <span class="line-frame p-2 d-flex justify-content-center align-items-center"><iHomeTrait1 /></span>
          <h4 class="fs-4 mb-1 mt-3">{{ $t('global.home.trait1_t') }}</h4>
          <span class="text-center text-lg-start">{{ $t('global.home.trait1_c') }}</span>
        </div>
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <span class="line-frame p-2 d-flex justify-content-center align-items-center"><iHomeTrait2 /></span>
          <h4 class="fs-4 mb-1 mt-3">{{ $t('global.home.trait2_t') }}</h4>
          <span class="text-center text-lg-start">{{ $t('global.home.trait2_c') }}</span>
        </div>
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <span class="line-frame p-2 d-flex justify-content-center align-items-center"><iHomeTrait3 /></span>
          <h4 class="fs-4 mb-1 mt-3">{{ $t('global.home.trait3_t') }}</h4>
          <span class="text-center text-lg-start">{{ $t('global.home.trait3_c') }}</span>
        </div>
        <div class="col-12 col-lg-6 pb-5 px-3 d-flex flex-column align-items-center align-items-lg-start">
          <span class="line-frame p-2 d-flex justify-content-center align-items-center"><iHomeTrait4 /></span>
          <h4 class="fs-4 mb-1 mt-3">{{ $t('global.home.trait4_t') }}</h4>
          <span class="text-center text-lg-start">{{ $t('global.home.trait4_c') }}</span>
        </div>
      </div>
    </div>
  </a-layout-content>

  <a-layout-content class="container-lg px-4">
    <div class="d-flex flex-wrap justify-content-between align-items-center py-3 mt-4">
      <div class="col py-3 mx-3 px-5 d-flex flex-column align-items-center align-items-xl-start">
        <h4 class="fs-4 mb-1">{{ $t('layer.community.join') }}</h4>
        <span>{{ $t('layer.community.about') }}</span>
      </div>

      <div class="communityLinks justify-content-center p-3 d-flex text-center col-12 col-xl-auto flex-wrap">
        <a v-for="(item, key) in communityLinks"
          :key="key"
          :href=item.href
          class="text-reset mx-2 px-3 py-3 d-flex flex-column align-items-center"
          :target=item.target
          :title=item.name>
          <template v-if=item.popover>
            <a-popover trigger="click">
              <template #content>
                <img class="qrcode" src="/img/community/qrcode_wechat@2x.png" />
              </template>

              <span class="d-flex flex-column align-items-center">
                <component :is="item.component" class="mb-2"></component>
                {{ $t(item.i18n) }}
              </span>
            </a-popover>
          </template>
          <template v-else>
            <component :is="item.component" class="mb-2"></component>
            {{ $t(item.i18n) }}
          </template>
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
    tokens () {
      return this.$store.tokens
    },
    communityLinks () {
      const { i18n } = this.$store

      const telegramUrl = i18n.locale === 'zh-CN'
        ? 'https://t.me/SFinanceCN'
        : 'https://t.me/SFinanceEN'

      return [
        { href: 'https://twitter.com/SFinanceEx', target: '_blank', i18n: 'layer.community.twitter', component: iHomeTwitter },
        { href: 'javascript:void(0);', popover: true, target: '_blank', i18n: 'layer.community.wechat', component: iHomeWechat },
        { href: telegramUrl, target: '_blank', i18n: 'layer.community.telegram', component: iHomeTelegram },
        { href: 'https://discord.gg/rc49Dzu', target: '_blank', i18n: 'layer.community.discord', component: iHomeDiscord },
        { href: 'https://medium.com/s-finance', target: '_blank', i18n: 'layer.community.medium', component: iHomeMedium },
        { href: 'https://github.com/s-finance-org/uu-finance-web', target: '_blank', i18n: 'layer.community.github', component: iHomeGithub },
      ]
    }
  },
};
</script>
<style scoped lang="less">
.cover {
  height: 470px;
  background: linear-gradient(269.92deg, #F2F2F2 0.07%, #FFFFFF 99.93%);
  h1 {
    font-size: 48px;
    line-height: 58px;
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
.communityLinks {
  a {
    border-radius: 8px;
    min-width: 88px;
    &:hover {
      background-color: rgba(229,243,243,0.5);
    }
  }
}
.qrcode {
  width: 114px;
  height: 114px;
}
</style>
