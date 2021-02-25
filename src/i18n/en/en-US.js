import ant_enUS from 'ant-design-vue/es/locale/en_US';

import base from '../helpers/base'

export default {
  ...base.create({
    id: 'en-US',
    name: 'English'
  }),
  ant: ant_enUS,
  error: {
    4001: 'MetaMask Tx Signature: User denied transaction signature.'
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
        announcement: 'Announcement'
      },
      wallet: {
        change: 'Change',
        disconnect: 'Disconnect',
        connect: 'Connect wallet',
        copyAddress: 'Copy Address',
        copiedAddress: 'Copied',
        viewOnEtherscan: 'View on Etherscan'
      },
      statement: {
        more: 'More',
        close: 'Ok'
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
      reserves: 'Distribution of assets',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      maxBalanceOf: 'Max',
      approve: 'Approve',
      approveTip: 'Please approve',
      resetApprove: 'Reset Approve',
      resetApproveTip: 'Please reset Approve',
      reward: 'Reward',
      estimatedTransactionFee: 'Estimated gas fee',
      apy: 'APY',
      liquidityPool: 'Liquidity pool',
      acquisitionUrl: 'Get {0}',
      totalAPY: 'Total APY',
      account: 'Account',
      connectedWallet: 'Connected with {0}',
      preview: 'preview',
      more: 'More'
    },
    msg: {
      resettingApprove: 'Resetting approve',
      approving: 'Approving',
      mintingUU: 'UU is minting',
      burningUU: 'UU is burning',
      collectingAllRewards: 'Collecting all rewards',
      claimingSettlement: 'Claiming settlement',
      collectingReward: 'Collecting {0} reward'
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
      trait4_c: 'UU is totally community-oriented, with full safety and transparency of block-chain technology.The UU smart contract has passed the security audit of Armors Labs',
    },
    mint: {
      title: 'Deposit stable coins to get UU',
      subtitle: 'Deposit LP Token of stablecoin pool, interest-bringing token or stable coins  to get UU',
      liquidityPool: 'Liquidity pool',
      selectTokenTypes: {
        lpt: 'LP Token',
        interestToken: 'Interest-bringing token',
        stablecoin: 'Stable coins'
      },
      deposit: {
        tab: 'Deposit to get UU',
        selectAssetes: 'Choose type of assets to deposit',
        placeholder: 'Enter the deposit amount',
        mintBtn: 'Deposit',
        previewReceiveLeast: 'You will receive at least',
      },
      withdraw: {
        tab: 'Withdraw and burn UU',
        selectAssetes: 'Choose the type of assets to withdraw',
        placeholder: 'Enter the amount taken out',
        mintBtn: 'Withdrawal',
        previewNeedLeast: 'You will need at least'
      }
    },
    claim: {
      title: 'Hold UU for more benefit',
      subtitle: 'Fee and interest will be automatically distributed to your wallet. While the token reward need to be claimed by yourselves.',
      own: {
        tab: 'My reward',
        totalApy: 'Total APY',
        allClaim: 'Claim all',
        pendingReward: 'Pending reward',
        paidReward: 'Received reward',
        totalReward: 'Total Reward',
        receiveAward: 'Claim reward',
        sideTip: 'You can choose to receive only one reward at a time or all at once, settlement by agent will be required before you claim the reward.'
      },
      claimTo: {
        tab: 'Help Ta take the lead',
        claimRewards: 'Reward can be claimed on behalf of',
        rewardRate: 'Reward rate on behalf of you',
        behalfRewards: 'Representation Rewards',
        behalfReceiveRewards: 'Representation Reward',
        sideTip: ''
      },
      settle: {
        tab: 'Participate in settle',
        pendingSettleReward: 'Unsettled reward',
        settleRewardRate: 'At least rate',
        settleReward: 'At least settle reward',
        participateSettle: 'Participate in settle',
        sideTip: 'Anyone can become a settler, and the settler can get 1% of the reward to be settled. If the time interval from the last price update exceeds 30 minutes, the price update will be triggered and the gas consumption will increase. At this time, participating in the settlement will receive an additional 1% reward.'
      }
    }
  }
}