<template>
  <TextInput ref="input" :optional="optional" :label="label"
    :placeholder="placeholder || $t('message.Fields.Address_Placeholder')"
    :help-text="helpText || $t('message.Fields.Address_HelpText')" />
</template>

<script lang="ts">
import { Builder, Address } from 'ton-core';
import TextInput from '../Inputs/TextInput.vue';
import BaseField from './BaseField.vue';

export default {
  extends: BaseField,
  components: {
    TextInput
  },
  methods: {
    validate(): boolean {
      return (this.$refs.input as typeof TextInput).validate();
    },
    store(builder: Builder): void {
      builder.storeAddress(Address.parse((this.$refs.input as typeof TextInput).value))
    }
  }
}
</script>