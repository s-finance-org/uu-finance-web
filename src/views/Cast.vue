<template>
  <a-layout-content class="container-lg px-4">
    <div class="px-lg-5 mx-lg-3">
      <div class="my-lg-4 pb-5">
        <h2 class="fs-2 mb-1">存入稳定币资产，获得 UU</h2>
        <span class="fs-6">你可以选择存入稳定币池流动性凭证、生息代币或直接存入稳定币获得 UU</span>
      </div>
    </div>

    <a-tabs size="large" animated="false" type="card">
      <a-tab-pane key="1" tab="存入获得 UU">
        <div>
          <!-- <small>选择存入资产类型</small>
          <a-radio-group defaultValue="1">
            <a-radio-button value="1" shape="round">
              流动性凭证
            </a-radio-button>
            <a-radio-button value="2">
              生息代币
            </a-radio-button>
            <a-radio-button value="3">
              稳定币
            </a-radio-button>
          </a-radio-group>

          <a-button-group>
            <a-button>Default</a-button>
            <a-button>Default</a-button>
          </a-button-group> -->

  <div>

    <a-input-group compact>
      <div style="width: 50%">1231231</div>
      <a-date-picker v-model:value="value8" style="width: 50%" />
    </a-input-group>

  </div>

  <div>
    <a-input-group compact>
      <a-select v-model:value="value3">
        <a-select-option value="Zhejiang">
          Zhejiang
        </a-select-option>
        <a-select-option value="Jiangsu">
          Jiangsu
        </a-select-option>
      </a-select>
      <a-input style="width: 50%" v-model:value="value4" />
    </a-input-group>
  </div>

          <div class="line-frame-thin d-flex px-4 pt-3 pb-2 flex-column col-md-4">
            <span class="d-flex flex-wrap text-nowrap pb-0 pb-md-3">
              预计矿工费
              <h4 class="col text-end">21.79 美元</h4>
            </span>
            <span class="d-flex flex-wrap text-nowrap pb-0 pb-md-3">
              最大滑点
              <h4 class="col text-end">1 %</h4>
            </span>
            <span class="d-flex flex-wrap text-nowrap pb-0 pb-md-3">
              额外奖励/额外成本
              <h4 class="col text-end">1.095 %</h4>
            </span>
            <span class="d-flex flex-wrap text-nowrap pb-0 pb-md-3">
              流动性池
              <h4 class="col text-end">UU</h4>
            </span>
            <span class="d-flex flex-wrap text-nowrap pb-0 pb-md-3 text-primary-color">
              你将至少收到
              <h4 class="col text-end text-primary-color">956.93 UU</h4>
            </span>
            <iIntersect class="d-none d-md-block" />
          </div>


          <a-radio-group v-model:value="value1" @change="onChange">
            <a-radio-button value="a">
              0.5%
            </a-radio-button>
            <a-radio-button value="b">
              1.0%
            </a-radio-button>
            <a-radio-button value="c">
              2.0%
            </a-radio-button>
            <a-radio-button value="d">
              自定义
            </a-radio-button>
          </a-radio-group>
          <a-input suffix="%" disabled="true" placeholder="输入数值"/>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="取出销毁 UU">
        Content of tab 2
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">
        Content of tab 3
      </a-tab-pane>
    </a-tabs>

    <a-descriptions title="资产分布">
      <a-descriptions-item label="USD5">
        66,887,766.54 (20%)
      </a-descriptions-item>
      <a-descriptions-item label="iUSD">
        66,887,766.54 (20%)
      </a-descriptions-item>
      <a-descriptions-item label="susdv2">
        66,887,766.54 (20%)
      </a-descriptions-item>
    </a-descriptions>
  </a-layout-content>
</template>

<script>
import { iIntersect } from '@/components/icons'

export default {
  components: {
    iIntersect
  },
  data() {
    return {
      value1: 'a',
    };
  },
  methods: {
    onChange(e) {
      console.log(`checked = ${e.target.value}`);
    },
  },
}
</script>

<style lang="less" scoped>

</style>