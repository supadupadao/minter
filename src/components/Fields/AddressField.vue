<template>
  <FieldLabelWrapper :label="label" :help-text="helpText ?? $t('message.Fields.Address.HelpText')"
    :error-text="errorText" :optional="optional">
    <input class="input" type="text" :placeholder="placeholder ?? $t('message.Fields.Address.Placeholder')"
      v-model="value" @input="validate">
  </FieldLabelWrapper>
</template>

<script lang="ts">
import { Builder, Address } from 'ton-core';
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

      if (this.value) {
        try {
          Address.parse(this.value);
        } catch {
          this.errorText = this.$t("message.Fields.Errors.WrongAddress");
          return false
        }
      }

      this.errorText = "";
      return true;
    },
    store(builder: Builder): void {
      builder.storeAddress(this.value ? Address.parse(this.value) : null);
    }
  }
}
</script>