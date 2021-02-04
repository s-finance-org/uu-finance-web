import { NETWORK_ID, DEFAULT_NETWORK_ID, NETWORK_NAMES, DEFAULT_ADDRESS } from '../../models/helpers/constant'
import globalMessage from '../../utils/global/message'

/**
 * 从 .env 中获取地址
 * - VUE_APP_MAIN_ + 大写 name
 * @param {string} name
 * @return {string}
 */
export const getDotenvAddress = name => {
  // 不存在则用缺省，并改为大写
  const networkName = (NETWORK_NAMES[NETWORK_ID] || NETWORK_NAMES[DEFAULT_NETWORK_ID]).toLocaleUpperCase()
  const key = `VUE_APP_${networkName}_${name}`
  let result = DEFAULT_ADDRESS

  try {
    result = process.env[key]
  } catch (e) {
    globalMessage.error(`No ${key} address found in .env`)
  }

  return result
}

/**
 * 监听事件
 * @param {Object} opts
 * @param {Object} opts.contract
 * @param {string=} opts.name 事件名
 * @param {string=} opts.transactionHash 交易哈希
 * TODO: 是否有更好的办法，需要考虑 once 的问题限制了
 * @param {Function=} opts.success 成功时的方法（针对一个事件多次调用）
 * @return {Promise}
 */
export const listenEvent = async ({
  contract,
  name = 'allEvents',
  transactionHash = '',
  success = () => {}
} = {}) => {
  return new Promise((resolve, reject) => {

    contract.events[name]()
      // 接收到新的事件时触发
      .on('data', data => {
        /* data
          event - String: 事件名称
          signature - String|Null: 事件签名，如果是匿名事件，则为null
          address - String: 事件源地址
          returnValues - Object: 事件返回值，例如 {myVar: 1, myVar2: '0x234...'}.
          logIndex - Number: 事件在块中的索引位置
          transactionIndex - Number: 事件在交易中的索引位置
          transactionHash 32 Bytes - String: 事件所在交易的哈希值
          blockHash 32 Bytes - String: 事件所在块的哈希值，pending的块该值为 null
          blockNumber - Number: 事件所在块的编号，pending的块该值为null
          raw.data - String: 该字段包含未索引的日志参数
          raw.topics - Array: 最多可保存4个32字节长的主题字符串数组。主题1-3 包含事件的索引参数
        */

        const result = {
          event: 'data',
          returnValues: data.returnValues
        }

        // transactionHash 存在则为过滤条件
        if (!(transactionHash
          ? transactionHash === data.transactionHash
          // 不在范围内则跳过
          : true)) return false

        success(result)
console.log('listenEvent data', name, data)

        resolve(result)
      // 当事件从区块链上移除时触发
      }).on('changed', data => {
        // TODO: 按照需求增加过滤
console.log('listenEvent changed', name, data)

        resolve({
          event: 'changed',
          returnValues: data.returnValues
        })
      }).on('error', err => {
        reject({
          event: 'error',
          error: err
        })
      })
  })
}
