<template>
  <form>
    <div class="field">
      <label class="label">Jetton name</label>
      <div class="control">
        <input class="input" type="text" placeholder="e.g. SupaDupaJetton">
      </div>
      <p class="help">It will be full name of jetton</p>
    </div>

    <div class="field">
      <label class="label">Symbol</label>
      <div class="control">
        <input class="input" type="text" placeholder="e.g. JTTN">
      </div>
      <p class="help">Short jetton code for wallets. Usually couple of symbols</p>
    </div>

    <div class="field">
      <label class="label">Description</label>
      <div class="control">
        <textarea class="textarea" placeholder="This is the best token in The Open Network!!!"></textarea>
      </div>
      <p class="help">Description of your jetton</p>
    </div>

    <div class="field">
      <label class="label">Max supply</label>
      <div class="control">
        <input class="input" type="number" placeholder="100500">
      </div>
      <p class="help">How many tokens will be allowed to mint</p>
    </div>

    <div class="control">
      <button class="button is-link">Deploy</button>
    </div>
  </form>
</template>
