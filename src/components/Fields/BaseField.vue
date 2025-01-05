<template>
  <TextInput ref="input" :required="required" :label="label" :placeholder="placeholder" :help-text="helpText" />
</template>

<script lang="ts">
import type { Builder } from 'ton-core';
import TextAreaInput from '../Inputs/TextAreaInput.vue';
import TextInput from '../Inputs/TextInput.vue';

export default {
  components: {
    TextInput, TextAreaInput
  },
  props: {
    required: {
      type: Boolean,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    helpText: {
      type: String,
    },
  },
  methods: {
    validate(): boolean {
      return (this.$refs.input as typeof TextInput).validate();
    },
    store(_: Builder): void {

    }
  }
}
</script>