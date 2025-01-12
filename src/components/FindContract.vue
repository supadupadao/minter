<template>
  <form>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input
          v-model="address"
          class="input is-medium"
          type="text"
          placeholder="0QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACkT"
        />
      </div>
      <div class="control">
        <button class="button is-info is-medium" @click="$router.push('/manage/' + address)">
          {{ $t('message.DevTools.SearchButton') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
export default {
  setup() {
    return {
      address: '',
    };
  },
};
</script>
