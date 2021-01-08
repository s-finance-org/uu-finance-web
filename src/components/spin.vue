<template>
  <div>
    <a-spin :indicator="indicator" :spinning="spinning" >
      <slot></slot>
    </a-spin>
  </div>
</template>

<script>
import { LoadingOutlined } from '@ant-design/icons-vue';

export default {
  props: ['spinning'],
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