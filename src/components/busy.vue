<template>
  <span>
    <a-spin :indicator="indicator" :spinning="busying">
      <slot></slot>
    </a-spin>
  </span>
</template>

<script>
import { Spin } from 'ant-design-vue'
import { parseAntComponent } from '../utils/helpers'
import { LoadingOutlined } from '@ant-design/icons-vue';

export default {
  name: 'busy',
  props: {
    busying: Boolean,
  },
  components: {
    ...parseAntComponent([Spin]),
    LoadingOutlined,
  },
  data() {
    return {
      indicator: <LoadingOutlined style="font-size: 18px" spin />,
    };
  },
};
</script>