<template>
  <FieldLabelWrapper
    :label="label"
    :help-text="helpText ?? $t('message.Fields.Uint.HelpText', { min, max, format })"
    :error-text="errorText"
    :optional="optional"
  >
    <input
      class="input"
      type="number"
      :placeholder="placeholder ?? $t('message.Fields.Uint.Placeholder', { min, max, format })"
      v-model="value"
      @input="validate"
    />
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
    },
  },
  data() {
    return {
      min: 0,
      max: 2 ** this.format - 1,
    };
  },
  components: {
    FieldLabelWrapper,
  },
  methods: {
    validate(): boolean {
      if (!this.optional && !this.value && typeof this.value !== 'number') {
        this.errorText = this.$t('message.Fields.Errors.RequiredField');
        return false;
      }

      try {
        parseInt(this.value);
      } catch {
        this.errorText = this.$t('message.Fields.Errors.InvalidNumber');
        return false;
      }

      const value = parseInt(this.value);
      if (value < this.min) {
        this.errorText = this.$t('message.Fields.Errors.MustBeMoreThan', { min: this.min });
        return false;
      }
      if (value > this.max) {
        this.errorText = this.$t('message.Fields.Errors.MustBeLessThan', { max: this.max });
        return false;
      }

      this.errorText = '';
      return true;
    },
    store(builder: Builder): void {
      if (this.optional) {
        builder.storeMaybeUint(this.value ? parseInt(this.value) : null, this.format);
      } else {
        builder.storeUint(parseInt(this.value), this.format);
      }
    },
  },
};
</script>
