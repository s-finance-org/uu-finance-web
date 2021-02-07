import ModelSwap from '../../../models/swap'
import { getDotenvAddress } from '../../helpers/methods'
import abi from './abi'
import storeWallet from '../../wallet'

export default ModelSwap.create({
  address: getDotenvAddress('MULTICALL_SWAP'),
  abi,
  methods: {
    /**
     * @param {Array} calls tuple[]
     * @return {Array}
     */
    async aggregate (calls) {
      const { contract } = this

      let result = null
      try {
        /* res
          {
            0: number, // blockNumber
            1: Array, // returnData
            blockNumber: number, // blockNumber
            returnData: Array, // returnData
          }
         */
        console.log('mulit calls', calls)
        result = await contract.methods.aggregate(calls).call()
        console.log('mulit result', result)
      } catch (err) {
        console.error('nulticall aggregate()', err)
      }

      return result
    },

    /**
     * @param {Array} targetQueues [
     * {  decodeType: '', 不存在时，则使用 target.type
     *    call: [],
     *    [target: Object,] Modal 的数据
     *    [result: null]
     * }, ...]
     * @return {Object} { successful, targetQueues }
     */
    async batcher (targetQueues) {
      const { web3 } = storeWallet
      const result = {
        successful: false,
        targetQueues
      }
      const multiData = await this.aggregate(targetQueues.map(item => item.call))

      // aggregate 比如要有返回值，否则没有 forEach 意义
      if (multiData) {
        result.successful = true
        targetQueues.forEach((item, idx) => {
          // 解码值后更新目标
          item.result = web3.eth.abi.decodeParameter(item.decodeType || item.target.type, multiData.returnData[idx])

          if (item.target) {
            // 通用 IO
            // TODO: 
            item.target.setValue
              ? item.target.setValue(item.result)
              : (item.target.value = item.result)
          }
        })
      }

      return targetQueues
    },
    // TODO: test
    async series (arr) {

      // update
      this.__serieData__ = this.__serieData__.concat(arr)

      if (this.isReady === false) {
        this.isReady = true
        setTimeout(() => {
          // 非引用
          const __a = this.__serieData__.concat()
          this.__serieData__ = []
console.log('series')
          this.isReady = false

           this.batcher(__a)
        }, 1000)
      }
    },
    isReady: false,

    __serieData__: []
  }
})
