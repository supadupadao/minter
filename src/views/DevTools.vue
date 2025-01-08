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
          {{ $t('message.DevTools.DifferentContract') }}
        </div>
      </div>
      <div v-if="!isSourceCodeProvided" class="cell is-col-span-4-desktop">
        <div class="box is-shadowless has-background-warning-light">
          <span class="tag is-warning">{{ $t('message.Common.Warning') }}</span>
          {{ $t('message.DevTools.NoSourceCode') }}
        </div>
      </div>
      <div v-if="jettonData && parsedMetadata" class="cell is-col-span-4-desktop">
        <div class="box is-shadowless has-background-light">
          <JettonCardBig :is-correct-interface="isCorrectInterface" :jetton-data="jettonData"
            :parsed-metadata="parsedMetadata" />
        </div>
      </div>
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
import JettonCardBig from '@/components/DevTools/JettonCardBig.vue';
import { parseMetadata } from '@/utils/dict';
import { SupaDupaJettonMaster } from '@/utils/jettonMaster';
import type { JettonMasterData, MetadataDict } from '@/utils/types';
import type { ContractABI, ContractProvider, TonClient } from 'ton';
import { Address, Cell } from 'ton-core';
import jettonMasterABI from "@/assets/JettonMaster.abi.json";
import ContractOperationsItemGetter from '@/components/DevTools/ContractOperationsItemGetter.vue';
import ContractOperationsItemReceiver from '@/components/DevTools/ContractOperationsItemReceiver.vue';
import ContractManageForm from '@/components/DevTools/ContractManageForm.vue';

// const ORBS_SOURCES_REGISTRY = Address.parse("EQD-BJSVUJviud_Qv7Ymfd3qzXdrmV525e3YDzWQoHIAiInL");
const ORBS_SOURCES_REGISTRY_TESTNET = Address.parse("EQCsdKYwUaXkgJkz2l0ol6qT_WxeRbE_wBCwnEybmR0u5TO8");
// const ORBS_IPFS_ENDPOINT = "https://files.orbs.network/ipfs/"
const ORBS_IPFS_ENDPOINT_TESTNET = "https://tonsource-testnet.infura-ipfs.io/ipfs/";

interface SourceItem {
  url: string,
  filename: string,
}

interface SourceResult {
  sources: SourceItem[]
}

function bigIntFromBuffer(buffer: Buffer): bigint {
  return BigInt(`0x${buffer.toString("hex")}`);
}

async function getSources(codeCellHash: Buffer, tonClient: TonClient) {
  let abi = null
  // Source provider
  const contractState = await tonClient.getContractState(ORBS_SOURCES_REGISTRY_TESTNET); // TODO add error handling
  const code = Cell.fromBase64(contractState.code?.toString("base64") as string);
  const data = Cell.fromBase64(contractState.data?.toString("base64") as string);
  const provider = tonClient.provider(ORBS_SOURCES_REGISTRY_TESTNET, { code, data });
  const result = await provider.get("get_source_item_address", [
    // {
    //   type: "int",
    //   value: bigIntFromBuffer(await sha256("orbs.com"))
    // },
    { // TODO ?
      type: "int",
      value: 17676787183715497356968962353312138049121632594906749996652211766711021743417n
    },
    {
      type: "int",
      value: bigIntFromBuffer(codeCellHash)
    },
  ]);

  // Source contract
  const address = result.stack.readAddress();
  const sourceContractState = await tonClient.getContractState(address); // TODO add error handling
  if (!sourceContractState.code) {
    return null;
  }
  const sourceCode = Cell.fromBase64(sourceContractState.code?.toString("base64") as string);
  const sourceData = Cell.fromBase64(sourceContractState.data?.toString("base64") as string);
  const sourceProvider = tonClient.provider(address, { code: sourceCode, data: sourceData });
  const sourceResult = await sourceProvider.get("get_source_item_data", []);
  const contentCell = sourceResult.stack.skip(3).readCell().beginParse();
  const ipfsLink = contentCell.loadStringTail();

  const verifiedContract = await (await fetch(ipfsLink.replace("ipfs://", ORBS_IPFS_ENDPOINT_TESTNET))).json() as SourceResult;
  for (const source of verifiedContract.sources) {
    if (source.filename.endsWith(".abi")) {
      const url = source.url.replace("ipfs://", ORBS_IPFS_ENDPOINT_TESTNET);
      const content = await fetch(url).then((u) => u.json());
      abi = content
    }
  }

  return abi;
}

async function initJettonMetadata(tonClient: TonClient, address: Address) {
  let isCorrectInterface = true;

  // Getting contract state
  const contractState = await tonClient.getContractState(address); // TODO add error handling

  if (contractState.state == "uninitialized") {
    return null
  }

  // Getting toncenter provider
  const code = Cell.fromBase64(contractState.code?.toString("base64") as string);
  const data = Cell.fromBase64(contractState.data?.toString("base64") as string);
  const provider = tonClient.provider(address, { code, data });

  let jettonData = null;
  let parsedMetadata = null
  try {
    // Open jetton master contract
    const jettonMaster = new SupaDupaJettonMaster(address);
    const contract = tonClient.open(jettonMaster);

    // Execute jetton supported_interfaces getter
    const interfaces = await contract.supportedInterfaces(provider);
    isCorrectInterface = interfaces.includes(0xc26445264d7dbe48b97b619da755d205n);

    jettonData = await contract.jettonData(provider);
    parsedMetadata = await parseMetadata(jettonData.content);
  } catch {
    isCorrectInterface = false;
  }

  return {
    isCorrectInterface,
    parsedMetadata,
    jettonData,
    provider,
    abi: await getSources(code.hash(), tonClient)
  }
}

export default {
  components: {
    JettonCardBig, ContractOperationsItemGetter, ContractOperationsItemReceiver, ContractManageForm
  },
  data() {
    return {
      abi: {} as ContractABI,
      loading: true,
      jettonData: null as JettonMasterData | null,
      parsedMetadata: null as MetadataDict | null,
      isCorrectInterface: true,
      isSourceCodeProvided: true,
      provider: {} as ContractProvider,
    }
  },
  async created() {
    const address = Address.parse(this.$route.params.address as string);

    // Parse jetton metadata
    const result = await initJettonMetadata(this.$tonClient, address)
    if (result) {
      const { isCorrectInterface, jettonData, parsedMetadata, provider, abi } = result;
      this.isCorrectInterface = isCorrectInterface;
      this.jettonData = jettonData;
      this.parsedMetadata = parsedMetadata;
      this.provider = provider;
      if (abi) {
        this.abi = abi as ContractABI;
      } else {
        this.isSourceCodeProvided = false;
        this.abi = jettonMasterABI as ContractABI;
      }
    }

    this.loading = false;
  }
}
</script>