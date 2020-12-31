import ant_enUS from 'ant-design-vue/es/locale/en_US';

import base from '../helpers/base'

export default {
  ...base.create({
    id: 'en-US',
    name: 'English'
  }),
  ant: ant_enUS,
  layer: {
    header: {
      nav: {
        home: 'Home',
        cast: 'Cast',
        exchange: 'Exchange',
        yield: 'Yield',
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
      join: 'Join the community',
      about: 'Learn more about UU'
    },
    footer: {
      slogan: 'UU, A profitable stablecoin'
    },
    coming: {
      title: 'COMING SOON...'
    }
  },
  global: {
    home: {
      cover_t: 'Profitable stablecoin',
      cover_c: 'Stable coins that can be used in circulation and can also receive income',
      cover_circulation: 'UU current circulation',
      cover_cast: 'Get UU immediately',
      trait1_t: 'Free issuance of stablecoins',
      trait1_c: 'Participate in creation without threshold, generate and circulate',
      trait2_t: '100% mortgage issuance',
      trait2_c: 'Every UU issued is mortgaged by other mainstream stablecoins',
      trait3_t: 'Multiple benefits',
      trait3_c: 'Profits include exchange fees, stablecoin interest and other token rewards',
      trait4_t: 'safe and transparent',
      trait4_c: 'UU makes full use of the security and transparency of blockchain technology, and the smart contract has passed the security audit of XXXX and XXXX',
    }
  }
}