<template>
  <BaseLabel :required="required" :label="label" :placeholder="placeholder" :help-text="helpText"
    :error-text="errorText">
    <textarea @input="validate" v-bind:class="{ 'is-danger': errorText }" v-model="value" class="textarea" type="text"
      :placeholder="placeholder"></textarea>
  </BaseLabel>
</template>

<script lang="ts">
import BaseInput from './BaseInput.vue';

export default {
  extends: BaseInput,
}
</script>