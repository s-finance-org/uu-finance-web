import BN from 'bignumber.js'
import Web3 from 'web3'

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

import { now, floor, isPlainObject } from '../utils'
import ModelValueAddress from './value/address'
import { listenEvent } from '../store/helpers/methods'

export default {
  /**
   * @param {Object} opts
   * @param {string} opts.code 内部 token code
   * @param {string} opts.address
   * @param {Array=} opts.abi
   * @param {string=} opts.icon 缺省与 code 相同
   * @param {boolean=} opts.isLpt 是否为 lp token // TODO: 暂无作用
   * @param {string=} opts.poolName TODO: 限 lpt
   * @param {Function=} opts.customSeries 自定义列队 multi call
   * @param {Object=} opts.customAssociatedTokenModel 追加 associatedToken 数据集的单元 Modal
   * 
   * 
   * @param {string=} opts.acquisitionUrl 获取该币种的 url
   * @param {number=} opts.viewDecimal 显示内容的显示精度
   * @param {Function=} opts.viewMethod 显示内容的舍入方法
   * @param {Object} opts.stateParams 状态参数
   * 
   * @param {boolean=} opts.isInfiniteAllowance
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
    icon = '',
    isLpt = false,
    poolName = '',
    customSeries = () => [],
    customAssociatedTokenModel = () => ({}),
    acquisitionUrl = '',
    viewDecimal = 4,
    viewMethod = floor,

    stateParams = {},

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
      decimals: ModelValueUint8.create().setValue(18),
      viewDecimal,
      viewMethod
    }

    // TODO: 要排除 0x000 和空字符串
    // TODO: 要让 address Model
    address = Web3.utils.toChecksumAddress(address)

    // TODO: 不正确则不创建
    if (address === '0x0000000000000000000000000000000000000000') {
      // TODO: 要保留结构，不能 null
      return null
    }

    return {
      parameters,
      // TODO: 待考虑取消
      ...parameters,

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
      icon: icon || code,
      /**
       * 当前 Model 标识
       * @type {boolean}
       */
      isToken: true,

      /**
       * 获取该币种的 url
       * @type {string}
       */
      acquisitionUrl,

      /** @type {Object} */
      get contract () {
        const { abi, address } = this

        // TODO: 待优化
        // storeWallet.web3 在钱包失效、链接时已经变更了目标值
console.log('-----------', storeWallet.isValidated, __store__.isContractWallet, __store__.isCcontractBase)
        if (storeWallet.isValidated) {
          if (!__store__.isContractWallet) {
            console.log('------- wallet web3')
            __store__.contract = new storeWallet.web3.eth.Contract(abi, address)
            __store__.isCcontractBase = false
            __store__.isContractWallet = true
          }
        } else {
          if (!__store__.isCcontractBase) {
            console.log('------- default web3')
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
      poolName,

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
       * - input 自带限制
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
        // TODO: 待优化
        const parameters = {
          decimals: __root__.decimals,
          viewDecimal: __root__.viewDecimal,
          viewMethod: __root__.decimals
        }

        let _tokenParameters = {}
        // TODO: 待优化
        if (_token) {
          _tokenParameters = {
            decimals: _token.decimals,
            viewDecimal: _token.viewDecimal,
            viewMethod: _token.viewMethod
          }
        }

        return {
          /**
           * 与 key 相同
           * @type {Object}
           */
          address: ModelValueAddress.create().setValue(_token.address),
          ...customAssociatedTokenModel(_token, __root__),

          /**
           * 已授权的量
           * - __root__.getAllowance -> associatedToken.allowance -> associatedToken.isNeedApprove -> associatedToken.isResetApprove
           * @type {Object}
           */
          allowance: ModelValueEther.create({
            ...parameters,
            // 更新授权量的间隔
            stateParams: { expireSec: 10 }
          }),
          /**
           * 是否需要授权
           * - true 需要授权时
           * @type {boolean}
           */
          get isNeedApprove () {
            const { isInfiniteAllowance, infiniteMinAmount, amount } = __root__
            const { allowance } = this
            const bnAllowanceEther = BN(allowance.ether)
            let result = false
            // allowance 是否已初始化
            if (!allowance.state.initialized) return result

            // 与已授权量比较
            result = bnAllowanceEther.lt(
              // 是否无限授权
              isInfiniteAllowance
                // 小于无限授权量最小阈值
                ? infiniteMinAmount.ether
                // 授权量不足当前量
                : amount.ether
            )

            return result
          },
          /**
           * 重置授权
           * - 调用 isNeedApprove
           * - 同步需要授权的量
           * @type {boolean}
           */
          get isResetApprove () {
            const { isInfiniteAllowance, maxAmount, amount } = __root__
            const { isNeedApprove, allowance, approve } = this
            const bnAllowanceEther = BN(allowance.ether)
            // 需要授权，且当前授权量大于0
            const result = isNeedApprove && bnAllowanceEther.gt(0)

            // 同步 approve 需要授权的量
            if (result) {
              // 要修改成重置 0 完成后再自动无限授权，针对授权攻击
              approve.ether = '0'
            } else {
              // 是否无限授权
              approve.ether = isInfiniteAllowance
                ? maxAmount.ether
                : amount.ether
            }

            return result
          },
          /**
           * 申请授权量
           */
          approve: ModelValueEther.create(parameters),

          /**
           * 在 __root__ 中的余额
           * - _token
           * @type {Object}
           */
          balance: ModelValueEther.create(_tokenParameters),



          // TODO: 以下是针对 lpt 的
          // 挖矿奖励数量
          miningPendingRewards: ModelValueEther.create(_tokenParameters),
          // 待结算奖励数
          settleableReward: ModelValueEther.create(_tokenParameters),

          state: ModelState.create(),

          /**
           * 重置
           */
          // TODO: 待考虑，可能销毁再创建更完整
          reset () {
            const { state } = this
            state.reset()
          }
        }
      },
      /**
       * 获取 associatedTokens 数据集中的值
       * - 不存在则使用 associatedTokenModel 创建
       * @param {Object|string} _token
       * @return {!Object}
       */
      getAssociatedToken (_token) {
        const { associatedTokens } = this


        if (!_token) {
          // TODO: 如果 _token 不存在，而 create() 还依赖其结构，需要默认化
          _token = { address: '__UNDEFINED_ADDRESS__' }
        }


        const { address } = _token
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
       * 是否无限授权数
       * - 当前 token
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

        const { allowance } = this.getAssociatedToken({ address: toAddress })

        // allowance 没有获取过、数据到期
        if (!allowance.state.initialized
          || allowance.state.isExpired) {
          allowance.state.beforeUpdate()
          // 更新
          // TODO: 考虑如何 multi
          // TODO: 可以考虑把该地址得信息都获得，并存起来
          allowance.ether = await contract.methods[allowanceMethodName](storeWallet.address.handled, toAddress).call()
        }

        result = allowance.ether

        return result
      },

      /**
       * 触发授权
       * - 自带授权量更新、是否需要授权的校验
       * @param {string} toContractAddress
       * @param {boolean=} forcedReset 无视条件强制重置
       * @return {Promise} { successful: false }
       */
      async approve (toContractAddress, forcedReset = false) {
        const { contract, error, state } = this

        // 必须钱包数据可用
        if (!storeWallet.isValidated) return false
        // 校验作用
        await this.getAllowance(toContractAddress)
        // getAllowance 处理完数据后
        const associatedToken = this.getAssociatedToken({ address: toContractAddress })

        const isNeedApprove = forcedReset || associatedToken.isNeedApprove
        // 是否需要授权
        if (!isNeedApprove) return false
        // TODO: 这里要能拿到 toContractAddress 的 code
        const { update, dismiss } = notify.notification({
          message: forcedReset || associatedToken.isResetApprove
            ? i18n.$i18n.global.t('global.msg.resettingApprove')
            : i18n.$i18n.global.t('global.msg.approving')
        })

        const approveEther = forcedReset
          ? '0'
          : associatedToken.approve.ether

        associatedToken.state.beforeUpdate()
        state.beforeUpdate()

        // TODO: 考虑避免一个token 同时多次提交
        return new Promise((resolve, reject) => {
          const walletAddress = storeWallet.address.handled

          try {
            contract.methods[approveMethodName](toContractAddress, approveEther)
              .send({
                from: walletAddress,
                // TODO:
                // gasPrice: ,
                // gas: ,
              })
              .once('transactionHash', transactionHash => {
                // TODO: 自定义该提示（支持 i18n）
                notify.handler(transactionHash)

                listenEvent({
                  name: 'Approval',
                  contract,
                  transactionHash
                }).then(data => {
                  /* data
                    {
                      returnValues: {
                        owner: '0x'
                        spender: '0x'
                        value: '0'
                      }
                    }
                  */
                  const { returnValues } = data
                  const filter = returnValues.owner === walletAddress
                    && returnValues.spender === toContractAddress
                    && returnValues.value === approveEther

                  if (!filter) return false

                  dismiss() // 销毁
                  associatedToken.allowance.ether = approveEther
                  associatedToken.state.afterUpdate()
                }).catch(err => {
                  // TODO: 增加提示内容的变更
                  dismiss() // 销毁
                  associatedToken.allowance.ether = approveEther
                  associatedToken.state.afterUpdate()
                })
                .finally(() => {
                })

              })
              .on('error', error.handler)
              .catch(err => {
                notify.updateError({
                  update,
                  code: err.code,
                  message: err.message
                })

                associatedToken.state.afterUpdate()
                state.afterUpdate()

                reject({
                  successful: false
                })
              })
          } catch (err) {
            console.error(err)

            notify.updateError({
              update,
              code: err.code,
              message: err.message
            })

            state.afterUpdate()
          }
        })
      },

      /**
       * Wallet
       */
      walletBalanceOf: ModelValueWallet.create({
        ...parameters,
        async trigger () {
          const { address } = this
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

      state: ModelState.create(stateParams),
      error: ModelValueError.create(),
    }
  }
}
