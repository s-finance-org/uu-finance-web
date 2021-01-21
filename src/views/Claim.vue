<template>
  <a-layout-content class="container-lg px-4">
    <div class="px-lg-5 mx-lg-3">
      <div class="mt-lg-4 mb-4 mb-lg-5 pb-4">
        <h2 class="fs-2 mb-1">{{ $t('global.claim.title') }}</h2>
        <span class="fs-6 pe-5 d-block">{{ $t('global.claim.subtitle') }}</span>
      </div>

      <a-tabs animated type="card" defaultActiveKey=structure.claimActionsDefaultKey v-model:activeKey=tabClaimAction>
        <a-tab-pane key="own" :tab=$t(structure.claimActions.own.tabI18n) class="d-flex flex-wrap">
          <!-- TODO: 重复的 -->
          <div class="line-frame-thin d-flex px-3 py-2 p-md-4 mt-3 flex-column col-12 col-md-4 order-md-1">
            <small class="d-flex">
              <span class="me-2 d-flex"><iYellowinfo /></span>
              {{ $t(structure.claimActions.own.sideTipI18n) }}
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
                  <!-- {{ $t(structure.claimActions.own.totalApyI18n) }}: -->
                </span>
                <button-busy type="link" size="small" @click=ixd.own.claimAllBtn.click :busying=ixd.own.claimAllBtn.disabled :disabled=ixd.own.claimAllBtn.busy>
                  {{ $t(structure.claimActions.own.claimAllBtnI18n) }}
                </button-busy>
              </div>
            </template>
            <template #renderItem="{ item, index }">
              <a-list-item :key="'item-' + index">
                <a-list-item-meta>
                  <template #title>
                    <div class="d-flex align-items-center">
                      <component :is="`token-${item.code}`" class="token-icon me-3"></component>
                      <span class="fs-4">
                        {{ item.code }} {{ $t(structure.rewardI18n) }}
                        <small class="d-block pt-1">{{ item.code }} {{ $t('global.base.apy') }}: {{ item.apy }}</small>
                      </span>
                    </div>
                  </template>
                </a-list-item-meta>
                <div class="d-flex justify-content-between align-items-end">
                  <small>
                    {{ $t(structure.claimActions.own.pendingRewardI18n) }}
                    <span class="d-block fs-5 pt-1">
                      {{ item.pendingReward }} {{ item.code }}<small class="ps-2 text-color-secondary">{{ item.pendingRewardConvertUSD }}</small>
                    </span>
                  </small>
                  <button-busy type="primary" size="small" @click=item.receiveBtn.click :busying=item.receiveBtn.disabled :disabled=item.receiveBtn.busy>
                    {{ $t(structure.claimActions.own.receiveBtnI18n) }}
                  </button-busy>
                </div>
                <div class="content px-3 pt-2 d-flex flex-wrap mt-2">
                  <small class="col-6 mb-2">{{ $t(structure.claimActions.own.paidRewardI18n) }}: {{ item.paidReward }} {{ item.code }}</small>
                  <small class="col-6 mb-2">{{ $t(structure.claimActions.own.totalRewardI18n) }}: {{ item.totalReward }} {{ item.code }}</small>
                  <!-- <small class="col-6 mb-2">{{ item.exchangeRate }}</small> -->
                  <!-- <small class="col-6 mb-2">{{ $t('global.base.estimatedTransactionFee') }}：x</small> -->
                </div>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>

        <a-tab-pane key="claimTo" disabled :tab=$t(structure.claimActions.claimTo.tabI18n) class="d-flex flex-wrap">
          <!-- TODO: 重复的 -->
          <div class="line-frame-thin d-flex px-3 py-2 p-md-4 mt-3 flex-column col-12 col-md-4 order-md-1">
            <small class="d-flex">
              <span class="me-2 d-flex"><iYellowinfo /></span>
              {{ $t(structure.claimActions.claimTo.sideTipI18n) }}
            </small>
            <iIntersect class="d-none d-md-block text-align-justify" />
          </div>
        </a-tab-pane>

        <a-tab-pane key="settle" :tab=$t(structure.claimActions.settle.tabI18n) class="d-flex flex-wrap">
          <!-- TODO: 重复的 -->
          <div class="line-frame-thin d-flex px-3 py-2 p-md-4 mt-3 flex-column col-12 col-md-4 order-md-1">
            <small class="d-flex">
              <span class="me-2 d-flex"><iYellowinfo /></span>
              {{ $t(structure.claimActions.settle.sideTipI18n) }}
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
              <a-list-item :key="'item-' + index">
                <a-list-item-meta>
                  <template #title>
                    <div class="d-flex align-items-center">
                      <component :is="`token-${item.lpt}`" class="me-2"></component>
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
                  <div class="d-flex justify-content-between align-items-end">
                    <small>
                      {{ $t(structure.claimActions.settle.pendingSettleRewardI18n) }}
                      <span class="d-block fs-5 pt-1">
                        {{ reward.pendingSettleReward }} {{ reward.code }}<small class="ps-2 text-color-secondary">{{ reward.pendingSettleRewardConvertUSD }}</small>
                      </span>
                    </small>
                    <button-busy type="primary" size="small" @click=reward.settleBtn.click(idx) :busying=reward.settleBtn.disabled :disabled=reward.settleBtn.busy>
                      {{ $t(structure.claimActions.settle.settleBtnI18n) }}
                    </button-busy>
                  </div>
                  <div class="content px-3 pt-2 d-flex flex-wrap mt-2">
                    <small class="col-6 mb-2">{{ $t(structure.claimActions.settle.settleRewardRateI18n) }}: {{ reward.settleRewardRate }}</small>
                    <small class="col-6 mb-2">{{ $t(structure.claimActions.settle.settleRewardI18n) }}: {{ reward.settleReward }} {{ reward.code }}</small>
                    <!-- <small class="col-6 mb-2">{{ reward.exchangeRate }}</small> -->
                    <!-- <small class="col-6 mb-2">{{ $t('global.base.estimatedTransactionFee') }}：x</small> -->
                  </div>
                  </div>
              </a-list-item>
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

import { ModelValueEther } from '../models'

export default {
  components: {
    iIntersect,
    iYellowinfo,
    ButtonBusy
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
        rewardI18n: 'global.base.reward',
        apyI18n: 'global.base.apy',

        claimActionsDefaultKey: 'own',
        claimActions: {
          own: {
            tabI18n: 'global.claim.own.tab',
            totalApyI18n: 'global.claim.own.totalApy',
            claimAllBtnI18n: 'global.claim.own.allClaim',
            pendingRewardI18n: 'global.claim.own.pendingReward',
            paidRewardI18n: 'global.claim.own.paidReward',
            totalRewardI18n: 'global.claim.own.totalReward',
            receiveBtnI18n: 'global.claim.own.receiveAward',
            sideTipI18n: 'global.claim.own.sideTip'
          },
          claimTo: {
            tabI18n: 'global.claim.claimTo.tab',
            sideTipI18n: 'global.claim.claimTo.sideTip'
          },
          settle: {
            tabI18n: 'global.claim.settle.tab',
            sideTipI18n: 'global.claim.settle.sideTip',
            pendingSettleRewardI18n: 'global.claim.settle.pendingSettleReward',
            settleRewardRateI18n: 'global.claim.settle.settleRewardRate',
            settleRewardI18n: 'global.claim.settle.settleReward',
            settleBtnI18n: 'global.claim.settle.participateSettle'
          }
        }
      }
    },
    ixd () {
      const { tokens, tokenAddresses } = this.$store
      const ownList = []
      const settleList = []

      tokens.UU.supportedRewardAddresses.forEach(_address => {
        // TODO: 优化 tokenAddresses 的数据同步
        const _token = tokenAddresses[_address.handled]

        if (!_token) return false

        const foo = tokens.UU.getAssociatedToken(_token)
        // TODO: 如果没有，则就是项目自带的 token 没有，需要看 claimableReward、claimedReward

        if (!(foo && _token)) return false

        ownList.push({
          code: _token.code,
          apy: '?%',
          pendingReward: foo.claimableReward.view,
          // pendingRewardLoading: foo.claimableReward.state.loading,
          pendingRewardConvertUSD: '≈$ ?',
          paidReward: foo.claimedReward.view,
          totalReward: foo.totalReward.view,
          receiveBtn: {
            disabled: false,
            busy: false,
            click: () => tokens.UU.claimReward(_token)
          },
          exchangeRate: '1 SFG = 0.5472 DAI'
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

            if (!_t) return false
            const fo = tokens.UU.getAssociatedToken(_t)

            rewards.push({
              // TODO: 应该是奖励的 token
              code: _t.code,
              // XXX: 这里应该不对，如果挖矿有多个奖励呢？
              pendingSettleReward: fo.miningPendingRewards.view,
              pendingSettleRewardConvertUSD: '≈$ ?',
              settleBtn: {
                disabled: false,
                busy: false,
                idx,
                click: (idx) => tokens.UU.settleReward(_address.handled, idx)
              },
              settleRewardRate: '1.00 %',
              // XXX: 这里应该不对，如果挖矿有多个奖励呢？
              settleReward: fo.settleableReward.view,
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
          list: ownList
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
          .token-icon {
            font-size: 52px;
            height: 52px;
          }
          .icon-group-tokens {
            zoom: 1.625
          }
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