<template>
  <article class="media box is-shadowless has-background-light">
    <figure class="media-left">
      <p class="image is-64x64">
        <img class="is-rounded" src="https://bulma.io/assets/images/placeholders/128x128.png" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ jettonName }}</strong><br />
          <small>{{ jettonMaxSupply }} {{ jettonSymbol }}</small><br />
          <small>{{ jettonDescription }}</small>
        </p>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
export default {
  props: {
    jettonName: String,
    jettonDescription: String,
    jettonSymbol: String,
    jettonMaxSupply: Number,
  }
}
</script>
