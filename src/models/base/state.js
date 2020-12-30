export default {
  create () {
    const __store__ = {
      updated: false,
    }

    return {
      /**
       * 是否已初始化
       * - 变为 true 后不会再改变
       * - 由 updated 维护
       * @type {boolean}
       */
      initialized: false,
      /**
       * 是否已更新完毕
       * - 用于判断是否已完成数据更新
       * @type {boolean}
       */
      get updated () {
        return __store__.updated
      },
      set updated (val) {
        const result = __store__.updated = val

        this.busy = !result

        if (result) {
          this.initialized = true
          // TODO:
          // this.updatedAt = now()
        }
      },

      /**
       * 更新前的方法
       */
      beforeUpdate () {
        this.updated = false
      },

      /**
       * 更新后的方法
       */
      afterUpdate () {
        this.updated = true
      },

      /**
       * 数据更新时间戳
       * - 由 updated 更新
       * @type {number}
       */
      updatedAt: 0,

      /**
       * 是否忙绿中
       * - true 刚初始化、还未获取初始数据完成、后续数据中断时
       * - 由 updated、beforeUpdate() 维护
       * @type {boolean}
       */
      busy: true,

      /**
       * 已处理过的次数累加器
       * - 专门处理在某一个周期内，需要多个数据都处理完成后，再做最终执行的依据
       * - 避免某些需要多个数据相互配合，但先处理过的数据会优先执行，而浪费算力
       * @type {number}
       */
      handledCounter: 0
    }
  }
}