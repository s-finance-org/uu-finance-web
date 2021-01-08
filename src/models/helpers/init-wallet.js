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

      /**
       * 当前网络 ID
       * @type {number|undefined}
       */
      networkId: NETWORK_ID,
      /**
       * 校验网络 ID 是否有效
       * @param {number} networkId
       */
      async checkNetwork (networkId) {
        const { isConnectWallet } = this

        this.networkId = networkId

        // 已连上钱包时才可以 walletCheck()，否则需要 walletSelect()，而如果 walletSelect() 则会连续出现2次弹框
        if (this.isConnectWallet) {
          // 官方说明需要先调用 walletSelect，但这里 walletSelect 后 body 会被 hidden
          // await onboard.walletSelect(name)
          // 当网络不匹配时，onboard 会要求变更网络
          await onboard.walletCheck()
        }
      },

      /**
       * 当前钱包数据是否有效
       * - 无法 set
       * - true 有钱包地址、网络 id 符合、连接钱包时
       * @type {boolean}
       */
      get isValidated () {
        const { networkId, address, isConnectWallet } = this

        // 必须与配置的网络 ID 一样
        return networkId === NETWORK_ID
          // TODO: 钱包地址格式校验
          && !!address
          && isConnectWallet
      },

      /**
       * 当前使用的 web3
       * @type {!Object}
       */
      get web3 () {
        return this.isConnectWallet && this.walletWeb3
          // 没链接到钱包
          || this.infuraWeb3
      },
      /**
       * infura
       * @type {Object}
       */
      infuraWeb3: infura.web3,
      /**
       * 钱包自身
       * @type {Object}
       */
      walletWeb3: null,
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
      //   // TODO: 目前 web 下无效
      //   onboard.accountSelect()
      // },
      /**
       * 变更钱包
       * @param {string=} walletName 指定钱包
       */
      async changeWallet (walletName = undefined) {
        const { state } = this

        state.beforeUpdate()

        try {
          // 变更钱包完成后，再钱包是否已准备好
          await onboard.walletSelect(walletName)
            && await onboard.walletCheck()

          // 由 onboard.wallet 的监听触发，而不用在这里
          // this.updateWallet()
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
        const { wallet, network, appNetworkId } = onboard.getState()

        if (wallet.provider == null) {
          // 重置钱包
          this.resetWallet()
        } else {
          // update
          this.name = wallet.name
          this.networkId = network

          // 使用钱包的
          // wallet.address 有效后会使用钱包赋值的 this.web3，因此先处理 this.web3
          this.walletWeb3 = new Web3(wallet.provider)
          this.isConnectWallet = true

          state.afterUpdate()
        }
      },
      /**
       * 是否与钱包连上
       * @type {boolean}
       */
      isConnectWallet: false,

      /**
       * 重置当前钱包
       */
      resetWallet () {
        const { state } = this

        // 已经断开则不再重置
        if (!this.isConnectWallet) return false

        // update
        this.name = ''
        this.address = ''
        this.walletWeb3 = null

        state.reset()
        this.isConnectWallet = false

        // 重置 Onboard 钱包状态并断开
        onboard.walletReset()
        console.info('Wallet disconnected.')
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
          // 必须要有 isConnectWallet，否则断开后再切换账号，仍然会获取地址
          if (address && wallet.isConnectWallet) {
            // 唯一 address 赋值处
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