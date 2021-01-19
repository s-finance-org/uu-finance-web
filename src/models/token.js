import BN from 'bignumber.js'

import { ERC20 } from './helpers/abi'
import {
  TOKEN_MIN_AMOUNT_ETHER,
  TOKEN_MAX_AMOUNT_ETHER,
  TOKEN_INFINITE_MIN_AMOUNT_ETHER
} from './helpers/constant'

import ModelValueEther from './value/ether'
import ModelValueInput from './value/input'
import ModelValueWallet from './value/wallet'
import ModelValueString from './value/string'
import ModelValueBytes32 from './value/bytes32'
import ModelValueUint8 from './value/uint8'
import ModelValueError from './base/error'
import ModelState from './base/state'

import storeWallet from '../store/wallet'
import i18n from '../i18n'
import notify from '../store/notify'

import { USD } from '../store/currencies'

import { now } from '../utils'

export default {
  /**
   * @param {Object} opts
   * @param {string} opts.code // TODO: 暂无作用
   * @param {string} opts.address
   * @param {Array} opts.abi
   * @param {boolean=} opts.isLPT 是否为 lp token // TODO: 暂无作用
   * @param {Function=} opts.customSeries
   * 
   * @param {boolean=} opts.isInfiniteAllowance
   * @param {number=} opts.viewDecimal
   * @param {Object=} opts.moneyOfAccount
   * @param {Object=} opts.getPrice
   * @param {Object=} opts.symbol
   * @param {string=} opts.symbolMethodName
   * @param {string=} opts.balanceOfMethodName
   * @param {string=} opts.totalSupplyMethodName
   * @param {Object=} opts.values 严禁值key重名覆盖
   * @param {Object=} opts.methods 严禁方法重名覆盖
   * @return {!Object}
   */
  create ({
    code = '',
    address = '',
    abi = ERC20,
    isLPT = false,
    customSeries = () => [],

    viewDecimal = 4,
    moneyOfAccount = USD,
    // XXX: default
    getPrice = null,
    isInfiniteAllowance = false,
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
    methods = {},
    values = {}
  } = {}) {
    const __default__ = {
      contract: null,
    }
    const __store__ = {
      isCcontractBase: false,
      isContractWallet: false,
      contract: null,
    }
    const __cache__ = {
      networkId: undefined,
      walletAddress: undefined,
      decimals: undefined,
      precision: undefined
    }
    const valueOpts = {
      // TODO: temp
      decimal: 18,
      decimals: ModelValueUint8.create({ value: 18 }),
      viewDecimal
    }

    const result = {
      ...valueOpts,
      ...methods,
      ...values,

      /**
       * Base
       */
      /** @type {string} */
      code,
      /** @type {string} */
      address,
      /** @type {Array} */
      abi,
      /** @type {Object}} */
      name: ModelValueString.create(),
      /** @type {Object} */
      symbol: ModelValueString.create(),
      /**
       * 标识
       * @type {string}
       */
      icon: `token-${code}`,

      /** @type {Object} */
      get contract () {
        const { abi, address } = this

        // TODO: 待优化
        // storeWallet.web3 在钱包失效、链接时已经变更了目标值
console.log('-----------', storeWallet.isValidated, __store__.isContractWallet, __store__.isCcontractBase)
        if (storeWallet.isValidated) {
          if (!__store__.isContractWallet) {
            console.log('------- 地址切换，且用钱包的 web3')
            __store__.contract = new storeWallet.web3.eth.Contract(abi, address)
            __store__.isCcontractBase = false
            __store__.isContractWallet = true
          }
        } else {
          if (!__store__.isCcontractBase) {
            console.log('------- 无地址, 用缺省 web3')
            __store__.contract = new storeWallet.web3.eth.Contract(abi, address)
            // 可能会换钱包，因此重置
            __store__.isContractWallet = false
            __store__.isCcontractBase = true
          }
        }

        return __store__.contract
      },

      /** @type {string} */
      totalSupply: ModelValueEther.create(valueOpts),

      /**
       * 是否为 LP token
       * @type {boolean}
       */
      isLPT,

      get initiateSeries () {

        // FIXME: 待完善
        return [
          ...this.baseSeries,
          // 自定义的
          ...this.customSeries()
        ]
      },
      get baseSeries () {
        const {
          decimals
        } = valueOpts
        const { address, contract, name, symbol, totalSupply } = this

        return [
          { decodeType: decimals.type, call: [address, contract.methods[decimalsMethodName]().encodeABI()], target: decimals },
          { decodeType: name.type, call: [address, contract.methods[nameMethodName]().encodeABI()], target: name },
          { decodeType: symbol.type, call: [address, contract.methods[symbolMethodName]().encodeABI()], target: symbol },
          { decodeType: totalSupply.type, call: [address, contract.methods[totalSupplyMethodName]().encodeABI()], target: totalSupply }
        ]
      },
      /**
       * 自定义丢列
       */
      customSeries,

      price: ModelValueEther.create(valueOpts),
      // XXX: this.getPriceMethod 为合约方法，getPrice为自定义方法，取其一
      // this.getPrice && await this.getPrice()
      getPrice,
      /* 计价货币 */
      moneyOfAccount,
      // XXX: 未设定
      // getPriceMethod,






      // TODO: 设为通用方法
      /** @type {number} */
      get precision () {
        const { decimals } = this
        let result = __cache__.precision

        // 没变动则从缓存获取
        if (__cache__.decimals !== decimals.handled) {
          __cache__.decimals = decimals.handled
          result = __cache__.precision = Math.pow(10, decimals.handled)
        }

        return result
      },

      /**
       * 最小量
       * @type {Object}
       */
      minAmount: ModelValueEther.create({
        ...valueOpts,
        value: TOKEN_MIN_AMOUNT_ETHER,
      }),
      /**
       * 最大量
       * - 等同无限授权量
       * @type {Object}
       */
      maxAmount: ModelValueEther.create({
        ...valueOpts,
        value: TOKEN_MAX_AMOUNT_ETHER,
      }),
      /**
       * 无限授权量的的最小阈值
       * - 无限授权开启时，当已授权低于该值，将再次授权
       * @type {Object}
       */
      infiniteMinAmount: ModelValueEther.create({
        ...valueOpts,
        value: TOKEN_INFINITE_MIN_AMOUNT_ETHER,
      }),

      /**
       * 量值
       * - Input 绑定
       * TODO: 最终类型未确定
       * TODO: 目前使用 handled
       * @type {Object}
       */
      amount: ModelValueInput.create({...valueOpts}),

      /**
       * 量值是否有效
       * @type {boolean}
       */
      get isValidAmount () {
        const { minAmount, maxAmount, amount, error } = this
        const bnAmountEther = BN(amount.ether)
        let result = false

        // 符合数据类型
        // TODO: 可加打点 error
        if (!BN.isBigNumber(bnAmountEther)) return result

        // amount >= minAmount && maxAmount <= amount
        result = bnAmountEther.gte(minAmount.ether)
          && bnAmountEther.lte(maxAmount.ether)

        if (!result) {
          error.message = i18n.$i18n.global.t('message.valueOutValidRange')
        }

        return result
      },

      /**
       * 与其他 token 产生的关联数据
       * - 由 isSufficientAmount() 更新
       * - 只保存当前钱包地址的相关数据，当钱包切换、断开后重置
       * - 与 toContractAddresses 产生关系
       * - 目标合约地址: { At: 1231233, amount: 量值对象, 钱包地址: 0000 }
       * @type {Object}
       */
      associatedTokens: {
        // 'address': {
          // burnGainAmount: ModelValueEther(lpt),
          // mintGainAmount: ModelValueEther(UU),
          // balance: ModelValueEther
        // }
      },
      /**
       * 关联合约的地址集
       * @type {Array}
       */
      toContractAddresses: [],

      /**
       * 是否无限授权数量
       * @type {boolean}
       */
      isInfiniteAllowance,
      // /**
      //  * 是否需要重置授权
      //  * @type {boolean}
      //  */
      // needResetAllowance: false,
      // isNeed

      /**
       * s
       */
      // needApproval () {

      // },

      /**
       * 授权量是否足够
       * - 监听 amount 变动
       * @param {string} toContractAddress
       * @return {boolean}
       */
      // async isSufficientAmount (toContractAddress) {
      //   return result
      // },

      /**
       * 是否需要授权
       * - 自动关联钱包
       * @param {string} toContractAddress
       */
      async isNeedApprove (toContractAddress) {
        // TODO: 待优化
        const { contract, precision, amount, isValidAmount, isInfiniteAllowance, maxAmount, infiniteMinAmount, associatedTokens } = this
        // const bnAmountEther = BN(amount.handled).times(precision)
        const bnAmountEther = BN(amount.ether)
        let result = false

        // TODO: 加 error 打点
        // 不在有效范围内
        if (!isValidAmount
          // 钱包数据无效
          || !storeWallet.isValidated) {

          // TODO: 要用方法管理
          associatedTokens[toContractAddress] = {
            expireAt: now() + 10000 * 1000,
            allowance: {},
            needApprove: false,
            resetApprove: false,
            approve: {},
            approveState: ModelState.create(),
            walletAddress: storeWallet.address
          }
          return result
        }

        // sync
        // TODO: 要用方法管理
        associatedTokens[toContractAddress] = {
          expireAt: now() + 10000 * 1000,
          allowance: { ether: 0 },
          needApprove: false,
          resetApprove: false,
          approve: {},
          approveState: ModelState.create(),
          walletAddress: storeWallet.address
        }

        // TODO: 从 associatedTokens 内先获取，然后看是否有效
        // 流程中的主动更新
        const bnAllowanceEther = BN(await contract.methods[allowanceMethodName](storeWallet.address, toContractAddress).call())
        
        // 
        associatedTokens[toContractAddress].allowance.ether = bnAllowanceEther

        result = isInfiniteAllowance
          // 小于无限授权量最小阈值
          ? bnAllowanceEther.lt(infiniteMinAmount.ether)
          // 授权量不足当前量
          : bnAllowanceEther.lt(bnAmountEther)

        associatedTokens[toContractAddress].needApprove = result

        // TODO: 定位信息
        if (result) {
          if (bnAllowanceEther.gt(0)) {
            associatedTokens[toContractAddress].approve.ether = 0
            // update
            associatedTokens[toContractAddress].needApprove = true
            associatedTokens[toContractAddress].resetApprove = true
          }
        }

        // XXX: 测试代码，重置授权
        // associatedTokens[toContractAddress].approve.ether = 0
        // // update
        // associatedTokens[toContractAddress].needApprove = true
        // associatedTokens[toContractAddress].resetApprove = true
        // await this.approve(toContractAddress)

        return result
      },

      /**
       * 校验 Allowance
       * - 自动关联钱包
       * @param {string} toContractAddress
       */
      async ensureAllowance (toContractAddress) {
        // TODO: 待优化
        const { contract, precision, amount, isValidAmount, isInfiniteAllowance, maxAmount, infiniteMinAmount, associatedTokens } = this
        // const bnAmountEther = BN(amount.handled).times(precision)
        const bnAmountEther = BN(amount.ether)

        if (await this.isNeedApprove(toContractAddress)) {
          const bnAllowanceEther = associatedTokens[toContractAddress].allowance.ether


          const { update, dismiss } = notify.notification({ message: '准备授权' })
          this.approveNotifyDismiss = dismiss
          // 将要授权的量
          // TODO: 针对授权攻击
          // TODO: 要修改成重置 0 完成后再自动无限授权
          // const approveAmountEther = bnAllowanceEther.gt(0)
          //   ? 0
          //   : isInfiniteAllowance
          //     ? maxAmount.ether
          //     : bnAmountEther

          if (bnAllowanceEther.gt(0)) {
            update({
              message: '重置授权量为 0',
            })
            associatedTokens[toContractAddress].approve.ether = 0
            // update
            associatedTokens[toContractAddress].needApprove = true
            associatedTokens[toContractAddress].resetApprove = true
            await this.approve(toContractAddress)
          } else {
            update({
              message: '授权',
            })
            const approveAmountEther = isInfiniteAllowance
              ? maxAmount.ether
              : bnAmountEther.toFixed(0, 1)
  
            associatedTokens[toContractAddress].approve.ether = approveAmountEther
            // update
            associatedTokens[toContractAddress].needApprove = true
  
            await this.approve(toContractAddress)
          }
        }
      },
// ensureAllowance 部分代码要放到 approve 内，从而淘汰 ensureAllowance

      approveNotifyDismiss: null,

      /**
       * 授权量
       * @param {string} toContractAddress
       * @return {Promise}
       */
      approve (toContractAddress) {
        const { contract, precision, associatedTokens, error, state } = this
        // TODO: 
        const approveAmountEther = associatedTokens[toContractAddress].approve.ether

        // 钱包数据无效
        if (!storeWallet.isValidated) return false

        associatedTokens[toContractAddress].approveState.beforeUpdate()

        // 限制当前提交待确认的交易只有一份
        state.beforeUpdate()

        // TODO: 考虑避免一个token 同时多次提交
        return new Promise((resolve, reject) => {
          const listenApproval = ({
            value = '',
            owner = '',
            spender = '',
            // TODO: 
            approveNotifyDismiss = null
          } = {}) => {
            let onceLock = false

            contract.events.Approval()
            .on('data', function (data) {
              /* data
                {
                  returnValues: {
                    owner: '0x'
                    spender: '0x'
                    value: '0'
                  }
                }
               */
              // TODO: 如何停掉监听
              if (onceLock) return false

              console.log()

              // 是否有符合的
              // XXX: value 是 number
              const filter = data.returnValues.value === value + ''
                // TODO: 地址大小写
                && data.returnValues.owner.toLowerCase() === owner.toLowerCase()
                && data.returnValues.spender.toLowerCase() === spender.toLowerCase()

              console.log('events.Approval', filter, data)
              if (filter) {
                approveNotifyDismiss()

                // TODO: ? 到期后 3秒重置
                window.setTimeout(() => onceLock = false, 3000)
                resolve(data)
                // TODO: double event
                onceLock = true
          console.log(spender, toContractAddress)
                associatedTokens[spender].needApprove = false
                // TODO: 等授权完
                associatedTokens[spender].approveState.afterUpdate()
              }
            })
            .on('error', err => {
              error.handler(err)
              associatedTokens[spender].approveState.afterUpdate()

              reject(err)
              state.afterUpdate()
            })
          }
            

            contract.methods[approveMethodName](toContractAddress, approveAmountEther)
              .send({
                from: storeWallet.address,
                // TODO:
                // gasPrice: ,
                // gas: ,
              })
              .once('transactionHash', hash => {
                notify.handler(hash)
                listenApproval({
                  value: approveAmountEther,
                  owner: storeWallet.address,
                  spender: toContractAddress,
                  approveNotifyDismiss: this.approveNotifyDismiss
                })
              })
              .on('error', err => {
                error.handler(err)
              })
              .catch(err => {
                error.handler(err)
                reject(err)
                associatedTokens[toContractAddress].approveState.afterUpdate()
                state.afterUpdate()
              })
          })
      },

      /**
       * Wallet
       */
      walletBalanceOf: ModelValueWallet.create({
        ...valueOpts,
        async trigger (address) {
          const result = await __store__.contract.methods[balanceOfMethodName](address).call()

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

      state: ModelState.create(),
      error: ModelValueError.create(),
    }
console.log('lock', this.lock)
    if (this.lock) {
      this.bindTarget[result.address] = result
    }
    

    return result
  },
  /**
   * - 链式
   * @type {!Object}
   */
  bind(target) {
    this.lock = true
    this.bindTarget = target

    return this
  },
  lock: false
}
