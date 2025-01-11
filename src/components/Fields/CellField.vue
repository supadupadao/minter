<template>
  <FieldLabelWrapper :label="label" :help-text="helpText ?? $t('message.Fields.Cell.HelpText')" :error-text="errorText"
    :optional="true">
    <input class="input" type="text" :placeholder="placeholder ?? $t('message.Fields.Cell.Placeholder')" v-model="value"
      @input="validate">
  </FieldLabelWrapper>
</template>

<script lang="ts">
import { Cell, Builder } from 'ton-core';
import BaseField from './BaseField.vue';
import FieldLabelWrapper from './FieldLabelWrapper.vue';

export default {
  extends: BaseField,
  components: {
    FieldLabelWrapper
  },
  methods: {
    validate() {
      if (!this.optional && !this.value) {
        this.errorText = this.$t("message.Fields.Errors.RequiredField");
        return false;
      }

      try {
        Cell.fromBase64(this.value);
      } catch {
        this.errorText = this.$t("message.Fields.Errors.InvalidBase64");
        return false
      }

      this.errorText = "";
      return true;
    },
    store(builder: Builder): void {
      builder.storeRef(Cell.fromBase64(this.value))
    }
  }
}
</script>