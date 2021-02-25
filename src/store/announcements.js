import { ModelState } from '../models'

import { request, forEach } from '../utils'

/**
 * @type {!Object}
 */
const I18N_CONVERT_TAGS = {
  'en': 'en-US',
  'zh-cn': 'zh-CN'
}

export default {
  async update () {
    this.state.beforeUpdate()

    const res = await request.settings({ expire: 600 }).get('https://api.s.finance/f/a/uu')

    res.data.forEach((item, idx) => {
      const result = {}

      forEach(item.content, (content, key) => {
        if (I18N_CONVERT_TAGS[key]) {
          result[I18N_CONVERT_TAGS[key]] = {
            id: item.id,
            title: content.title,
            content: content.content,
            createAt: item.create_at
          }
        }
      })

      this.notices.push(result)

      // First item
      !idx && (this.statement = result)
    })

    this.state.afterUpdate()
  },
  notices: [],
  // TODO:
  statement: {},
  state: ModelState.create()
}