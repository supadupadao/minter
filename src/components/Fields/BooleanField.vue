<template>
  <FieldLabelWrapper :label="label" :help-text="helpText ?? $t('message.Fields.Boolean.HelpText')"
    :error-text="errorText" :optional="true">
    <input class="checkbox" type="checkbox" :placeholder="placeholder ?? $t('message.Fields.Boolean.Placeholder')"
      v-model="checked">
  </FieldLabelWrapper>
</template>

<script lang="ts">
import { Builder } from 'ton-core';
import BaseField from './BaseField.vue';
import FieldLabelWrapper from './FieldLabelWrapper.vue';

export default {
  extends: BaseField,
  components: {
    FieldLabelWrapper
  },
  data() {
    return {
      checked: false,
    }
  },
  methods: {
    validate(): boolean {
      return true;
    },
    store(builder: Builder): void {
      builder.storeBit(this.checked)
    }
  }
}
</script>