
- A 使用 uniswapV2Router2 + multicall 的批量价格查询

## 2020022618

- F 修复非 Chrome 下 nativeNavigatorLanguage 值不统一造成的初始 i18n 问题
- F修复在一定环境下 request 会造成跨域的问题

## 2020022515

- A 顶部公告
- C 调整时间格式

## 2020022511

- A 支持 url param locale= 变更 i18n
- A 新鲜事由 API 更新
- C 优化组件按需加载
- C 调整 ModelValue 中 trigger 的处理流程，使其不依赖异步
- C 修复图标拼接、样式

## 2020022503

- F Safari 下无法显示的问题
- A 审计报告、新鲜事
- F 修复铸造 UU 时快速输入，会造成显示的收到uu数目不一致现象
- F 修复在 imToken DApp 内不可选择 imToken、无法自动关联的问题
- C 调整 ModelValueEther
- C 调整 ModelToken 在创建时就触发数据更新，而非 store.tokens 时
- C 调整移动端适配

## 2020020410

- C 针对 MetaMask 的 window.web3 淘汰做处理
- F 修复 components、globalMessage 警告，添加 MetaMask 中文提示
- C 优化 ModelToken 的 extend 方案，减少自定义 token 的代码复杂度
- A 添加 multi series 方式，解决不同数据集异步时造成的多个请求
- C 调整 UU 的流通量值、领取奖励中的siade tip 文案
