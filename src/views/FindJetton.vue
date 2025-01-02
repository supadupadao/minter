<template>
  <h1 class="title">{{ $t('message.JettonSearch.FindJetton') }}</h1>
  <form>
    <div class="field has-addons">
      <div class="control is-expanded">
        <input v-model="address" class="input is-large" type="text"
          placeholder="UQCjb5hhRggCJMKnfnxDHlvNMGLboRzTYA8XQKvfOmg08wNo">
      </div>
      <div class="control">
        <button class="button is-info is-large" @click="$router.push('/manage/' + address)">
          {{ $t('message.JettonSearch.SearchButton') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
export default {
  setup() {
    return {
      address: "",
    }
  }
}
</script>
