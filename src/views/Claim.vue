<template>
  <a-layout-content class="container-lg px-4">
    <div class="px-lg-5 mx-lg-3">
      <div class="mt-lg-4 mb-4 mb-lg-5 pb-4">
        <h2 class="fs-2 mb-1">{{ $t('global.claim.title') }}</h2>
        <span class="fs-6 pe-5 d-block">{{ $t('global.claim.subtitle') }}</span>
      </div>

      <a-tabs animated type="card" defaultActiveKey=structure.claimActionsDefaultKey v-model:activeKey=tabClaimAction>
        <a-tab-pane key="own" :tab="$t('global.claim.own.tab')" class="d-flex flex-wrap">
          <!-- TODO: 重复的 -->
          <div class="line-frame-thin d-flex px-3 py-2 p-md-4 mt-3 flex-column col-12 col-md-4 order-md-1">
            <small class="d-flex">
              <span class="me-2 d-flex"><iYellowinfo /></span>
              {{ $t('global.claim.own.sideTip') }}
            </small>
            <iIntersect class="d-none d-md-block text-align-justify" />
          </div>
          <a-list
            item-layout="vertical"
            :pagination="pagination"
            :data-source="ixd.own.list"
            class="col-12 col-md-8 pe-md-4 order-md-12"
          >
            <template #header>
              <div class="d-flex justify-content-between align-items-center">
                <span>
                  <!-- {{ $t('global.claim.own.totalApy') }}: -->
                </span>
                <button-busy
                  type="link"
                  size="small"
                  @click=ixd.own.claimAllBtn.click
                  :busying=ixd.own.claimAllBtn.disabled
                  :disabled=ixd.own.claimAllBtn.busy
                  className="col-12 col-sm-auto"
                >
                  {{ $t('global.claim.own.allClaim') }}
                </button-busy>
              </div>
            </template>
            <template #renderItem="{ item, index }">
              <a-list-item :key="'item-' + index">
                <a-list-item-meta>
                  <template #title>
                    <div class="d-flex align-items-center">
                      <icon-token :code=item.code size="52" class="me-3" />
                      <span class="fs-4">
                        {{ item.code }} {{ $t('global.base.reward') }}
                        <!-- <small class="d-block pt-1">{{ item.code }} {{ $t('global.base.apy') }}: {{ item.apy }}</small> -->
                      </span>
                    </div>
                  </template>
                </a-list-item-meta>
                <div class="d-flex justify-content-between align-items-end flex-wrap">
                  <small>
                    {{ $t('global.claim.own.pendingReward') }}
                    <span class="d-block fs-5 pt-1">
                      {{ item.pendingReward }} {{ item.code }}
                      <!-- <small class="ps-2 text-color-secondary">≈{{ item.pendingRewardConvertUSD }}</small> -->
                    </span>
                  </small>
                  <button-busy
                    type="primary"
                    size="small"
                    @click=item.receiveBtn.click
                    :busying=item.receiveBtn.disabled
                    :disabled=item.receiveBtn.busy
                    className="col-12 col-sm-auto mt-2"
                  >
                    {{ $t('global.claim.own.receiveAward') }}
                  </button-busy>
                </div>
                <div class="content px-3 pt-2 d-flex flex-wrap mt-2">
                  <small class="col-12 col-sm-6 mb-2">{{ $t('global.claim.own.paidReward') }}: {{ item.paidReward }} {{ item.code }}</small>
                  <small class="col-12 col-sm-6 mb-2">{{ $t('global.claim.own.totalReward') }}: {{ item.totalReward }} {{ item.code }}</small>
                  <!-- <small class="col-12 col-sm-6 mb-2">{{ item.exchangeRate }}</small> -->
                  <!-- <small class="col-12 col-sm-6 mb-2">{{ $t('global.base.estimatedTransactionFee') }}：x</small> -->
                </div>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>

        <!-- <a-tab-pane key="claimTo" disabled :tab="$t('global.claim.claimTo.tab')" class="d-flex flex-wrap">
          <div class="line-frame-thin d-flex px-3 py-2 p-md-4 mt-3 flex-column col-12 col-md-4 order-md-1">
            <small class="d-flex">
              <span class="me-2 d-flex"><iYellowinfo /></span>
              {{ $t('global.claim.claimTo.sideTip') }}
            </small>
            <iIntersect class="d-none d-md-block text-align-justify" />
          </div>
        </a-tab-pane> -->

        <a-tab-pane key="settle" :tab="$t('global.claim.settle.tab')" class="d-flex flex-wrap">
          <!-- TODO: 重复的 -->
          <div class="line-frame-thin d-flex px-3 py-2 p-md-4 mt-3 flex-column col-12 col-md-4 order-md-1">
            <small class="d-flex">
              <span class="me-2 d-flex"><iYellowinfo /></span>
              {{ $t('global.claim.settle.sideTip') }}
            </small>
            <iIntersect class="d-none d-md-block text-align-justify" />
          </div>

          <a-list
            item-layout="vertical"
            :pagination="pagination"
            :data-source="ixd.settle.list"
            class="col-12 col-md-8 pe-md-4 order-md-12 mt-2"
          >
            <template #renderItem="{ item, index }">
              <a-spin spin :spinning="item.busy">
                <a-list-item :key="'item-' + index">
                  <a-list-item-meta>
                    <template #title>
                      <div class="d-flex align-items-center">
                        <icon-lpt :code=item.lpt size="52" class="me-2" />
                        <span class="fs-4 pt-1">
                          {{ item.name }} {{ $t('global.base.miningPool') }}
                        </span>
                      </div>
                    </template>
                  </a-list-item-meta>
                  <div
                    v-for="(reward, idx) in item.rewards"
                    :key="`reward-${reward.code}`"
                  >
                    <div class="d-flex justify-content-between align-items-end flex-wrap pt-2">
                      <small>
                        {{ $t('global.claim.settle.pendingSettleReward') }}
                        <span class="d-block fs-5 pt-1">
                          {{ reward.pendingSettleReward }} {{ reward.code }}
                          <!-- <small class="ps-2 text-color-secondary">≈{{ reward.pendingSettleRewardConvertUSD }}</small> -->
                        </span>
                      </small>
                      <button-busy
                        type="primary"
                        size="small"
                        @click=reward.settleBtn.click(idx)
                        :busying=reward.settleBtn.disabled
                        :disabled=reward.settleBtn.busy
                        className="col-12 col-sm-auto mt-2"
                      >
                        {{ $t('global.claim.settle.participateSettle') }}
                      </button-busy>
                    </div>
                    <div class="content px-3 pt-2 d-flex flex-wrap mt-2">
                      <small class="col-12 col-sm-6 mb-2">{{ $t('global.claim.settle.settleRewardRate') }}: {{ reward.settleRewardRate }}</small>
                      <small class="col-12 col-sm-6 mb-2">{{ $t('global.claim.settle.settleReward') }}: {{ reward.settleReward }} {{ reward.code }}</small>
                      <!-- <small class="col-12 col-sm-6 mb-2">{{ reward.exchangeRate }}</small> -->
                      <!-- <small class="col-12 col-sm-6 mb-2">{{ $t('global.base.estimatedTransactionFee') }}：x</small> -->
                    </div>
                    </div>
                </a-list-item>
              </a-spin>
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-layout-content>
</template>

<script>
import BN from 'bignumber.js'
import {
  iIntersect,
  iYellowinfo
} from '@/components/icons'
import ButtonBusy from '../components/button-busy'

import IconToken from '../components/icon-token'
import IconLpt from '../components/icon-lpt'

export default {
  components: {
    iIntersect,
    iYellowinfo,
    ButtonBusy,
    IconToken,
    IconLpt
  },
  data() {
    return {
      tabClaimAction: 'own',

      pagination: {
        onChange: page => {},
        pageSize: 10,
        showSizeChanger: true,
        hideOnSinglePage: true,
        // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
      },
    }
  },
  computed: {
    structure () {
      return {
        claimActionsDefaultKey: 'own',
      }
    },
    ixd () {
      const { tokens, tokenAddresses } = this.$store
      const ownList = []
      const settleList = []

      tokens.UU.supportedRewardAddresses.forEach(_address => {
        // TODO: 优化 tokenAddresses 的数据同步
        const _token = tokenAddresses[_address.handled]

        const foo = tokens.UU.getAssociatedToken(_token)
        // TODO: 如果没有，则就是项目自带的 token 没有，需要看 claimableReward、claimedReward

        if (!(foo && _token)) return false

        ownList.push({
          code: _token.code,
          apy: '?%',
          pendingReward: foo.claimableReward.view,
          // pendingRewardLoading: foo.claimableReward.state.loading,
          pendingRewardConvertUSD: '$ ?',
          paidReward: foo.claimedReward.view,
          totalReward: foo.totalReward.view,
          receiveBtn: {
            disabled: false,
            busy: false,
            click: () => tokens.UU.claimReward(_token)
          },
          exchangeRate: '1 SFG = 0.5472 DAI',
          // TODO: ???
          busy: _address.state.busy
        })
      })

      tokens.UU.supportedLptAddresses.forEach((_address, idx) => {
        // TODO: 优化
        const _token = tokenAddresses[_address.handled]
// TODO:  这里的奖励应该是 lpt 挖矿出来的奖励 token
        if (!_token) return false
// XXX: 这里应该不对，如果挖矿有多个奖励呢？
        const foo = tokens.UU.getAssociatedToken(_token)

        if (!(foo && _token)) return false

        const rewards = []
        // TODO: temp
        if (_address.handled === '0xd9976960b50e0966626673480C70b1da07E5AC1b') {

          foo.lptRewards.forEach(item => {
            const _t = tokenAddresses[item]

            const associatedToken = tokens.UU.getAssociatedToken(_t)

            rewards.push({
              // TODO: 应该是奖励的 token
              code: _t.code,
              // XXX: 这里应该不对，如果挖矿有多个奖励呢？
              pendingSettleReward: associatedToken.miningPendingRewards.view,
              pendingSettleRewardConvertUSD: '$ ?',
              settleBtn: {
                disabled: false,
                busy: false,
                idx,
                click: (idx) => tokens.UU.settleReward(_address.handled, idx)
              },
              settleRewardRate: '1.00 %',
              // XXX: 这里应该不对，如果挖矿有多个奖励呢？
              settleReward: associatedToken.settleableReward.view,
              exchangeRate: '1 SFG = 0.5472 DAI'
            })
          })
        }

        settleList.push({
          lpt: _token.code,
          name: _token.name.view,
          rewards
        })
      })

      return {
        own: {
          claimAllBtn: {
            disabled: false,
            busy: tokens.UU.state.busy,
            click: () => tokens.UU.claimAllRewards()
          },
          list: ownList,
        },
        claimTo: {

        },
        settle: {
          list: settleList
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-list-split {
  .ant-spin-container {
    .ant-list-items {
      .ant-list-item {
        border-bottom-width: 0px;
        &:last-child {
          border-bottom-width: 0px;
        }
        .ant-list-item-meta {
          margin-bottom: 0px;
        }
        .content {
          background: rgba(17, 20, 20, 0.03);
          border-radius: 4px;
        }
      }
    }
  }
}
</style>