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

import { now, floor } from '../utils'
import { ModelValueAddress } from '.'

export default {
  /**
   * @param {Object} opts
   * @param {string} opts.code 内部 token code
   * @param {string} opts.address
   * @param {Array=} opts.abi
   * @param {boolean=} opts.isLpt 是否为 lp token // TODO: 暂无作用
   * @param {Function=} opts.customSeries 自定义列队 multi call
   * @param {Object=} opts.customAssociatedTokenModel 追加 associatedToken 数据集的单元 Modal
   * 
   * 
   * 
   * @param {number=} opts.viewDecimal 显示内容的显示精度
   * @param {Function=} opts.viewMethod 显示内容的舍入方法
   * 
   * @param {boolean=} opts.isInfiniteAllowance
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
    isLpt = false,
    customSeries = () => [],
    customAssociatedTokenModel = { create: () => ({}) },

    viewDecimal = 4,
    viewMethod = floor,



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
      decimals: undefined,
      precision: undefined
    }
    /**
       * 参数接口
       * @type {!Object}
       */
    const parameters = {
      decimals: ModelValueUint8.create({ value: 18 }),
      viewDecimal,
      viewMethod
    }

    const result = {
      parameters,
      // TODO: 待考虑取消
      ...parameters,
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
      totalSupply: ModelValueEther.create(parameters),

      /**
       * 是否为 LP token
       * @type {boolean}
       */
      isLpt,

      get initiateSeries () {
        const {
          decimals
        } = parameters
        const { address, contract, name, symbol, totalSupply } = this

        const baseSeries = [
          { decodeType: decimals.type, call: [address, contract.methods[decimalsMethodName]().encodeABI()], target: decimals },
          { decodeType: name.type, call: [address, contract.methods[nameMethodName]().encodeABI()], target: name },
          { decodeType: symbol.type, call: [address, contract.methods[symbolMethodName]().encodeABI()], target: symbol },
          { decodeType: totalSupply.type, call: [address, contract.methods[totalSupplyMethodName]().encodeABI()], target: totalSupply }
        ]

        // FIXME: 待完善
        return [
          ...baseSeries,
          // 自定义的
          ...this.customSeries()
        ]
      },
      /**
       * 自定义丢列
       */
      customSeries,

      price: ModelValueEther.create(parameters),
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
      minAmount: ModelValueEther.create(parameters).setEther(TOKEN_MIN_AMOUNT_ETHER),
      /**
       * 最大量
       * - 等同无限授权量
       * @type {Object}
       */
      maxAmount: ModelValueEther.create(parameters).setEther(TOKEN_MAX_AMOUNT_ETHER),
      /**
       * 无限授权量的的最小阈值
       * - 无限授权开启时，当已授权低于该值，将再次授权
       * @type {Object}
       */
      infiniteMinAmount: ModelValueEther.create(parameters).setEther(TOKEN_INFINITE_MIN_AMOUNT_ETHER),

      /**
       * 量值
       * - Input 绑定
       * TODO: 最终类型未确定
       * TODO: 目前使用 handled
       * @type {Object}
       */
      amount: ModelValueInput.create(parameters),

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
       * - TODO: ??? 由 isSufficientAmount() 更新
       * - ??? 只保存当前钱包地址的相关数据，当钱包切换、断开后重置
       * - ???? 与 toContractAddresses 产生关系
       * - token address: { At: 1231233, amount: 量值对象 }
       * @type {Object}
       */
      associatedTokens: {},
      /**
       * associatedTokens 数据集的单元 Model
       * @param {Object} _token
       * @return {Object}
       */
      associatedTokenModel (_token) {
        const __root__ = this
        // TODO: 采用哪个
        // const { parameters } = _token
        const _default_ = {
          isNeedApprove: false,
          isResetApprove: false
        }
        const _store_ = {
          isNeedApprove: _default_.isNeedApprove,
          isResetApprove: _default_.isResetApprove
        }
        const approve = ModelValueEther.create()

        return {
          // 与 key 相同
          address: ModelValueAddress.create().setValue(_token.address),
          ...customAssociatedTokenModel(_token),

          // 授权量
          allowance: ModelValueEther.create({
            async trigger () {
              const { isInfiniteAllowance, infiniteMinAmount, amount } = __root__
              const { ether } = this
              const bnAllowanceEther = BN(ether)

              // sync
              const isNeedApprove = _store_.isNeedApprove = isInfiniteAllowance
                // 小于无限授权量最小阈值
                ? bnAllowanceEther.lt(infiniteMinAmount.ether)
                // 授权量不足当前量
                : bnAllowanceEther.lt(amount.ether)

              // 需要授权，且当前授权量大于0
              if (isNeedApprove && bnAllowanceEther.gt(0)) {
                // 清零授权，防止攻击
                approve.ether = 0
                _store_.isResetApprove = true
              }
            }
          }),

          // 在当前父 token 中的余额
          // TODO: 采用哪个
          balance: ModelValueEther.create(),

          /**
           * 需要授权
           * @type {boolean}
           */
          get isNeedApprove () {
            return _store_.isNeedApprove
          },

          /**
           * 重置授权
           * @type {Function}
           */
          resetApprove () {
            
          },

          /**
           * 重置授权
           * - 防攻击
           * @type {boolean}
           */
          get isResetApprove () {
            return _store_.isResetApprove
          },

          // 申请授权量
          approve,

          state: ModelState.create(),

          /**
           * 重置
           */
          // TODO: 待考虑，可能销毁再创建更完整
          reset () {
            const { isNeedApprove, resetApprove } = _default_
            const { state } = this

            this.isNeedApprove = isNeedApprove
            this.resetApprove = resetApprove

            state.reset()
          }
        }
      },
      /**
       * 获取 associatedTokens 数据集中的值
       * - 不存在则使用 associatedTokenModel 创建
       * @param {Object} _token
       * @return {!Object}
       */
      getAssociatedToken (_token) {
        const { associatedTokens } = this
        // TODO: 如果 _token 不存在，而 create() 还依赖其结构，需要默认化
        const { address } = _token || { address: '__UNDEFINED_ADDRESS__' }

        return associatedTokens[address]
          // 创建
          || (associatedTokens[address] = this.associatedTokenModel(_token))
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
       * 获取授权量
       * - 自动关联钱包
       * - 自动关联 associatedTokens
       * @param {string} toAddress 目标地址
       * @return {Promise}
       */
      async getAllowance (toAddress) {
        const { contract } = this
        let result = '0'

        // 必须有授权到的目标地址、钱包数据可用
        if (!(toAddress && storeWallet.isValidated)) return result

        const associatedToken = this.getAssociatedToken({ address: toAddress })

        // TODO: 考虑如何 multi
        // sync
        associatedToken.allowance.ether = result = await contract.methods[allowanceMethodName](storeWallet.address, toAddress).call()

        return result
      },

      /**
       * 是否需要授权
       * - 自动关联钱包
       * - true 需要授权时
       * @param {string} toAddress
       */
      async isNeedApprove (toAddress) {
        // TODO: 待优化
        const { contract, amount, isValidAmount, isInfiniteAllowance, infiniteMinAmount, associatedTokens } = this
        const bnAmountEther = BN(amount.ether)
        let result = false

        // 必须有授权到的目标地址、输入量有效、钱包数据可用
        if (!(toAddress && isValidAmount && storeWallet.isValidated)) return result


        // 流程中的主动更新
        await this.getAllowance(toAddress)

        // XXX: 由于内部处理，这里不应该返回

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
            associatedTokens[toContractAddress].isNeedApprove = true
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
            associatedTokens[toContractAddress].isNeedApprove = true
  
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

        associatedTokens[toContractAddress].state.beforeUpdate()

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
                associatedTokens[spender].isNeedApprove = false
                // TODO: 等授权完
                associatedTokens[spender].state.afterUpdate()
              }
            })
            .on('error', err => {
              error.handler(err)
              associatedTokens[spender].state.afterUpdate()

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
                associatedTokens[toContractAddress].state.afterUpdate()
                state.afterUpdate()
              })
          })
      },

      /**
       * Wallet
       */
      walletBalanceOf: ModelValueWallet.create({
        ...parameters,
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
