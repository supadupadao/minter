<template>
  <form>
    <div class="field">
      <label class="label">{{ $t("message.NewJettonForm.JettonName_Label") }}</label>
      <div class="control">
        <input v-model="jettonName" class="input" type="text"
          :placeholder="$t('message.NewJettonForm.JettonName_Placeholder')">
      </div>
      <p class="help">{{ $t("message.NewJettonForm.JettonName_HelpText") }}</p>
    </div>

    <div class="field">
      <label class="label">{{ $t("message.NewJettonForm.JettonSymbol_Label") }}</label>
      <div class="control">
        <input v-model="jettonSymbol" class="input" type="text"
          :placeholder="$t('message.NewJettonForm.JettonSymbol_Placeholder')">
      </div>
      <p class="help">{{ $t("message.NewJettonForm.JettonSymbol_HelpText") }}</p>
    </div>

    <div class="field">
      <label class="label">{{ $t("message.NewJettonForm.JettonDescription_Label") }}</label>
      <div class="control">
        <textarea v-model="jettonDescription" class="textarea"
          :placeholder="$t('message.NewJettonForm.JettonDescription_Placeholder')"></textarea>
      </div>
      <p class="help">{{ $t("message.NewJettonForm.JettonDescription_HelpText") }}</p>
    </div>

    <div class="field">
      <label class="label">{{ $t("message.NewJettonForm.JettonMaxSupply_Label") }}</label>
      <div class="control">
        <input v-model="maxSupply" class="input" type="number"
          :placeholder="$t('message.NewJettonForm.JettonMaxSupply_Placeholder')">
      </div>
      <p class="help">{{ $t("message.NewJettonForm.JettonMaxSupply_HelpText") }}</p>
    </div>

    <div class="control">
      <button class="button is-link" @click="deployToken">{{ $t("message.NewJettonForm.DeployJetton") }}</button>
    </div>
  </form>
</template>

<script lang="ts">
import { Address, beginCell, Cell, contractAddress, toNano } from 'ton';
import JettonMasterData from "@/assets/JettonMaster.json";

export default {
  setup() {
    return {
      jettonName: null as string | null,
      jettonSymbol: null as string | null,
      jettonDescription: null as string | null,
      maxSupply: null as number | null,
    }
  },
  methods: {
    deployToken(payload: MouseEvent) {
      const codeCell = Cell.fromBase64(JettonMasterData.code);
      const systemCell = Cell.fromBase64(JettonMasterData.system);
      const initData = beginCell()
        .storeRef(systemCell)
        .storeUint(0, 1)
        .storeAddress(Address.parse(this.$tonConnectUI.account?.address!))
        .endCell();
      const jettonInit = beginCell()
        .storeUint(0x133701, 32)
        .storeUint(0, 64)
        .storeStringRefTail(this.jettonName!)
        .storeStringRefTail(this.jettonDescription!)
        .storeStringRefTail(this.jettonSymbol!)
        .storeCoins(this.maxSupply!)
        .endCell();

      const address = contractAddress(0, {
        code: codeCell,
        data: initData,
      });

      this.$tonConnectUI.sendTransaction(
        {
          validUntil: Math.floor(Date.now() / 1000) + 360,
          messages: [
            {
              address: address.toString(),
              amount: toNano("0.1").toString(),
              payload: jettonInit.toBoc().toString("base64"),
              stateInit: beginCell()
                .storeBit(false)
                .storeBit(false)
                .storeMaybeRef(codeCell)
                .storeMaybeRef(initData)
                .storeUint(0, 1)
                .endCell()
                .toBoc()
                .toString("base64"),
            }
          ]
        }
      )

      payload.preventDefault();
    }
  }
}
</script>
