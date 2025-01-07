<template>
  <strong>{{ label }}</strong><br />
  <strong>{{ expected }}</strong> field type is not implemented yet.
</template>

<script lang="ts">
import BaseField from './BaseField.vue';

export default {
  extends: BaseField,
  props: {
    expected: {
      type: String,
    }
  },
  methods: {
    validate() {
      return false;
    }
  }
}
</script>
