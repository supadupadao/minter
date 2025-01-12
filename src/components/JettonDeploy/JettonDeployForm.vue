<template>
  <form>
    <StringField
      ref="jettonName"
      :label="$t('message.NewJettonForm.JettonName_Label')"
      :help-text="$t('message.NewJettonForm.JettonName_HelpText')"
      :placeholder="$t('message.NewJettonForm.JettonName_Placeholder')"
      :optional="false"
    />

    <StringField
      ref="jettonSymbol"
      :label="$t('message.NewJettonForm.JettonSymbol_Label')"
      :help-text="$t('message.NewJettonForm.JettonSymbol_HelpText')"
      :placeholder="$t('message.NewJettonForm.JettonSymbol_Placeholder')"
      :optional="false"
    />

    <StringField
      ref="jettonDescription"
      :label="$t('message.NewJettonForm.JettonDescription_Label')"
      :help-text="$t('message.NewJettonForm.JettonDescription_HelpText')"
      :placeholder="$t('message.NewJettonForm.JettonDescription_Placeholder')"
      :optional="false"
      input-type="textarea"
    />

    <CoinsField
      ref="maxSupply"
      :label="$t('message.NewJettonForm.JettonMaxSupply_Label')"
      :help-text="$t('message.NewJettonForm.JettonMaxSupply_HelpText')"
      :placeholder="$t('message.NewJettonForm.JettonMaxSupply_Placeholder')"
      :optional="false"
    />

    <div class="control">
      <button class="button is-link" @click="deployToken">
        {{ $t('message.NewJettonForm.DeployJetton') }}
      </button>
    </div>

    <p><span class="has-text-danger">*</span> - {{ $t('message.Common.requiredField') }}</p>
  </form>
</template>

<script lang="ts">
import { Address, beginCell, Cell, contractAddress, toNano } from 'ton';
import JettonMasterData from '@/assets/JettonMaster.json';
import StringField from '../Fields/StringField.vue';
import BaseField from '../Fields/BaseField.vue';
import CoinsField from '../Fields/CoinsField.vue';

export default {
  components: {
    StringField,
    CoinsField,
  },
  methods: {
    deployToken(payload: MouseEvent) {
      payload.preventDefault();

      // Validate
      const validations = [
        (this.$refs.jettonName as typeof BaseField).validate(),
        (this.$refs.jettonSymbol as typeof BaseField).validate(),
        (this.$refs.jettonDescription as typeof BaseField).validate(),
        (this.$refs.maxSupply as typeof BaseField).validate(),
      ];
      if (validations.filter((item) => !item).length > 0) {
        return false;
      }

      const account = this.$tonConnectUI.account?.address;
      const codeCell = Cell.fromBase64(JettonMasterData.code);
      const systemCell = Cell.fromBase64(JettonMasterData.system);
      const initData = beginCell()
        .storeRef(systemCell)
        .storeUint(0, 1)
        .storeAddress(Address.parse(account!))
        .storeInt(Math.floor(Date.now() / 1000), 257)
        .endCell();
      const jettonInit = beginCell()
        .storeUint(0x133701, 32)
        .storeUint(0, 64)
        .store((this.$refs.jettonName as typeof BaseField).store)
        .store((this.$refs.jettonDescription as typeof BaseField).store)
        .store((this.$refs.jettonSymbol as typeof BaseField).store)
        .store((this.$refs.maxSupply as typeof BaseField).store)
        .endCell();

      const address = contractAddress(0, {
        code: codeCell,
        data: initData,
      });

      this.$tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: address.toString(),
            amount: toNano('0.1').toString(),
            payload: jettonInit.toBoc().toString('base64'),
            stateInit: beginCell()
              .storeBit(false)
              .storeBit(false)
              .storeMaybeRef(codeCell)
              .storeMaybeRef(initData)
              .storeUint(0, 1)
              .endCell()
              .toBoc()
              .toString('base64'),
          },
        ],
      });

      payload.preventDefault();
    },
  },
};
</script>
