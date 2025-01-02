<template>
  <div v-if="loading" class="container">
    <progress class="progress is-large is-info" max="100">Loading</progress>
  </div>
  <div v-else class="container">
    <div class="box is-shadowless has-background-light">
      <article class="media">
        <figure class="media-left">
          <p class="image is-128x128">
            <img class="is-rounded" src="https://bulma.io/assets/images/placeholders/128x128.png" />
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <p v-if="!isCorrectInterface">
              <span class="tag is-warning">{{ $t('message.Common.Warning') }}</span>
              {{ $t('message.JettonManage.DifferentContract') }}
            </p>
            <h1 class="title">{{ parsedMetadata.name }} ({{ parsedMetadata.symbol }})</h1>
            <p>{{ parsedMetadata.description }}</p>
            <p><strong>{{ $t('message.JettonManage.AdminAddress') }}</strong>: <a
                :href="`https://testnet.tonviewer.com/${jettonData.adminAddress.toString()}`" target="_blank">{{
                  jettonData.adminAddress
                }}</a>
            </p>
            <p><strong>{{ $t('message.JettonManage.TotalSupply') }}</strong>: {{ jettonData.totalSupply }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts">
import { Address, Cell, Dictionary, type Contract, type ContractProvider } from 'ton-core';
import { sha256 } from 'ton-crypto';

// https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-attributes
interface MetadataDict {
  uri?: string,
  name?: string,
  description?: string,
  image?: string,
  image_data?: string, // binary?
  symbol?: string,
  decimals?: string,
  amount_style?: "n" | "n-of-total" | "%",
  render_type?: "currency" | "game",
}

interface JettonMasterData {
  totalSupply: bigint,
  mintable: boolean,
  adminAddress: Address,
}

type Dict = Dictionary<Buffer, Cell>;

async function getValue(dict: Dict, key: string): Promise<Cell | undefined> {
  return dict.get(await sha256(key))
}

async function getString(dict: Dict, key: string): Promise<string | undefined> {
  const value = await getValue(dict, key);
  return value?.beginParse().loadStringRefTail()
}

async function parseMetadata(content: Cell): Promise<MetadataDict> {
  const result = {} as MetadataDict;
  const parser = content.beginParse();

  const onchainFlag = parser.loadUint(8);
  if (onchainFlag === 0) {
    /// On-Chain metadata
    const metadataDict = parser.loadDict(
      Dictionary.Keys.Buffer(32),
      Dictionary.Values.Cell()
    );

    result.name = await getString(metadataDict, "name");
    result.description = await getString(metadataDict, "description");
    result.symbol = await getString(metadataDict, "symbol");
  }
  if (onchainFlag === 1) {
    /// Off-Chain metadata
    /// TODO
  }

  return result
}

class SupaDupaJettonMaster implements Contract {
  readonly address: Address;
  constructor(address: Address) {
    this.address = address;
  }

  async jettonData(provider: ContractProvider) {
    const res = await provider.get('get_jetton_data', []);
    const totalSupply = res.stack.readBigNumber();
    const mintable = res.stack.readBoolean();
    const adminAddress = res.stack.readAddress();
    const content = res.stack.readCell();
    const walletCode = res.stack.readCell();
    return {
      totalSupply,
      mintable,
      adminAddress,
      content,
      walletCode
    };
  }

  async supportedInterfaces(provider: ContractProvider) {
    const res = await provider.get('supported_interfaces', []);
    const interfaces = [];

    // Validate interfaces
    const firstInterface = res.stack.readBigNumber();
    if (firstInterface !== 123515602279859691144772641439386770278n) {
      // TODO error handling
      throw new Error("Invalid interfaces");
    }
    interfaces.push(firstInterface);

    const remaining = res.stack.remaining;
    for (let i = 0; i < remaining; i++) {
      interfaces.push(res.stack.readBigNumber());
    }

    return interfaces;
  }
}

export default {
  data() {
    return {
      loading: true,
      jettonData: {} as JettonMasterData,
      parsedMetadata: {} as MetadataDict,
      isCorrectInterface: true,
    }
  },
  async created() {
    const address = Address.parse(this.$route.params.address as string);
    // Getting contract state
    const contractState = await this.$tonClient.getContractState(address); // TODO add error handling

    // Getting toncenter provider
    const code = Cell.fromBase64(contractState.code?.toString("base64") as string);
    const data = Cell.fromBase64(contractState.data?.toString("base64") as string);
    const provider = this.$tonClient.provider(address, { code, data });

    // Open jetton master contract
    const jettonMaster = new SupaDupaJettonMaster(address);
    const contract = this.$tonClient.open(jettonMaster);

    try {
      // Execute jetton supported_interfaces getter
      const interfaces = await contract.supportedInterfaces(provider);
      this.isCorrectInterface = interfaces.includes(0xc26445264d7dbe48b97b619da755d205n);
    } catch {
      this.isCorrectInterface = false;
    }
    const jettonData = await contract.jettonData(provider);
    this.jettonData = jettonData;
    this.parsedMetadata = await parseMetadata(jettonData.content);
    this.loading = false;
  }
}
</script>