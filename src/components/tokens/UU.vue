<template>
  <span class="icon-token-UU">
    <span class="path1"></span>
    <span class="path2"></span>
  </span>
</template>

<script>
export default {
  name: 'token-UU'
}
</script>

<style lang="less" scoped>
.icon-token-UU .path1:before {
  content: "\e90e";
  color: #50b3b3;
}
.icon-token-UU .path2:before {
  content: "\e90f";
  color: #fff;
  margin-left: -1em;
}
</style>