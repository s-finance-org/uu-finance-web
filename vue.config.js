const IS_PROD = ['production', 'test'].includes(process.env.NODE_ENV)

module.exports = {
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: IS_PROD,
    // 开启 CSS source maps?
    sourceMap: !IS_PROD,
    // css预设器配置项
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
   },
   // 启用 CSS modules for all css / pre-processor files.
   requireModuleExtension: true
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  // devServer: {
  //  open: process.platform === 'darwin',
  //  host: '0.0.0.0',
  //  port: 8080,
  //  https: false,
  //  hotOnly: false,
  //  proxy: null, // 设置代理
  //  before: app => {}
  // },
  // 第三方插件配置
  pluginOptions: {
    svgLoader: {
      svgo: {
        plugins: []
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('vue-loader-v16')
      .loader('vue-loader-v16') // or `vue-loader-v16` if you are using a preview support of Vue 3 in Vue CLI
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');

    config
      .plugin('html')
      .tap(args => {
        args[0].title= process.env.VUE_APP_DEFAULT_TITLE
        args[0].keywords = process.env.VUE_APP_KEYWORDS
        args[0].description = process.env.VUE_APP_DESCRIPTION
        
        return args
      })
  }
}
