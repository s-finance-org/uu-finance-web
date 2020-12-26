import Web3 from 'web3'
import Onboard from 'bnc-onboard'

import { ModelState } from '../models'
import { isMobile, forEach } from '../utils'

const CACHE_WALLET_NAME = '__Global_Wallet_Selected'
/**
 * 缺省的 networkId
 * @type {number}
 */
const DEFAULT_NETWORK_ID = 1
/**
 * 当前配置的网络 ID
 */
const NETWORK_ID = +process.env.VUE_APP_NETWORK_ID || DEFAULT_NETWORK_ID

const INFURA_ENDPOINTS_DOMIAN = {
  1: 'mainnet.infura.io',
  4: 'rinkeby.infura.io'
}
/**
 * 转为 Infura 专用的 domain
 * @param {number} networkId
 * @return {string}
 */
const toEndpointsDomain = networkId => INFURA_ENDPOINTS_DOMIAN[networkId] || INFURA_ENDPOINTS_DOMIAN[DEFAULT_NETWORK_ID]
const RPC_URL = `https://${toEndpointsDomain(NETWORK_ID)}/v3/${process.env.VUE_APP_INFURA_KEY}`

const windowWeb3 = window.web3
const currentProvider = windowWeb3 ? windowWeb3.currentProvider : {}

const infuraWeb3 = new Web3(RPC_URL)

const originWallets = {
  metamask: {
    onboard: { walletName: "metamask", preferred: true },
    // TODO:
    envFactor: true
  },
  walletConnect: {
    onboard: { walletName: "walletConnect", preferred: true, infuraKey: process.env.VUE_APP_INFURA_KEY },
    // TODO:
    envFactor: true
  },
  trezor: {
    onboard: { walletName: 'trezor', preferred: true, appUrl: process.env.VUE_APP_URL, email: process.env.VUE_APP_CONTACT_EMAIL, rpcUrl: RPC_URL },
    // TODO:
    envFactor: true
  },
  ledger: {
    onboard: { walletName: "ledger", preferred: true, rpcUrl: RPC_URL },
    // TODO:
    envFactor: true
  },
  trust: {
    onboard: { walletName: "trust", rpcUrl: RPC_URL },
    envFactor: currentProvider.isTrust,
    envWalletName: 'Trust',
  },
  imToken: {
    onboard: { walletName: "imToken", rpcUrl: RPC_URL },
    envFactor: currentProvider.isImToken,
    envWalletName: 'imToken'
  },
  coinbase: {
    onboard: { walletName: "coinbase" },
    envFactor: currentProvider.isCoinbaseWallet,
    envWalletName: 'Coinbase'
  },
  status: {
    onboard: { walletName: "status" },
    envFactor: currentProvider.isStatus
  },
  meetone: {
    onboard: { walletName: "meetone" },
    envFactor: currentProvider.wallet === "MEETONE"
  }
}

const wallets = []

forEach(originWallets, wallet => {
  // 移动端钱包 App 环境限定
  (!isMobile || wallet.envFactor)
    && wallets.push(wallet.onboard)
})

const onboard = Onboard({
  dappId: process.env.VUE_APP_BLOCKNATIVE_KEY,
  networkId: NETWORK_ID,
  subscriptions: {
    wallet (info) {
      wallet.updateWallet()
    },
    network (networkId) {
      wallet.checkNetwork(networkId)
    },
    address (address) {
      wallet.address = address
    }
  },
  walletSelect: {
    wallets,
  },
  walletCheck: [
    { checkName: 'derivationPath' },
    { checkName: 'connect' },
    { checkName: 'accounts' },
    { checkName: 'network' },
  ],
})

const __store__ = {
  name: undefined,
  address: undefined,
}

const wallet = {
  /**
   * 钱包名称
   * @type {string}
   */
  get name () {
    return __store__.name
  },
  set name (val) {
    const result = __store__.name = val

    val
      ? localStorage.setItem(CACHE_WALLET_NAME, result)
      : localStorage.removeItem(CACHE_WALLET_NAME)
  },
  /**
   * 用户钱包地址
   * @type {string}
   */
  get address () {
    return __store__.address
  },
  set address (val) {
    const result = val

    if (result === undefined) {
      if(localStorage.getItem('-walletlink:https://www.walletlink.org:session:id') === null)
        this.changeWallet()
    } else {
      // TODO:
      // if(state.contract.default_account && state.contract.initializedContracts)
      // common.update_fee_info()
      __store__.address = result
    }
  },
  /**
   * 钱包的 provider
   * - 如果没有则用 infuraWeb3
   * @type {!Object}
   */
  web3: infuraWeb3,
  async init () {
    const { trust, imToken, coinbase } = originWallets
    try {
      // 自动加载缓存、所在环境的钱包名
      this.changeWallet(localStorage.getItem(CACHE_WALLET_NAME)
        || trust.envFactor && trust.envWalletName
        || imToken.envFactor && imToken.envWalletName
        || coinbase.envFactor && coinbase.envWalletName)
    } catch(err) {
      console.error(err)
    }
  },
  /**
   * 切账号
   */
  // switchAccount () {
  //   // TODO: 要已经连上钱包后
  //   onboard.accountSelect()
  // },
  /**
   * 变更钱包
   * @param {string} [walletName=] 指定钱包
   */
  async changeWallet (walletName = undefined) {
    try {
      // 变更钱包完成后，再钱包是否已准备好
      await onboard.walletSelect(walletName)
        && await onboard.walletCheck()

      this.updateWallet()
    }
    catch(err) {
      console.error(err)
    }
  },
  /**
   * 更新钱包数据
   * @param {Object=} [provider]
   */
  updateWallet (provider = null) {
    const { state } = this
    const { address, wallet, network, appNetworkId } = onboard.getState()

    state.updated = false

    if (wallet.provider == null) {
      this.deployDefaultWeb3()
    } else {
      // update
      this.name = wallet.name
      this.address = address
      this.networkId = network

      // 使用钱包的
      window.web3 = this.web3 = new Web3(wallet.provider)
      state.updated = true
    }
  },
  /**
   * 重置当前钱包
   */
  resetWallet () {
    const { state } = this

    state.updated = false

    // update
    this.name = ''
    this.address = ''

    this.deployDefaultWeb3()

    // 重置 Onboard 钱包状态并断开
    onboard.walletReset()
  },
  /**
   * 配置为默认 web3
   */
  deployDefaultWeb3 () {
    window.web3 = this.web3 = infuraWeb3
  },

  /**
   * 当前网络 ID
   * @type {number}
   */
  networkId: DEFAULT_NETWORK_ID,
  /**
   * 校验网络 ID 是否有效
   * @param {number} networkId
   */
  async checkNetwork (networkId) {
    const { name } = this

    this.networkId = networkId

    if (networkId !== NETWORK_ID) {
      wallet.deployDefaultWeb3()

      // 官方说明需要先调用 walletSelect
      await onboard.walletSelect(name)
        // 当网络不匹配时，onboard 会要求变更网络
        && await onboard.walletCheck()
    }
  },

  // 状态
  state: ModelState.create()
}

wallet.init()

export default wallet

