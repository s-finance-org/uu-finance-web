<template>
  <a-spin :indicator="indicator" :spinning="busying" :wrapperClassName="className" >
    <slot></slot>
  </a-spin>
</template>

<script>
import { LoadingOutlined } from '@ant-design/icons-vue';

export default {
  name: 'busy',
  props: {
    busying: Boolean,
    className: [Object, Array]
  },
  components: {
    LoadingOutlined,
  },
  data() {
    return {
      indicator: <LoadingOutlined style="font-size: 18px" spin />,
    };
  },
};
</script>