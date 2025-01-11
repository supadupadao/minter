<template>
  <FieldLabelWrapper :label="label" :help-text="helpText ?? $t('message.Fields.Coins.HelpText')" :error-text="errorText"
    :optional="true">
    <input class="input" type="number" :placeholder="placeholder ?? $t('message.Fields.Coins.Placeholder')"
      v-model="value" @input="validate">
  </FieldLabelWrapper>
</template>

<script lang="ts">
const COINS_MIN_VALUE = 0;
const COINS_MAX_VALUE = 2 ** 257 - 1;

import { type Builder } from 'ton-core';
import BaseField from './BaseField.vue';
import FieldLabelWrapper from './FieldLabelWrapper.vue';

export default {
  extends: BaseField,
  components: {
    FieldLabelWrapper
  },
  methods: {
    validate(): boolean {
      if (!this.optional && !this.value) {
        this.errorText = this.$t("message.Fields.Errors.RequiredField");
        return false;
      }

      try {
        parseInt(this.value);
      } catch {
        this.errorText = this.$t("message.Fields.Errors.InvalidNumber");
        return false;
      }

      const value = parseInt(this.value);
      if (value < COINS_MIN_VALUE) {
        this.errorText = this.$t("message.Fields.Errors.MustBeMoreThan", { min: COINS_MIN_VALUE });
        return false;
      }
      if (value > COINS_MAX_VALUE) {
        this.errorText = this.$t("message.Fields.Errors.MustBeLessThan", { max: COINS_MAX_VALUE });
        return false;
      }

      this.errorText = "";
      return true;
    },
    store(builder: Builder): void {
      builder.storeCoins(parseInt(this.value));
    }
  }
}
</script>