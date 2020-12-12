import ant_zhCN from 'ant-design-vue/es/locale/zh_CN';

import base from '../helpers/base'

export default {
  ...base.create({
    id: 'zh-CN',
    name: '中文（简体）'
  }),
  ant: ant_zhCN,
  hello: '中文',
  base: {
    footer: {
      slogan: 'UU，有收益的稳定币'
    }
  },
  global: {

  },
}