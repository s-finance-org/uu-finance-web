import BN from 'bignumber.js'
import { reactive } from 'vue'

import storeWallet from '../store/wallet'
import i18n from '../i18n'

import { multicall } from '../store/swaps'

import ModelValueEther from './value/ether'
import ModelValueEther1 from './value/ether1'
import ModelValueWallet from './value/wallet'
import ModelValueString from './value/string'
import ModelValueBytes32 from './value/bytes32'
import ModelValueUint8 from './value/uint8'
import ModelValueError from './value/error'

import { ERC20 } from './helpers/abi'
import { TOKEN_MIN_AMOUNT_ETHER, TOKEN_MAX_AMOUNT_ETHER } from './helpers/constant'
import { USD } from '../store/currencies'

export default {
  /**
   * @param {Object} opts
   * @param {string} [opts.code] // TODO: 暂无作用
   * @param {string} opts.address
   * @param {Array} [opts.abi=]
   * @param {boolean} [opts.isLPT=] 是否为 lp token
   * 
   * 
   * 
   * @param {number=} opts.contDecimal
   * @param {Object=} opts.moneyOfAccount
   * @param {Object=} opts.getPrice
   * @param {Object=} opts.symbol
   * @param {string=} opts.symbolMethodName
   * @param {string=} opts.balanceOfMethodName
   * @param {string=} opts.totalSupplyMethodName
   * @return {!Object}
   */
  create ({
    code = '',
    address = '',
    abi = ERC20,
    isLPT = false,

    contDecimal = 4,
    moneyOfAccount = USD,
    // XXX: default
    getPrice = null,
    symbol = ModelValueString.create(),
    // ERC20
    nameMethodName = 'name',
    symbolMethodName = 'symbol',
    decimalsMethodName = 'decimals',
    balanceOfMethodName = 'balanceOf',
    approveMethodName = 'approve',
    allowanceMethodName = 'allowance',
    totalSupplyMethodName = 'totalSupply',
    transferFromMethodName = 'transferFrom',
    transferMethodName = 'transfer',
  } = {}) {
    const __store__ = {
      contract: null,
      initialized: false,
      precision: 0,
    }

    const valueOpts = {
      // TODO: temp
      decimal: 18,
      decimals: ModelValueUint8.create(),
      contDecimal
    }

    // getApproveMethod: mixin.contract.methods[approveMethodName],
    // getTransferFromMethod: mixin.contract.methods[transferFromMethodName],
    // getTransferMethod: mixin.contract.methods[transferMethodName],

    return reactive({
      /**
       * Base
       */
      code,
      /** @type {string} */
      address,
      /** @type {Array} */
      abi,
      /** @type {Object}} */
      name: ModelValueString.create(),
      /** @type {Object} */
      symbol,

      /** @type {Object} */
      get contract () {
        const { contract } = __store__
        const { abi, address } = this

        return contract
          || (__store__.contract = new storeWallet.web3.eth.Contract(abi, address))
      },

      /** @type {string} */
      totalSupply: ModelValueEther1.create(valueOpts),

      /**
       * 是否为 LP token
       * - TODO:
       * @type {boolean}
       */
      isLPT,

      /**
       * 是否已初始化
       * @type {boolean}
       */
      get initialized () {
        return __store__.initialized
      },

      get initiateSeries () {
        // FIXME:
        return [
          ...this.baseSeries,
          ...this.onceSeries
        ]
      },
      get baseSeries () {
        const {
          decimals
        } = valueOpts
        const {
          address,
          contract
        } = this

        return [
          { decodeType: decimals.type, call: [address, contract.methods[decimalsMethodName]().encodeABI()], target: decimals }
        ]
      },
      get onceSeries () {
        const {
          address,
          contract,
          name,
          symbol,
          totalSupply
        } = this

        return [
          { decodeType: name.type, call: [address, contract.methods[nameMethodName]().encodeABI()], target: name },
          { decodeType: symbol.type, call: [address, contract.methods[symbolMethodName]().encodeABI()], target: symbol },
          { decodeType: totalSupply.type, call: [address, contract.methods[totalSupplyMethodName]().encodeABI()], target: totalSupply }
        ]
      },

      async initiate (isSerie = false) {
        const {
          address,
          name,
          symbol,
          totalSupply,
        } = this

        /* sync */
        // XXX: this.getPriceMethod 为合约方法，getPrice为自定义方法，取其一
        this.getPrice && await this.getPrice()

        const wallet = [
        ]

        let queues = []

        if (!__store__.initialized) {
          __store__.initialized = true
          // queues = base.concat(once)
        }

        // XXX:
        queues = queues.concat(wallet)

        // await multicall.batcher(queues)

        return queues
      },

      price: ModelValueEther1.create(valueOpts),
      getPrice,
      /* 计价货币 */
      moneyOfAccount,
      // XXX: 未设定
      // getPriceMethod,




      ...valueOpts,

      /** @type {number} */
      get precision () {
        const { precision } = __store__
        const { decimals } = this

        return precision
          || (__store__.precision = Math.pow(10, decimals.handled))
      },


      /**
       * Amount
       */
      minAmount: ModelValueEther1.create({
        ...valueOpts,
        ether: TOKEN_MIN_AMOUNT_ETHER,
        contDecimal: 0
      }),
      maxAmount: ModelValueEther1.create({
        ...valueOpts,
        ether: TOKEN_MAX_AMOUNT_ETHER,
        contDecimal: 0
      }),
      // TODO:
      // amount:

      /**
       * @param {string|number} amountEther
       * @return {boolean}
       */
      isValidAmount (amountEther) {
        const { minAmount, maxAmount, error } = this
        const bnAmountEther = BN(amountEther)

        // amount >= minAmount && maxAmount <= amount
        const result = bnAmountEther.gte(minAmount.ether)
          && bnAmountEther.let(maxAmount.ether)

        if (!result) {
          error.message = i18n.$i18n.t('model.valueOutValidRange')
        }

        return result
      },

      /**
       * 是否允许无限授权数量
       * @type {boolean}
       */
      isInfiniteAllowance: false,

      /**
       * 是否需要重置授权
       * @type {boolean}
       */
      needResetAllowance: false,

      /**
       * @param {string|number} amount
       * @param {string} toContractAddress
       * @param {boolean=} infinite
       */
      async ensureAllowance (amount, toContractAddress) {
        // const { precision, error, maxAmount, isInfiniteAllowance, needResetAllowance } = this

        // const amountEther = BN(amount).times(precision)
        // if (!this.isValidAmount(amountEther)) {
        //   return false
        // }

        // const allowanceEther = BN(await contract.methods[allowanceMethodName](store.wallet.address, toContractAddress).call())

        // if (isInfiniteAllowance) {
        //   // allowanceEther < maxAmount.ether / 2
        //   // Half used
        //   allowanceEther.lt(BN(maxAmount.ether).div(2))
        // } else {

        // }
        // // allowanceEther = 0
        // // if (allowanceEther)

        // // // allowanceEther < amountEther
        // // if (allowanceEther.lt(amountEther)) {
        // //   error.message = i18n.$i18n.t('model.approveOperation')
        // // }

        // // needResetAllowance


        // // isInfiniteAllowance
        // //   ? maxAmount.ether
        // //   : amountEther



        // // await approve(contract, maxAllowance, accountAddress, toContract)


        // // // TEST:
        // // if (infinite) {

        // //   if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
        // //     await approve(contract, 0, accountAddress, toContract)
        // //   } else {
        // //     await approve(contract, maxAllowance, accountAddress, toContract)
        // //   }
        // // } else {
        // //   // allowance < amount
        // //   if (allowance.lt(_amount)) {
        // //     if (allowance.gt(0) && requiresResetAllowance.includes(contract._address)) {
        // //       await approve(contract, 0, accountAddress, toContract)
        // //     } else {
        // //       await approve(contract, _amount, accountAddress, toContract)
        // //     }
        // //   }
        // // }
      },

      /**
       * Wallet
       */
      walletBalanceOf: ModelValueWallet.create({
        ...valueOpts,
        async trigger (address) {
          // TODO: 
          const result = await __store__.contract.methods[balanceOfMethodName](address).call()
          console.log('wallet ------ ', result)

          return result
        }
      }),

      /**
       * @param {string} address
       * @return {string}
       */
      async getBalanceOf (address) {
        const { contract } = this
        const result = await contract.methods[balanceOfMethodName](address).call()

        return result
      },

      error: ModelValueError.create(),
    })
  }
}
