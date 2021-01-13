import { reactive } from 'vue'

import ModelValueError from './base/error'
import storeWallet from '../store/wallet'

export default {
  /**
   * @param {Object} opts
   * @param {string=} opts.code // TODO: 暂无作用
   * @param {string=} opts.address
   * @param {Array=} opts.abi
   * @param {Object=} opts.methods
   * @return {!Object}
   */
  create ({
    code = '',
    address = '',
    abi = [],
    methods = {}
  } = {}) {
    const __store__ = {
      contract: null
    }

    return {
      ...methods,

      /**
       * Base
       */
      code,
      address,
      abi,

      /**
       * 合约
       * - 被动式连接
       * @type {Object}
       */
      get contract () {
        const { contract } = __store__
        const { address, abi } = this

        return __store__.contract
          || (__store__.contract = new storeWallet.web3.eth.Contract(abi, address))
      },
      web3: storeWallet.web3,


      error: ModelValueError.create()
    }
  }
}