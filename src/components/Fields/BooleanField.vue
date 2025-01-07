<template>
  <BooleanInput ref="input" :optional="optional" :label="label" :placeholder="placeholder" :help-text="helpText" />
</template>

<script lang="ts">
import { Builder } from 'ton-core';
import BaseField from './BaseField.vue';
import BooleanInput from '../Inputs/BooleanInput.vue';

export default {
  extends: BaseField,
  components: {
    BooleanInput
  },
  methods: {
    validate(): boolean {
      return (this.$refs.input as typeof BooleanInput).validate();
    },
    store(builder: Builder): void {
      builder.storeBit((this.$refs.input as typeof BooleanInput).value)
    }
  }
}
</script>