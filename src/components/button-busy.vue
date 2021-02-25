<template>
  <busy :busying=busying>
    <a-button
      :disabled=disabled
      :type=type
      :block=block
      :size=size
      >
      <slot></slot>
    </a-button>
  </busy>
</template>

<script>
import { Button } from 'ant-design-vue'
import { parseAntComponent } from '../utils/helpers'
import Busy from './busy'

export default {
  name: 'button-busy',
  props: {
    busying: Boolean,
    disabled: Boolean,
    type: String,
    size: String,
    block: Boolean
  },
  components: {
    ...parseAntComponent([Button]),
    Busy
  }
};
</script>