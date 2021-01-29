const NETWORK_NAMES = {
  1: 'MAIN',
  4: 'RINKEBY'
}
const NETWORK_ID = process.env.VUE_APP_NETWORK_ID

/**
 * VUE_APP_MAIN_ + name
 * @param {string} name
 * @return {string}
 */
export const getDotenvAddress = (name = '') => {
  const result = process.env[`VUE_APP_${NETWORK_NAMES[NETWORK_ID]}_${name}`]

  !result
    && console.error('Not find result value')

  return result
}

/**
 * 监听事件
 * @param {Object} opts
 * @param {string=} opts.name 事件名
 * @param {Object=} opts.contract
 * @param {string=} opts.transactionHash 交易哈希
 * @return {Promise}
 */
export const listenEvent = async ({
  name = '',
  contract = null,
  transactionHash = ''
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
        // transactionHash 存在则为过滤条件
        if (!(transactionHash
          ? transactionHash === data.transactionHash
          : true)) return false

console.log('listenEvent data', name, data)

        resolve({
          event: 'data',
          returnValues: data.returnValues
        })
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
