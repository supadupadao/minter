<template>
  <FieldLabelWrapper :label="label" :help-text="helpText ?? $t('message.Fields.Int.HelpText', { min, max, format })"
    :error-text="errorText" :optional="true">
    <input class="input" type="number"
      :placeholder="placeholder ?? $t('message.Fields.Int.Placeholder', { min, max, format })" v-model="value"
      @input="validate">
  </FieldLabelWrapper>
</template>

<script lang="ts">
import type { Builder } from 'ton-core';
import BaseField from './BaseField.vue';
import FieldLabelWrapper from './FieldLabelWrapper.vue';

export default {
  extends: BaseField,
  props: {
    format: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      min: -(2 ** (this.format - 1)),
      max: 2 ** (this.format - 1) - 1
    }
  },
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
      if (value < this.min) {
        this.errorText = this.$t("message.Fields.Errors.MustBeMoreThan", { min: this.min });
        return false;
      }
      if (value > this.max) {
        this.errorText = this.$t("message.Fields.Errors.MustBeLessThan", { max: this.max });
        return false;
      }

      this.errorText = "";
      return true;
    },
    store(builder: Builder): void {
      builder.storeUint(parseInt(this.value), this.format);
    }
  }
}
</script>