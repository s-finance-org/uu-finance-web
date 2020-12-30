<template>
<p class="fs-1">.fs-1 text</p><h1>text 24</h1>
<p class="fs-2">.fs-2 text</p><h2>text 24</h2>
<p class="fs-3">.fs-3 text</p><h3>text</h3>
<p class="fs-4">.fs-4 text</p><h4>text 16</h4>
<p class="fs-5">.fs-5 text</p><h5>text 13.28</h5>
<p class="fs-6">.fs-6 text</p><h6>text 12</h6>

</template>
<script>
import {
  Modal
} from 'ant-design-vue';

import store from '../store'

// import moment from 'moment';
// import 'moment/dist/locale/zh-cn';

// moment.locale('en');

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'filter1',
        value: 'filter1',
      },
    ],
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
];

export default {
  data() {
    return {
      columns,
      visible: false,
    };
  },
  methods: {
  },
  computed: {
  }
};
</script>
<style scoped>
.locale-components {
  border-top: 1px solid #d9d9d9;
  padding-top: 16px;
}

.example {
  margin: 16px 0;
}

.example > * {
  margin-right: 8px;
}

.change-locale {
  margin-bottom: 16px;
}
</style>
