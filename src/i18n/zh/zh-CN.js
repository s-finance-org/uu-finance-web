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
      resetApproveTip: '请重置授权',
      reward: '奖励',
      estimatedTransactionFee: '预计矿工费',
      apy: '年化收益率',
      miningPool: '流动性矿池'
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
        placeholder: '输入存入数量',
        mintBtn: '存款',
        previewReceiveLeast: '你将至少收到'
      },
      withdraw: {
        tab: '取出销毁 UU',
        selectAssetes: '选择取出资产类型',
        placeholder: '输入取出数量',
        mintBtn: '取款',
        previewNeedLeast: '你将至少需要'
      }
    },
    claim: {
      title: '持有 UU，获得多重收益',
      subtitle: '手续费和生息收益自动发放至钱包，代币奖励需要领取',
      own: {
        tab: '我的奖励',
        totalApy: '合计年化收益率',
        allClaim: '领取全部',
        pendingReward: '待领取奖励',
        paidReward: '已领取奖励',
        totalReward: '合计奖励',
        receiveAward: '领取奖励',
        sideTip: '你可以选择每次只领取一种奖励也或者一次性全部领取，领取奖励之前需要有结算者先进行结算。如果你有代币奖励超过 7 天未领取将可能被他人代领。代领人可以获得代领奖励的 10%，剩余部分自动发放至你的钱包。'
      },
      claimTo: {
        tab: '帮 Ta 代领',
        claimRewards: '可代领奖励',
        rewardRate: '代领奖励率',
        behalfRewards: '代领奖励',
        behalfReceiveRewards: '代领奖励',
        sideTip: '你可以选择每次只领取一种奖励也或者一次性全部领取，领取奖励之前需要有结算者先进行结算。如果你有代币奖励超过 7 天未领取将可能被他人代领。代领人可以获得代领奖励的 10%，剩余部分自动发放至你的钱包。'
      },
      settle: {
        tab: '参与结算',
        pendingSettleReward: '待结算奖励',
        settleRewardRate: '结算奖励率',
        settleReward: '结算奖励',
        participateSettle: '参与结算',
        sideTip: '任何人可以成为结算者，结算者可以获得待结算奖励的 1%。'
      }
    }
  },
}