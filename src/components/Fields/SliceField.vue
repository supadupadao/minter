<template>
  <strong>Slice</strong>

  <article class="message">
    <div class="message-body">
      <div class="field has-addons">
        <div class="control is-expanded">
          <div class="select is-fullwidth">
            <select name="type">
              <option value="string">string</option>
              <option value="uint">uint</option>
              <option value="coins">coins</option>
            </select>
          </div>
        </div>
        <div class="control">
          <button type="submit" class="button is-primary">Add field</button>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { Cell, Builder } from 'ton-core';
import BaseField from './BaseField.vue';
import TextInput from '../Inputs/TextInput.vue';

export default {
  extends: BaseField,
  components: {
    TextInput
  },
  methods: {
    store(builder: Builder): void {
      builder.storeSlice(Cell.fromBase64((this.$refs.input as typeof TextInput).value).asSlice())
    }
  }
}
</script>