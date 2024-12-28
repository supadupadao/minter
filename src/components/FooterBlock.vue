<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>SupaDupaDAO</strong>.
        <br />
        {{ $t('message.Footer.WebsiteLicense', { license: "AGPL 3.0" }) }}
        <a href="https://github.com/supadupadao/minter/blob/master/LICENSE">{{ $t('message.Footer.LicenseText') }}</a>.
        <br />
        {{ $t('message.Footer.ContractLicense', { license: "MIT" }) }}
        <a href="https://github.com/supadupadao/jetton/blob/master/LICENSE">{{ $t('message.Footer.LicenseText') }}</a>.
      </p>
    </div>
  </footer>
</template>