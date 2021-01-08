<template>
  <span class="icon-token-iUSD">
    <span class="path1"></span>
    <span class="path2"></span>
    <span class="path3"></span>
    <span class="path4"></span>
  </span>
</template>

<script>
export default {
  name: 'token-iUSD'
}
</script>

<style lang="less" scoped>
.icon-token-iUSD .path1:before {
  content: "\e900";
  color: #fff;
}
.icon-token-iUSD .path2:before {
  content: "\e901";
  color: #fff;
  opacity: 0.5;
  margin-left: -1em;
}
.icon-token-iUSD .path3:before {
  content: "\e902";
  color: #ff2c7e;
  margin-left: -1em;
}
.icon-token-iUSD .path4:before {
  content: "\e903";
  color: #fff;
  margin-left: -1em;
}
</style>