<template>
  <TextInput ref="input" :optional="optional" :label="label" :placeholder="placeholder" :help-text="helpText" />
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