<template>
  <TextInput ref="input" :optional="optional" :label="label"
    :placeholder="placeholder || $t('message.Fields.Slice_Placeholder')"
    :help-text="helpText || $t('message.Fields.Slice_HelpText')" />
</template>

<script lang="ts">
import { Cell, Builder } from 'ton-core';
import BaseField from './BaseField.vue';
import TextInput from '../Inputs/TextInput.vue';

export default {
  extends: BaseField,
  components: {
    TextInput
  },
  methods: {
    store(builder: Builder): void {
      builder.storeSlice(Cell.fromBase64((this.$refs.input as typeof TextInput).value).asSlice())
    }
  }
}
</script>