<template>
  <div class="field">
    <label class="label">{{ label }}<span v-if="!optional" class="has-text-danger">*</span></label>
    <div class="control">
      <slot>...</slot>
    </div>
    <p v-if="errorText" class="help has-text-danger">{{ errorText }}</p>
    <p v-else class="help">{{ helpText }}</p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    optional: {
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
    errorText: {
      type: String,
    },
  }
}
</script>
