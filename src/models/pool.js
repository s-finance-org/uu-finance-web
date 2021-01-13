import { reactive } from 'vue'

import ModelValueEther from './value/ether'
import ModelValueError from './base/error'
import storeWallet from '../store/wallet'

export default {
  /**
   * @param {Object} opts
   * @param {string=} opts.code
   * @param {string=} opts.address
   * @param {Array=} opts.abi
   * @param {Object=} opts.methods
   * 
   * 
   * 
   * ModelValueEtherModelValueEther
   * @return {!Object}
   */
  create ({
    code = '',
    address = '',
    abi = [],
    methods = {},

    getVirtualPrice = ModelValueEther.create(),

    coinsAddressMethodName = 'coins',
    balancesMethodName = 'balances',
    feeMethodName = 'fee',
    getVirtualPriceMethodName = 'get_virtual_price'
  } = {}) {
    const __store__ = {
      contract: null
    }

    return {
      ...methods,

      /**
       * Base
       */
      /** @type {string} */
      code,
      /** @type {Object}} */
      name: ModelValueString.create(),
      /** @type {string} */
      address,
      /** @type {Array} */
      abi,

      /**
       * 合约
       * - 被动式连接
       * @type {Object}
       */
      get contract () {
        // TODO: 待重构
        const { contract } = __store__
        const { address, abi } = this

        return __store__.contract
          || (__store__.contract = new storeWallet.web3.eth.Contract(abi, address))
      },

      get initiateSeries () {
        // FIXME: 待完善
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
          underlying
          // { decodeType: name.type, call: [address, contract.methods[nameMethodName]().encodeABI()], target: name },
          // { decodeType: symbol.type, call: [address, contract.methods[symbolMethodName]().encodeABI()], target: symbol },
          // { decodeType: totalSupply.type, call: [address, contract.methods[totalSupplyMethodName]().encodeABI()], target: totalSupply }
        ]
      },

      getVirtualPrice,


      error: ModelValueError.create()
    }
  }
}