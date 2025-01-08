<template>
  <div
    class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-4-cols-desktop has-4-cols-widescreen has-4-cols-fullhd">
    <div class="grid is-gap-1">

      <div class="cell is-col-span-4-desktop is-row-span-4-desktop">
        <div class="box container is-fliud is-shadowless has-background-light">
          <h1 class="title">{{ $t('message.DevTools.SearchText') }}</h1>
          <FindContract />
        </div>
      </div>

      <div class="cell is-col-span-4-desktop">
        <div class="box is-shadowless">
          <CardItem emoji="🤔" :title="$t('message.HomeCards.Information.Title')"
            :description="$t('message.HomeCards.Information.Description')" />
        </div>
      </div>

      <div class="cell is-col-span-1-desktop">
        <div class="box is-shadowless has-background-light">
          <CardItem emoji="🛠️" :title="$t('message.HomeCards.InteractContracts.Title')"
            :description="$t('message.HomeCards.InteractContracts.Description')"
            :link-text="$t('message.HomeCards.InteractContracts.LinkText')"
            link-url="/manage/kQC1I2HcAkUSfMCQCezbL9bVtC_kqnX-gQIToAqXJNTP7yVj" />
        </div>
      </div>

      <div class="cell is-col-span-1-desktop">
        <div class="box is-shadowless has-background-light">
          <CardItem emoji="🚀" :title="$t('message.HomeCards.DeployJetton.Title')"
            :description="$t('message.HomeCards.DeployJetton.Description')"
            :link-text="$t('message.HomeCards.DeployJetton.LinkText')" link-url="/deploy/jetton" />
        </div>
      </div>

      <div class="cell is-col-span-1-desktop">
        <div class="box is-shadowless has-background-link-light">
          <CardItem emoji="👨‍💻" :title="$t('message.HomeCards.OpenSource.Title')"
            :description="$t('message.HomeCards.OpenSource.Description')"
            :link-text="$t('message.HomeCards.OpenSource.LinkText')" link-url="https://github.com/supadupadao/minter" />
        </div>
      </div>

      <div class="cell is-col-span-1-desktop">
        <div class="box is-shadowless has-background-danger-light">
          <CardItem emoji="⚠️" :title="$t('message.HomeCards.WorkInProgress.Title')"
            :description="$t('message.HomeCards.WorkInProgress.Description')"
            :link-text="$t('message.HomeCards.WorkInProgress.LinkText')"
            link-url="https://github.com/supadupadao/minter/issues" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.cell {
  display: flex;
}
</style>

<script setup lang="ts">
import CardItem from '@/components/CardItem.vue';
import FindContract from '../components/FindContract.vue';
</script>
