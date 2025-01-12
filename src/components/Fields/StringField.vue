<template>
  <FieldLabelWrapper
    :label="label"
    :help-text="helpText ?? $t('message.Fields.String.HelpText')"
    :error-text="errorText"
    :optional="optional"
  >
    <input
      v-if="inputType == 'text'"
      class="input"
      type="text"
      :placeholder="placeholder ?? $t('message.Fields.String.Placeholder')"
      v-model="value"
      @input="validate"
    />
    <textarea
      v-else-if="inputType == 'textarea'"
      class="input"
      :placeholder="placeholder ?? $t('message.Fields.String.Placeholder')"
      v-model="value"
      @input="validate"
    ></textarea>
  </FieldLabelWrapper>
</template>

<script lang="ts">
import { beginCell, type Builder } from 'ton-core';
import BaseField from './BaseField.vue';
import FieldLabelWrapper from './FieldLabelWrapper.vue';

export default {
  extends: BaseField,
  components: {
    FieldLabelWrapper,
  },
  props: {
    inputType: {
      type: String as () => 'text' | 'textarea',
      default: 'text',
    },
  },
  methods: {
    validate(): boolean {
      if (!this.optional && !this.value) {
        this.errorText = this.$t('message.Fields.Errors.RequiredField');
        return false;
      }

      this.errorText = '';
      return true;
    },
    store(builder: Builder): void {
      if (this.optional) {
        builder.storeMaybeRef(
          this.value ? beginCell().storeStringRefTail(this.value).asCell() : null,
        );
      } else {
        builder.storeRef(beginCell().storeStringRefTail(this.value).asCell());
      }
    },
  },
};
</script>
