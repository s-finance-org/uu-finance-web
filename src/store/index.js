import { reactive } from 'vue'
import tokens from './tokens'
import i18n from '../i18n'
import notify from './notify'
import wallet from './wallet'
import * as swaps from './swaps'

export default reactive({
  i18n,
  tokens,
  notify,
  wallet,
  swaps
})