<template>
  <form>
    <div class="field">
      <label class="label">{{ $t("message.NewJettonForm.JettonName_Label") }}</label>
      <div class="control">
        <input class="input" type="text" :placeholder="$t('message.NewJettonForm.JettonName_Placeholder')">
      </div>
      <p class="help">{{ $t("message.NewJettonForm.JettonName_HelpText") }}</p>
    </div>

    <div class="field">
      <label class="label">{{ $t("message.NewJettonForm.JettonSymbol_Label") }}</label>
      <div class="control">
        <input class="input" type="text" :placeholder="$t('message.NewJettonForm.JettonSymbol_Placeholder')">
      </div>
      <p class="help">{{ $t("message.NewJettonForm.JettonSymbol_HelpText") }}</p>
    </div>

    <div class="field">
      <label class="label">{{ $t("message.NewJettonForm.JettonDescription_Label") }}</label>
      <div class="control">
        <textarea class="textarea" :placeholder="$t('message.NewJettonForm.JettonDescription_Placeholder')"></textarea>
      </div>
      <p class="help">{{ $t("message.NewJettonForm.JettonDescription_HelpText") }}</p>
    </div>

    <div class="field">
      <label class="label">{{ $t("message.NewJettonForm.JettonMaxSupply_Label") }}</label>
      <div class="control">
        <input class="input" type="number" :placeholder="$t('message.NewJettonForm.JettonMaxSupply_Placeholder')">
      </div>
      <p class="help">{{ $t("message.NewJettonForm.JettonMaxSupply_HelpText") }}</p>
    </div>

    <div class="control">
      <button class="button is-link">{{ $t("message.NewJettonForm.DeployJetton") }}</button>
    </div>
  </form>
</template>
