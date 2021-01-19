import ant_enUS from 'ant-design-vue/es/locale/en_US';

import base from '../helpers/base'

export default {
  ...base.create({
    id: 'en-US',
    name: 'English'
  }),
  ant: ant_enUS,
  error: {
    '4001': 'MetaMask Tx Signature: User denied transaction signature.'
  },
  message: {
    valueOutValidRange: 'Value is out of valid range',
  },
  layer: {
    header: {
      nav: {
        home: 'Home',
        mint: 'Mint',
        swap: 'Swap',
        claim: 'Claim',
      },
      wallet: {
        change: 'Change',
        disconnect: 'Disconnect',
        connect: 'Connect wallet',
      }
    },
    community: {
      twitter: 'Twitter',
      wechat: 'WeChat',
      telegram: 'Telegram',
      discord: 'Discord',
      medium: 'Medium',
      github: 'GitHub',
      join: 'Join our community',
      about: 'More details about UU'
    },
    footer: {
      slogan: 'UU, Yielding United USD'
    },
    coming: {
      title: 'COMING SOON...'
    }
  },
  global: {
    base: {
      reserves: 'Currency Reserves',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      maxBalanceOf: 'Max',
      approve: 'Approve',
      approveTip: 'Please approve',
      resetApprove: 'Reset Approve',
      resetApproveTip: 'Please reset Approve',
      reward: 'Reward',
      estimatedTransactionFee: 'Transaction Fee',
      apy: 'APY',
      miningPool: 'Mining pool'
    },
    home: {
      cover_t: 'Yielding United USD',
      cover_c: 'A kind of stable coin with both market circulation & yielding',
      cover_circulation: 'Circulation of UU',
      cover_mint: 'Mint',
      trait1_t: 'Liberty of issuing stable currencies',
      trait1_c: 'Everyone could participate in creating UU. Once minted, UU could circulate in the market',
      trait2_t: '100% staking mint',
      trait2_c: 'Every UU is created by staking other stable coins',
      trait3_t: 'Multi-earnings',
      trait3_c: 'Earnings include fee、APY and other token reward',
      trait4_t: 'Safe & Transparent',
      trait4_c: 'UU is totally community-oriented, with full safety and transparency of block-chain technology.',
    },
    mint: {
      title: 'Deposit stable currency assets and get UU',
      subtitle: 'You can choose to deposit a stablecoin pool liquidity certificate, interest-bearing tokens or directly deposit stablecoins to get UU',
      liquidityPool: 'Liquidity pool',
      selectTokenTypes: {
        lpt: 'LPT Token',
        interestToken: 'Interest token',
        stablecoin: 'Stablecoin'
      },
      deposit: {
        tab: 'Deposit to get UU',
        selectAssetes: 'Select the type of assets deposited',
        mintAssetMode: {
          multipleTab: 'Multi-asset deposit',
          singleTab: 'Single asset deposit',
          placeholder: 'Enter the deposit amount',
        },
        mintBtn: 'Deposit',
        previewReceiveLeast: 'You will receive at least'
      },
      withdraw: {
        tab: 'Remove and destroy UU',
        selectAssetes: 'Select asset type to withdraw',
        mintAssetMode: {
          multipleTab: 'Multiple asset withdrawal',
          singleTab: 'Single asset withdrawal',
          placeholder: 'Enter the amount taken out',
        },
        mintBtn: 'Withdrawal',
        previewNeedLeast: 'You will need at least'
      }
    },
    claim: {
      title: 'Hold UU, get multiple benefits',
      subtitle: 'Handling fees and interest-earning income are automatically issued to the wallet, and token rewards need to be collected',
      own: {
        tab: 'My reward',
        pendingReward: 'Reward pending',
        paidReward: 'Reward received',
        totalReward: 'Total Reward',
        receiveAward: 'Receive award',
        sideTip: 'You can choose to receive only one reward at a time or receive it all at once. The settler needs to settle before receiving the reward. If you have not received the token reward for more than 7 days, you may be collected by someone else. The entrusted person can get 10% of the entrusted entitlement, and the remaining part will be automatically issued to your wallet. '
      },
      claimTo: {
        tab: 'Help Ta take the lead',
        claimRewards: 'Reward can be claimed on behalf of',
        rewardRate: 'Reward rate on behalf of you',
        behalfRewards: 'Representation Rewards',
        behalfReceiveRewards: 'Representation Reward',
        sideTip: 'You can choose to receive only one reward at a time or receive it all at once. The settler needs to settle before receiving the reward. If you have not received the token reward for more than 7 days, you may be collected by someone else. The entrusted person can get 10% of the entrusted entitlement, and the remaining part will be automatically issued to your wallet. '
      },
      settle: {
        tab: 'Participate in settle',
        pendingSettleReward: 'Pending Settle Reward',
        settleRewardRate: 'Settle Reward Rate',
        settleReward: 'Settle Reward',
        participateSettle: 'Participate in settle',
        sideTip: 'Anyone can become a settler, and the settler can get 1% of the reward to be settled. '
      }
    }
  }
}