import { reactive } from 'vue'
import tokens from './tokens'
import coins from './coins'
import pools from './pools'
import i18n from '../i18n'
import notify from './notify'
import wallet from './wallet'
import * as swaps from './swaps'
import announcements from './announcements'

import tokenAddresses from './tokens/token-addresses'

export default reactive({
  i18n,
  coins,
  tokens,
  tokenAddresses,
  pools,
  notify,
  wallet,
  swaps,
  announcements,
})
