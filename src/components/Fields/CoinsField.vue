<template>
  <NumberInput ref="input" :required="required" :label="label" :placeholder="placeholder" :help-text="helpText" />
</template>

<script lang="ts">
import type { Builder } from 'ton-core';
import NumberInput from '../Inputs/NumberInput.vue';
import BaseField from './BaseField.vue';

export default {
  extends: BaseField,
  components: {
    NumberInput
  },
  methods: {
    validate(): boolean {
      return (this.$refs.input as typeof NumberInput).validate()
    },
    store(builder: Builder): void {
      builder.storeCoins(parseInt((this.$refs.input as typeof NumberInput).value))
    }
  }
}
</script>