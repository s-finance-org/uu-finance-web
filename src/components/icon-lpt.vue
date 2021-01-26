<template>
  <span class="icon-lpt" :style=style>
      <icon-token
        v-for="token in tokens"
        :key="'icon-lpt-' + token.code"
        :code=token.code
        :size=token.size />
  </span>
</template>

<script>
import IconToken from './icon-token'

export default {
  name: 'icon-lpt',
  props: {
    code: String,
    size: {
      type: String,
      default: '32'
    }
  },
  components: {
    IconToken
  },
  computed: {
    style () {
      const { size } = this

      return {
        width: size + 'px',
        height: size + 'px',
      }
    },
    tokens () {
      const { size, code } = this
      // TODO: 规划好 2~6的规则，以及 52、16 时的内间距
      const tokenSize = +size / 2 - 2

      return code.split('_').map(tokenCode => ({ size: tokenSize, code: tokenCode }))
    }
  }
}
</script>

<style lang="less" scoped>
.icon-lpt {
  display: flex;
  justify-content: space-between;
  padding: 1px 0 0 1px;
  background-color: #E5F3F3;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 4px;
  > .icon-token {
    margin: 0 1px 1px 0;
    &:nth-child(1):first-child {
      align-self: flex-start;
    }
    &:nth-child(2):last-child {
      align-self: flex-end;
    }
  }
}
</style>