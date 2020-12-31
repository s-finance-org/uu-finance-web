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
        cast: 'Mint',
        exchange: 'Swap',
        yield: 'Claim',
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
    home: {
      cover_t: 'Yielding United USD',
      cover_c: 'A kind of stable coin with both market circulation & yielding',
      cover_circulation: 'Circulation of UU',
      cover_cast: 'Mint',
      trait1_t: 'Liberty of issuing stable currencies',
      trait1_c: 'Everyone could participate in creating UU. Once minted, UU could circulate in the market',
      trait2_t: '100% staking mint',
      trait2_c: 'Every UU is created by staking other stable coins',
      trait3_t: 'Multi-earnings',
      trait3_c: 'Earnings include fee、APY and other token reward',
      trait4_t: 'Safe & Transparent',
      trait4_c: 'UU is totally community-oriented, with full safety and transparency of block-chain technology.',
    }
  }
}