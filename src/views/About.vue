<template>
<p class="fs-1">.fs-1 text</p><h1>text 24</h1>
<p class="fs-2">.fs-2 text</p><h2>text 24</h2>
<p class="fs-3">.fs-3 text</p><h3>text</h3>
<p class="fs-4">.fs-4 text</p><h4>text 16</h4>
<p class="fs-5">.fs-5 text</p><h5>text 13.28</h5>
<p class="fs-6">.fs-6 text</p><h6>text 12</h6>

  {{ $t("hello") }}
  <a-radio-group v-model:value="$i18n.locale">
    <a-radio-button
      v-for="(lang, name) of i18n.supports"
      :key="`Lang_${name}`"
      :value="name">
      {{ lang.name }}
    </a-radio-button>
  </a-radio-group>


    <div class="locale-components">
      <div class="example">
        <a-pagination :default-current="1" :total="50" show-size-changer />
      </div>
      <div class="example">
        <a-select show-search style="width: 200px">
          <a-select-option value="jack">
            jack
          </a-select-option>
          <a-select-option value="lucy">
            lucy
          </a-select-option>
        </a-select>
        <a-date-picker />
        <a-time-picker />
        <a-range-picker style="width: 200px" />
      </div>
      <div class="example">
        <a-button type="primary" @click="visible = true">Show Modal</a-button>
        <a-button @click="info">
          Show info
        </a-button>
        <a-button @click="confirm">
          Show confirm
        </a-button>
        <a-popconfirm title="Question?">
          <a href="#">Click to confirm</a>
        </a-popconfirm>
      </div>
      <div class="example">
        <a-transfer :data-source="[]" show-search :target-keys="[]" :render="item => item.title" />
      </div>
      <div style="width: 319px; border: 1px solid #d9d9d9; border-radius: 4px">
        <a-calendar :fullscreen="false" :value="moment()" />
      </div>
      <div class="example">
        <a-table :data-source="[]" :columns="columns" />
      </div>
      <a-modal v-model:visible="visible" title="Locale Modal">
        <p>Locale Modal</p>
      </a-modal>
    </div>
</template>
<script>
import {
  Modal
} from 'ant-design-vue';

import store from '../store'

import moment from 'moment';
import 'moment/dist/locale/zh-cn';

moment.locale('en');

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
      
      moment,

      selectedKeys: ['2'],
      current: ['mail'],
    };
  },
  watch: {
    locale(val) {
      moment.locale(val.locale);
    },
  },
  methods: {
    info() {
      Modal.info({
        title: 'some info',
        content: 'some info',
      });
    },
    confirm() {
      Modal.confirm({
        title: 'some info',
        content: 'some info',
      });
    },
  },
  computed: {
    i18n () {
      const { i18n } = store
      // TODO:
      i18n.locale = this.$i18n.locale

      return i18n
    }
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
