<template>
  <div v-if="loading" class="container">
    <progress class="progress is-large is-info" max="100">Loading</progress>
  </div>
  <div v-else
    class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-4-cols-desktop has-4-cols-widescreen has-4-cols-fullhd">
    <div class="grid is-gap-1">
      <div v-if="!isCorrectInterface" class="cell is-col-span-4-desktop">
        <div class="box is-shadowless has-background-warning-light">
          <span class="tag is-warning">{{ $t('message.Common.Warning') }}</span>
          {{ $t('message.JettonManage.DifferentContract') }}
        </div>
      </div>
      <div class="cell is-col-span-4-desktop">
        <div class="box is-shadowless has-background-light">
          <JettonCardBig :is-correct-interface="isCorrectInterface" :jetton-data="jettonData"
            :parsed-metadata="parsedMetadata" />
        </div>
      </div>
      <div class="cell is-col-span-1-desktop">
        <div class="box is-shadowless has-background-light">
          <aside class="menu">
            <p class="menu-label">{{ $t("message.JettonManage.Receivers") }}</p>
            <ul class="menu-list">
              <li v-bind:key="index" v-for="(receiver, index) in abi.receivers">
                <JettonOperationsItemReceiver :receiver="receiver" @click="$refs.manageForm?.setReceiver(receiver)" />
              </li>
            </ul>
            <p class="menu-label">{{ $t("message.JettonManage.Getters") }}</p>
            <ul class="menu-list">
              <li v-bind:key="index" v-for="(getter, index) in abi.getters">
                <JettonOperationsItemGetter :getter="getter" @click="$refs.manageForm?.setGetter(getter)" />
              </li>
            </ul>
          </aside>
        </div>
      </div>
      <div class="cell is-col-span-3-desktop">
        <div class="box is-shadowless has-background-light">
          <JettonManageForm ref="manageForm" :types="(abi.types || [])" />
        </div>
      </div>
      <div class="cell is-col-span-1-desktop">
        <div class="box is-shadowless has-background-light">
          <h3 class="subtitle">{{ $t("message.JettonManage.Legend") }}</h3>
          <span class="icon has-text-danger is-medium">
            <i class="fa-solid fa-circle"></i>
          </span>
          <span> - {{ $t("message.JettonManage.Internals") }}</span>
          <br />
          <span class="icon has-text-warning is-medium">
            <i class="fa-solid fa-circle-half-stroke"></i>
          </span>
          <span> - {{ $t("message.JettonManage.Externals") }}</span>
          <br />
          <span class="icon has-text-success is-medium">
            <i class="fa-regular fa-circle"></i>
          </span>
          <span> - {{ $t("message.JettonManage.Getters") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import JettonCardBig from '@/components/JettonCardBig.vue';
import JettonOperationsItemReceiver from '@/components/JettonOperationsItemReceiver.vue';
import { parseMetadata } from '@/utils/dict';
import { SupaDupaJettonMaster } from '@/utils/jettonMaster';
import type { JettonMasterData, MetadataDict } from '@/utils/types';
import type { ContractABI, TonClient } from 'ton';
import { Address, Cell } from 'ton-core';
import jettonMasterABI from "@/assets/JettonMaster.abi.json";
import JettonOperationsItemGetter from '@/components/JettonOperationsItemGetter.vue';
import JettonManageForm from '@/components/JettonManageForm.vue';

async function initJettonMetadata(tonClient: TonClient, address: Address): Promise<{ isCorrectInterface: boolean, parsedMetadata: MetadataDict, jettonData: JettonMasterData }> {
  let isCorrectInterface = true;

  // Getting contract state
  const contractState = await tonClient.getContractState(address); // TODO add error handling

  // Getting toncenter provider
  const code = Cell.fromBase64(contractState.code?.toString("base64") as string);
  const data = Cell.fromBase64(contractState.data?.toString("base64") as string);
  const provider = tonClient.provider(address, { code, data });

  // Open jetton master contract
  const jettonMaster = new SupaDupaJettonMaster(address);
  const contract = tonClient.open(jettonMaster);

  try {
    // Execute jetton supported_interfaces getter
    const interfaces = await contract.supportedInterfaces(provider);
    isCorrectInterface = interfaces.includes(0xc26445264d7dbe48b97b619da755d205n);
  } catch {
    isCorrectInterface = false;
  }
  const jettonData = await contract.jettonData(provider);

  return {
    isCorrectInterface,
    parsedMetadata: await parseMetadata(jettonData.content),
    jettonData,
  }
}

export default {
  components: {
    JettonCardBig, JettonOperationsItemReceiver, JettonOperationsItemGetter, JettonManageForm,
  },
  data() {
    return {
      abi: jettonMasterABI as ContractABI,
      loading: true,
      jettonData: {} as JettonMasterData,
      parsedMetadata: {} as MetadataDict,
      isCorrectInterface: true,
    }
  },
  async created() {
    const address = Address.parse(this.$route.params.address as string);

    // Parse jetton metadata
    const { isCorrectInterface, jettonData, parsedMetadata } = await initJettonMetadata(this.$tonClient, address);
    this.isCorrectInterface = isCorrectInterface;
    this.jettonData = jettonData;
    this.parsedMetadata = parsedMetadata;

    this.loading = false;
  }
}
</script>