<template>
  <FieldLabelWrapper
    :label="label"
    :placeholder="placeholder"
    :help-text="helpText"
    :error-text="errorText"
    :optional="true"
  >
    <strong>{{ label }}</strong
    ><br />
    <strong>{{ expected }}</strong> field type is not implemented yet.
  </FieldLabelWrapper>
</template>

<script lang="ts">
import BaseField from './BaseField.vue';

export default {
  extends: BaseField,
  props: {
    expected: {
      type: String,
    },
  },
  methods: {
    validate() {
      return false;
    },
  },
};
</script>
