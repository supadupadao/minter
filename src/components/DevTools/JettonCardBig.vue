<template>
  <article class="media">
    <figure class="media-left">
      <p class="image is-128x128">
        <img class="is-rounded" src="https://bulma.io/assets/images/placeholders/128x128.png" />
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1 class="title">{{ parsedMetadata.name }} ({{ parsedMetadata.symbol }})</h1>
        <p>{{ parsedMetadata.description }}</p>
        <p>
          <strong>{{ $t('message.DevTools.AdminAddress') }}</strong
          >:
          <a
            :href="`https://testnet.tonviewer.com/${jettonData.adminAddress?.toString()}`"
            target="_blank"
            >{{ jettonData.adminAddress }}</a
          >
        </p>
        <p>
          <strong>{{ $t('message.DevTools.TotalSupply') }}</strong
          >: {{ jettonData.totalSupply }}
        </p>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import type { JettonMasterData, MetadataDict } from '@/utils/types';

export default {
  props: {
    isCorrectInterface: Boolean,
    parsedMetadata: {
      type: Object as () => MetadataDict,
      required: true,
    },
    jettonData: {
      type: Object as () => JettonMasterData,
      required: true,
    },
  },
};
</script>
