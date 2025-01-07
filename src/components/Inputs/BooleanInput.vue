<template extends>
  <BaseLabel :optional="optional" :label="label" :placeholder="placeholder" :help-text="helpText"
    :error-text="errorText">
    <input v-bind:class="{ 'is-danger': errorText }" @change="validate" v-model="value" class="checkbox" type="checkbox"
      :placeholder="placeholder">
  </BaseLabel>
</template>

<script lang="ts">
import BaseInput from './BaseInput.vue';

export default {
  extends: BaseInput,
  methods: {
    validate(): boolean {
      if (this.defaultValidation()) {
        try {
          parseInt(this.value);
        } catch {
          this.errorText = this.$t("Message.Common.NaN");
          return false
        }
      } else {
        return false
      }

      return true;
    }
  }
}
</script>
