<template>
  <span class="icon-token-DAI">
    <span class="path1"></span>
    <span class="path2"></span>
  </span>
</template>

<script>
export default {
  name: 'token-DAI'
}
</script>

<style lang="less" scoped>
.icon-token-DAI .path1:before {
  content: "\e910";
  color: #f5ac37;
}
.icon-token-DAI .path2:before {
  content: "\e911";
  color: #fefefd;
  margin-left: -1em;
}
</style>