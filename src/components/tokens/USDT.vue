<template>
  <span class="icon-token-USDT">
    <span class="path1"></span>
    <span class="path2"></span>
  </span>
</template>

<script>
export default {
  name: 'token-USDT'
}
</script>

<style lang="less" scoped>
.icon-token-USDT .path1:before {
  content: "\e90a";
  color: #26a17b;
}
.icon-token-USDT .path2:before {
  content: "\e90b";
  color: #fff;
  margin-left: -1em;
}
</style>