import { reactive } from 'vue'
import tokens from './tokens'
import i18n from '../i18n'
import web3 from './web3'



import ModelNotify from '../models/notify'

const notify = ModelNotify.create({
})


export default reactive({
  i18n,
  tokens,
  web3,
  notify
})