import ant_zhCN from 'ant-design-vue/es/locale/zh_CN';

import base from '../helpers/base'

export default {
  ...base.create({
    id: 'zh-CN',
    name: '中文（简体）'
  }),
  ant: ant_zhCN,
  layer: {
    header: {
      nav: {
        home: '首页',
        cast: '获得 UU',
        exchange: '稳定币兑换',
        yield: '领取收益',
      },
      wallet: {
        change: '变更钱包',
        disconnect: '断开钱包',
        connect: '连接钱包',
      }
    },
    community: {
      twitter: '推特',
      wechat: '微信',
      telegram: '电报',
      discord: 'Discord',
      medium: 'Medium',
      github: 'GitHub',
      join: '加入社区',
      about: '深入了解 UU'
    },
    footer: {
      slogan: 'UU，有收益的稳定币'
    },
  },
  global: {
    home: {
      cover_t: '有收益的稳定币',
      cover_c: '在流通使用同时还可以领取收益的稳定币',
      cover_circulation: 'UU 当前流通量',
      cover_cast: '立即获得 UU',
      trait1_t: '稳定币发行自由',
      trait1_c: '无门槛参与创造，生成即可流通',
      trait2_t: '100% 抵押发行',
      trait2_c: '每一发行的 UU 都由其它主流稳定币进行抵押',
      trait3_t: '多重收益',
      trait3_c: '收益包括兑换手续费、稳定币生息以及其它代币奖励',
      trait4_t: '安全透明',
      trait4_c: 'UU 充分利用了区块链技术的安全性与透明性，智能合约已经通过了 XXXX 和 XXXX 的安全审核',
    }
  },
}