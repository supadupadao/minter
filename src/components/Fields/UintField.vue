<template>
  <NumberInput ref="input" :optional="optional" :label="label" :placeholder="placeholder" :help-text="helpText" />
</template>

<script lang="ts">
import type { Builder } from 'ton-core';
import NumberInput from '../Inputs/NumberInput.vue';
import BaseField from './BaseField.vue';

export default {
  extends: BaseField,
  props: {
    format: {
      type: Number,
      required: true,
    }
  },
  components: {
    NumberInput
  },
  methods: {
    validate(): boolean {
      return (this.$refs.input as typeof NumberInput).validate()
    },
    store(builder: Builder): void {
      builder.storeUint(parseInt((this.$refs.input as typeof NumberInput).value), this.format)
    }
  }
}
</script>