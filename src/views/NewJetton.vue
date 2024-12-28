<template>
  <div
    class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-4-cols-desktop has-4-cols-widescreen has-4-cols-fullhd">
    <div class="grid is-gap-3">
      <div class="cell">
        <JettonForm />
      </div>
      <div class="cell is-col-span-2">
        <CardItem emoji="🤔" :title="$t('message.NewJettonCards.WhatIsIt.Title')"
          :description="$t('message.NewJettonCards.WhatIsIt.Description')" bulma-color="is-info" />
      </div>
      <div class="cell">
        <CardItem emoji="👨‍💻" :title="$t('message.NewJettonCards.OpenSource.Title')"
          :description="$t('message.NewJettonCards.OpenSource.Description')"
          :link-text="$t('message.NewJettonCards.OpenSource.LinkText')" link-url="https://github.com/supadupadao/jetton"
          bulma-color="is-link" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardItem from '@/components/CardItem.vue';
import JettonForm from '@/components/JettonForm.vue';
</script>
