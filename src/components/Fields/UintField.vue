<template>
  <NumberInput ref="input" :optional="optional" :label="label"
    :placeholder="placeholder || $t('message.Fields.Uint_Placeholder', { min, max, format })"
    :help-text="helpText || $t('message.Fields.Uint_HelpText', { min, max, format })" />
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
  data() {
    return {
      min: 0,
      max: 2 ** this.format - 1
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