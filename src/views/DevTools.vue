<template>
  <div v-if="loading" class="container">
    <progress class="progress is-large is-info" max="100">Loading</progress>
  </div>
  <div v-else
    class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-4-cols-desktop has-4-cols-widescreen has-4-cols-fullhd">
    <div class="grid is-gap-1">
      <div v-for="warning in warnings" v-bind:key="warning" class="cell is-col-span-4-desktop">
        <div class="box is-shadowless has-background-warning-light">
          <span class="tag is-warning">{{ $t('message.Common.Warning') }}</span>
          {{ warning }}
        </div>
      </div>
      <!-- <div v-if="jettonData && parsedMetadata" class="cell is-col-span-4-desktop">
        <div class="box is-shadowless has-background-light">
          <JettonCardBig :is-correct-interface="isCorrectInterface" :jetton-data="jettonData"
            :parsed-metadata="parsedMetadata" />
        </div>
      </div> -->
      <div class="cell is-col-span-1-desktop">
        <div class="box is-shadowless has-background-light">
          <aside class="menu">
            <p class="menu-label">{{ $t("message.DevTools.Receivers") }}</p>
            <ul class="menu-list">
              <li v-bind:key="index" v-for="(receiver, index) in abi.receivers">
                <ContractOperationsItemReceiver :receiver="receiver" @click="$refs.manageForm?.setReceiver(receiver)" />
              </li>
            </ul>
            <p class="menu-label">{{ $t("message.DevTools.Getters") }}</p>
            <ul class="menu-list">
              <li v-bind:key="index" v-for="(getter, index) in abi.getters">
                <ContractOperationsItemGetter :getter="getter" @click="$refs.manageForm?.setGetter(getter)" />
              </li>
            </ul>
          </aside>
        </div>
      </div>
      <div class="cell is-col-span-3-desktop">
        <div class="box is-shadowless has-background-light">
          <ContractManageForm ref="manageForm" :types="(abi.types || [])" :provider="provider" />
        </div>
      </div>
      <div class="cell is-col-span-1-desktop">
        <div class="box is-shadowless has-background-light">
          <h3 class="subtitle">{{ $t("message.DevTools.Legend") }}</h3>
          <span class="icon has-text-danger is-medium">
            <i class="fa-solid fa-circle"></i>
          </span>
          <span> - {{ $t("message.DevTools.Internals") }}</span>
          <br />
          <span class="icon has-text-warning is-medium">
            <i class="fa-solid fa-circle-half-stroke"></i>
          </span>
          <span> - {{ $t("message.DevTools.Externals") }}</span>
          <br />
          <span class="icon has-text-success is-medium">
            <i class="fa-regular fa-circle"></i>
          </span>
          <span> - {{ $t("message.DevTools.Getters") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { type ContractABI, type ContractProvider } from 'ton';
import ContractOperationsItemGetter from '@/components/DevTools/ContractOperationsItemGetter.vue';
import ContractOperationsItemReceiver from '@/components/DevTools/ContractOperationsItemReceiver.vue';
import ContractManageForm from '@/components/DevTools/ContractManageForm.vue';
import { getStateInitByAddress, parseAddress } from '@/utils/tonHelpers';
import { ContractSourcesFetcher } from '@/tonVerifier';
import DefaultABI from "@/assets/JettonMaster.abi.json";

export default {
  components: {
    ContractOperationsItemGetter, ContractOperationsItemReceiver, ContractManageForm
  },
  data() {
    return {
      abi: {} as ContractABI,
      loading: true,
      warnings: [] as string[],
      provider: {} as ContractProvider,
    }
  },
  async created() {
    const address = parseAddress(this.$route.params.address as string)
    if (!address) {
      // TODO 404
      return;
    }

    const stateInit = await getStateInitByAddress(this.$tonClient, address);
    if (!stateInit) {
      // TODO 404
      return;
    }
    this.provider = this.$tonClient.provider(address, stateInit);

    const sourceFetcher = new ContractSourcesFetcher({
      network: {
        type: "testnet"
      }
    });
    const abi = await sourceFetcher.getSource(this.$tonClient, stateInit.code);
    if (abi) {
      this.abi = abi;
    } else {
      this.warnings.push(this.$t("message.DevTools.NoSourceCode"));
      this.abi = DefaultABI as ContractABI;
    }

    this.loading = false;
  }
}
</script>