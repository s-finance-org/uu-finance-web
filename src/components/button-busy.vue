<template>
  <busy
    :busying=busying
    :className=className
    >
    <a-button
      :disabled=disabled
      :type=type
      block
      :size=size
      @click=onClick
      >
      <slot></slot>
    </a-button>
  </busy>
</template>

<script>
import Busy from './busy'

export default {
  name: 'button-busy',
  props: {
    busying: Boolean,
    className: [Object, Array],
    disabled: Boolean,
    type: String,
    size: String
  },
  components: {
    Busy
  },
  data() {
    return {
    };
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
};
</script>