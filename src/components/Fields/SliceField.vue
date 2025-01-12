<template>
  <FieldLabelWrapper
    :label="label"
    :help-text="helpText ?? $t('message.Fields.Slice.HelpText')"
    :error-text="errorText"
    :optional="optional"
  >
    <input
      class="input"
      type="text"
      :placeholder="placeholder ?? $t('message.Fields.Slice.Placeholder')"
      v-model="value"
      @input="validate"
    />
  </FieldLabelWrapper>
</template>

<script lang="ts">
import { Cell, Builder } from 'ton-core';
import BaseField from './BaseField.vue';
import FieldLabelWrapper from './FieldLabelWrapper.vue';

export default {
  extends: BaseField,
  components: {
    FieldLabelWrapper,
  },
  props: {
    format: {
      type: String as () => 'remaining' | null,
      required: true,
    },
  },
  methods: {
    validate() {
      if (!this.optional && !this.value) {
        this.errorText = this.$t('message.Fields.Errors.RequiredField');
        return false;
      }

      if (this.value) {
        try {
          Cell.fromBase64(this.value);
        } catch {
          this.errorText = this.$t('message.Fields.Errors.InvalidBase64');
          return false;
        }
      }

      this.errorText = '';
      return true;
    },
    store(builder: Builder): void {
      if (this.value) {
        const value = Cell.fromBase64(this.value).asSlice();

        if (this.format == 'remaining') {
          builder.storeSlice(value);
          return;
        }

        if (this.optional) {
          builder.storeMaybeSlice(value);
          return;
        }

        builder.storeSlice(value);
        return;
      } else {
        if (this.format == 'remaining') {
          return;
        }

        if (this.optional) {
          builder.storeMaybeSlice(null);
          return;
        }
      }
    },
  },
};
</script>
