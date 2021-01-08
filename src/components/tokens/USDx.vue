<template>
  <span class="icon-token-USDx">
    <span class="path1"></span>
    <span class="path2"></span>
  </span>
</template>

<script>
export default {
  name: 'token-USDx'
}
</script>

<style lang="less" scoped>
.icon-token-USDx .path1:before {
  content: "\e90c";
  color: #000;
}
.icon-token-USDx .path2:before {
  content: "\e90d";
  color: #fff;
  margin-left: -1em;
}
</style>