<template>
  <FieldLabelWrapper
    :label="label"
    :help-text="helpText"
    :error-text="errorText"
    :optional="optional"
  >
    <input class="input" type="text" :placeholder="placeholder" v-model="value" />
  </FieldLabelWrapper>
</template>

<script lang="ts">
import FieldLabelWrapper from './FieldLabelWrapper.vue';

export default {
  components: {
    FieldLabelWrapper,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
    },
    helpText: {
      type: String,
    },
    optional: {
      type: Boolean,
    },
  },
  data() {
    return {
      errorText: '',
      value: '',
    };
  },
  methods: {
    validate(): boolean {
      if (!this.optional && !this.value) {
        this.errorText = this.$t('message.Fields.Errors.RequiredField');
        return false;
      }

      this.errorText = '';
      return true;
    },
    store(): void {
      // TODO
    },
  },
};
</script>
