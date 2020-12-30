import Web3 from 'web3'
import Onboard from 'bnc-onboard'
import { reactive } from 'vue'

import ModelInfura from './infura'
import ModelState from '../base/state'
import { DEFAULT_NETWORK_ID } from './constant'
import { isMobile, forEach, addressShortener } from '../../utils'

const CACHE_WALLET_NAME = '__Global_Wallet_Selected'

export default {
  /**
   * @param {number|string} param 当前配置的网络 ID
   * @param {string} infuraKey
   * @return {!Object}
   */
  create ({
    networkId = DEFAULT_NETWORK_ID,
    infuraKey = '',
  } = {}) {
    const NETWORK_ID = +networkId || DEFAULT_NETWORK_ID
    const infura = ModelInfura.create({ networkId: NETWORK_ID, infuraKey })

    const __store__ = {
      name: undefined,
      address: '',
      // 缺省 infuraWeb3
      web3: infura.web3
    }

    const wallet = reactive({
      /**
       * 钱包名称
       * @type {string|undefined}
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
       * @type {string|undefined}
       */
      get address () {
        return __store__.address
      },
      set address (val) {
        const result = val || ''

        // 不同时才会覆盖
        if (__store__.address !== result) {
          __store__.address = result
          this.addressShortened = addressShortener(result)
        }
      },
      /**
       * 缩短的用户钱包地址
       * - 由 address 维护
       * @type {string}
       */
      addressShortened: '',

      /** Web3 */
      /**
       * 当前使用的 web3
       * @type {!Object}
       */
      get web3 () {
        return __store__.web3
      },
      set web3 (val) {
        __store__.web3 = val
      },
      /**
       * infura
       * @type {Object}
       */
      infuraWeb3: infura.web3,
      /**
       * 对应 window.web3
       * @type {Object}
       */
      get windowWeb3 () {
        return window.web3
      },
      set windowWeb3 (val) {
        window.web3 = val
      },
      RPC_URL: infura.RPC_URL,
      /**
       * 初始钱包配置
       */
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
          address
            && (this.address = address)
          network
            && (this.networkId = network)

          // 使用钱包的
          this.windowWeb3 = this.web3 = new Web3(wallet.provider)
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
        this.windowWeb3 = this.web3 = this.infuraWeb3
      },

      /**
       * 当前网络 ID
       * @type {number|undefined}
       */
      networkId: NETWORK_ID,
      /**
       * 当前钱包是否有效
       * - 无法 set
       * @type {boolean}
       */
      get isValidated () {
        const { networkId, address } = this

        // 必须与配置的网络 ID 一样
        return networkId === NETWORK_ID
          && !!address
      },
      /**
       * 校验网络 ID 是否有效
       * @param {number} networkId
       */
      async checkNetwork (networkId) {
        // const { name } = this

        this.networkId = networkId

        if (!this.isValidated) {
          wallet.deployDefaultWeb3()

          // 官方说明需要先调用 walletSelect，但这里 walletSelect 后 body 会被 hidden
          // await onboard.walletSelect(name)
          // 当网络不匹配时，onboard 会要求变更网络
          await onboard.walletCheck()
        }
      },

      // 状态
      state: ModelState.create()
    })

    const currentProvider = wallet.windowWeb3 ? wallet.windowWeb3.currentProvider : {}

    const originWallets = {
      // MetaMask
      metamask: {
        onboard: { walletName: "metamask", preferred: true },
        // TODO:
        envFactor: true
      },
      walletConnect: {
        onboard: { walletName: "walletConnect", preferred: true, infuraKey },
        // TODO:
        envFactor: true
      },
      trezor: {
        onboard: { walletName: 'trezor', preferred: true, appUrl: process.env.VUE_APP_URL, email: process.env.VUE_APP_CONTACT_EMAIL, rpcUrl: infura.RPC_URL },
        // TODO:
        envFactor: true
      },
      ledger: {
        onboard: { walletName: "ledger", preferred: true, rpcUrl: infura.RPC_URL },
        // TODO:
        envFactor: true
      },
      trust: {
        onboard: { walletName: "trust", rpcUrl: infura.RPC_URL },
        envFactor: currentProvider.isTrust,
        envWalletName: 'Trust',
      },
      // imToken
      imToken: {
        onboard: { walletName: "imToken", rpcUrl: infura.RPC_URL },
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
      // 移动端钱包 App 环境限定，或无环境条件
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
        async network (networkId) {
          await wallet.checkNetwork(networkId)
        },
        address (address) {
          if (address) {
            wallet.address = address
          } else {
            if (localStorage.getItem('-walletlink:https://www.walletlink.org:session:id') == null) {
              wallet.resetWallet()
              wallet.changeWallet()
            }
          }
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

    wallet.init()

    return wallet
  }
}