<template>
  <span class="icon-token-USD5">
    <span class="path1"></span>
    <span class="path2"></span>
  </span>
</template>

<script>
export default {
  name: 'token-USD5'
}
</script>

<style lang="less" scoped>
.icon-token-USD5 .path1:before {
  content: "\e904";
  color: #50b3b3;
}
.icon-token-USD5 .path2:before {
  content: "\e905";
  color: #fff;
  margin-left: -1em;
}
</style>