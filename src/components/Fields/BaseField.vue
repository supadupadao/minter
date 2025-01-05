<template>
  <TextInput ref="input" :required="required" :label="label" :placeholder="placeholder" :help-text="helpText" />
</template>

<script lang="ts">
import TextInput from '../Inputs/TextInput.vue';

export default {
  components: {
    TextInput
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
    store(): void {

    }
  }
}
</script>