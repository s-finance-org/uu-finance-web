<template>
  <span class="icon-token" :style=style></span>
</template>

<script>
export default {
  name: 'icon-token',
  props: {
    code: String,
    size: {
      type: [String, Number],
      default: '32'
    }
  },
  computed: {
    style () {
      const { size, code } = this

      return {
        width: size + 'px',
        height: size + 'px',
        backgroundImage: `url(/img/tokens/${ code }.png)`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.icon-token {
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: cover;
}
</style>