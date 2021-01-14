import { now } from '../../utils'

/*
              init   beforeUpdate   afterUpdate
updated       false  false          true
busy          false  true           false
initialized   false  true           true
 */

export default {
  /**
   * @param {Object} opts
   * @param {number=} expireSec 有效时长（秒）
   * @return {!Object}
   */
  create ({
    expireSec = 86400
  } = {}) {
    const __default__ = {
      initialized: false,
      updated: false,
      busy: false,
      updatedAt: 0,
      handledCounter: 0
    }
    const __store__ = {
      updatedAt: __default__.updatedAt,
    }

    return {
      /**
       * 是否已初始化
       * - 变为 true 后不会再改变
       * - 由 updated 维护
       * @type {boolean}
       */
      initialized: __default__.initialized,

      /**
       * 是否已更新完毕
       * @type {boolean}
       */
      updated: __default__.updated,

      /**
       * 是否忙绿中
       * - 由 beforeUpdate()、afterUpdate()、reset() 维护
       * @type {boolean}
       */
      busy: __default__.busy,

      /**
       * 更新前的方法
       */
      beforeUpdate () {
        this.updated = false
        this.busy = true
      },

      /**
       * 更新后的方法
       */
      afterUpdate () {
        this.updated = true
        this.busy = false
        this.handledCounter += 1
        this.updatedAt = now()

        if (!this.initialized) {
          this.initialized = true
        }
      },

      /**
       * 数据更新时间戳
       * - 毫秒
       * - 由 updated 更新
       * @type {number}
       */
      updatedAt: __default__.updatedAt,
      /**
       * 数据有效的时间戳(毫秒)
       * - 无 set (使用才计算)
       * @type {number}
       */
      get expireAt () {
        const { updatedAt } = this

        return updatedAt + expireSec * 1000
      },
      /**
       * 是否到期
       * - 无 set(使用才计算)
       * @type {boolean}
       */
      get isExpired () {
        const { expireAt } = this

        return now() > expireAt
      },

      /**
       * 已处理过的次数累加器
       * - 专门处理在某一个周期内，需要多个数据都处理完成后，再做最终执行的依据
       * - 避免某些需要多个数据相互配合，但先处理过的数据会优先执行，而浪费算力
       * @type {number}
       */
      handledCounter: __default__.handledCounter,

      /**
       * 重置为未初始
       */
      reset () {
        const { initialized, updated, busy, updatedAt, handledCounter } = __default__

        this.initialized = initialized
        this.updated = updated
        this.busy = busy
        this.handledCounter = handledCounter
        this.updatedAt = updatedAt
      }
    }
  }
}
