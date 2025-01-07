<template>
  <TextInput ref="input" v-if="inputType == 'text'" :optional="optional" :label="label" :placeholder="placeholder"
    :help-text="helpText" />
  <TextAreaInput ref="input" v-if="inputType == 'textarea'" :optional="optional" :label="label"
    :placeholder="placeholder" :help-text="helpText" />
</template>

<script lang="ts">
import { beginCell, type Builder } from 'ton-core';
import BaseInput from '../Inputs/BaseInput.vue';
import TextAreaInput from '../Inputs/TextAreaInput.vue';
import TextInput from '../Inputs/TextInput.vue';
import BaseField from './BaseField.vue';

export default {
  extends: BaseField,
  components: {
    TextInput, TextAreaInput
  },
  props: {
    inputType: {
      type: String as () => "text" | "textarea",
      default: "text"
    }
  },
  methods: {
    validate(): boolean {
      return (this.$refs.input as typeof BaseInput).validate()
    },
    store(builder: Builder): void {
      builder.storeRef(beginCell().storeStringRefTail((this.$refs.input as typeof TextInput).value).asCell())
    }
  }
}
</script>