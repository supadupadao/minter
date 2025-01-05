<template>
  <div
    class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-4-cols-desktop has-4-cols-widescreen has-4-cols-fullhd">
    <div class="grid is-gap-1">
      <div class="cell is-col-span-4-desktop is-row-span-4-desktop">
        <div class="box container is-fliud is-shadowless has-background-light">
          <h1 class="title">{{ $t('message.JettonSearch.FindJetton') }}</h1>
          <FindJetton />
        </div>
      </div>
      <div class="cell is-col-span-3-desktop is-row-span-4-desktop">
        <div class="box container is-fliud is-shadowless has-background-light">
          <h1 class="title">{{ $t('message.pageTitles.NewJetton') }}</h1>
          <JettonDeployForm />
        </div>
      </div>
      <div class="cell">
        <div class="">
          <JettonExample jetton-name="Example name" jetton-description="An example of jetton description"
            :jetton-max-supply=1337 jetton-symbol="SMBL" />
        </div>
      </div>
      <div class="cell">
        <div class="box is-shadowless has-background-danger-light">
          <CardItem emoji="⚠️" :title="$t('message.NewJettonCards.WorkInProgress.Title')"
            :description="$t('message.NewJettonCards.WorkInProgress.Description')"
            :link-text="$t('message.NewJettonCards.WorkInProgress.LinkText')"
            link-url="https://github.com/supadupadao/minter/issues" />
        </div>
      </div>
      <div class="cell is-row-span-2-desktop">
        <div class="box is-shadowless has-background-primary-light">
          <CardItem emoji="🤔" :title="$t('message.NewJettonCards.WhatIsIt.Title')"
            :description="$t('message.NewJettonCards.WhatIsIt.Description')" />
        </div>
      </div>
      <div class="cell is-col-span-2-desktop">
        <div class="box is-shadowless has-background-info-light">
          <CardItem emoji="⛓️" :title="$t('message.NewJettonCards.Decentralized.Title')"
            :description="$t('message.NewJettonCards.Decentralized.Description')" />
        </div>
      </div>
      <div class="cell">
        <div class="box is-shadowless has-background-light">
          <CardItem emoji="🛠️" :title="$t('message.NewJettonCards.Managable.Title')"
            :description="$t('message.NewJettonCards.Managable.Description')" />
        </div>
      </div>
      <div class="cell">
        <div class="box is-shadowless has-background-link-light">
          <CardItem emoji="👨‍💻" :title="$t('message.NewJettonCards.OpenSource.Title')"
            :description="$t('message.NewJettonCards.OpenSource.Description')"
            :link-text="$t('message.NewJettonCards.OpenSource.LinkText')"
            link-url="https://github.com/supadupadao/jetton" />
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
import JettonExample from '@/components/JettonDeploy/JettonExample.vue';
import JettonDeployForm from '@/components/JettonDeploy/JettonDeployForm.vue';
import FindJetton from './FindJetton.vue';
</script>
