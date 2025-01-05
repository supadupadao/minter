<template extends>
  <BaseLabel :required="required" :label="label" :placeholder="placeholder" :help-text="helpText"
    :error-text="errorText">
    <input v-bind:class="{ 'is-danger': errorText }" @change="validate" v-model="value" class="input" type="number"
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
      }

      return true;
    }
  }
}
</script>
