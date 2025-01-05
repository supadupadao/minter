<template>
  <BaseLabel :required="required" :label="label" :placeholder="placeholder" :help-text="helpText"
    :error-text="errorText">
    <input v-bind:class="{ 'is-danger': errorText }" v-model="value" @input="validate" class="input" type="text"
      :placeholder="placeholder">
  </BaseLabel>
</template>

<script lang="ts">
import BaseLabel from './BaseLabel.vue';

export default {
  components: {
    BaseLabel
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
    defaultValidation() {
      if (this.required && !this.value) {
        this.errorText = this.$t("message.Common.RequiredField");
        return false
      }

      this.errorText = "";
      return true
    },
    validate(): boolean {
      return this.defaultValidation();
    }
  },
  data() {
    return {
      value: "",
      errorText: ""
    }
  },
}
</script>
