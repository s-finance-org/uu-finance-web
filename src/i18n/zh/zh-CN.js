import ant_zhCN from 'ant-design-vue/es/locale/zh_CN';

import base from '../helpers/base'

export default {
  ...base.create({
    id: 'zh-CN',
    name: '中文（简体）'
  }),
  ant: ant_zhCN,
  error: {
    '4001': 'MetaMask：用户拒绝了交易。'
  },
  message: {
    valueOutValidRange: '值不在有效范围内',
  },
  layer: {
    header: {
      nav: {
        home: '首页',
        mint: '获得 UU',
        swap: '稳定币兑换',
        claim: '领取收益',
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
    coming: {
      title: '敬请期待!'
    }
  },
  global: {
    base: {
      reserves: '资产分布',
      deposit: '存入',
      withdraw: '取出',
      maxBalanceOf: '最多',
      approve: '授权',
      approveTip: '请授权',
      resetApprove: '重置授权',
      resetApproveTip: '请重置授权'
    },
    home: {
      cover_t: '有收益的稳定币',
      cover_c: '在流通使用同时还可以领取收益的稳定币',
      cover_circulation: 'UU 当前流通量',
      cover_mint: '立即获得 UU',
      trait1_t: '稳定币发行自由',
      trait1_c: '无门槛参与创造，生成即可流通',
      trait2_t: '100% 抵押发行',
      trait2_c: '每一发行的 UU 都由其它主流稳定币进行抵押',
      trait3_t: '多重收益',
      trait3_c: '收益包括交易手续费、存款利率以及其它代币奖励',
      trait4_t: '安全透明',
      trait4_c: 'UU 完全属于社区，充分利用了区块链技术的安全性与透明性',
    },
    mint: {
      title: '存入稳定币资产，获得 UU',
      subtitle: '你可以选择存入稳定币池流动性凭证、生息代币或直接存入稳定币获得 UU',
      liquidityPool: '流动性池',
      selectTokenTypes: {
        lpt: '流动性凭证',
        interestToken: '生息代币',
        stablecoin: '稳定币'
      },
      deposit: {
        tab: '存入获得 UU',
        selectAssetes: '选择存入资产类型',
        mintAssetMode: {
          multipleTab: '多资产存入',
          singleTab: '单资产存入',
          placeholder: '输入存入数量',
        },
        mintBtn: '存款',
        previewReceiveLeast: '你将至少收到'
      },
      withdraw: {
        tab: '取出销毁 UU',
        selectAssetes: '选择取出资产类型',
        mintAssetMode: {
          multipleTab: '多资产取出',
          singleTab: '单资产取出',
          placeholder: '输入取出数量',
        },
        mintBtn: '取款',
        previewNeedLeast: '你将至少需要'
      }
    }
  },
}