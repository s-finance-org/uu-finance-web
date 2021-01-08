<template>
  <span class="icon-token-USDC">
    <span class="path1"></span>
    <span class="path2"></span>
    <span class="path3"></span>
    <span class="path4"></span>
  </span>
</template>

<script>
export default {
  name: 'token-USDC'
}
</script>

<style lang="less" scoped>
.icon-token-USDC .path1:before {
  content: "\e906";
  color: #2775ca;
}
.icon-token-USDC .path2:before {
  content: "\e907";
  color: #fff;
  margin-left: -1em;
}
.icon-token-USDC .path3:before {
  content: "\e908";
  color: #fff;
  margin-left: -1em;
}
.icon-token-USDC .path4:before {
  content: "\e909";
  color: #fff;
  margin-left: -1em;
}
</style>