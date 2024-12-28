<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <strong>SupaDupaDAO</strong>.
      <div
        class="fixed-grid has-1-cols-mobile has-1-cols-tablet has-2-cols-desktop has-2-cols-widescreen has-2-cols-fullhd">
        <div class="grid">
          <div class="cell">
            <strong>{{ $t('message.Footer.OurLinks') }}:</strong>
            <br />
            <a href="https://github.com/supadupadao">GitHub</a>
          </div>

          <div class="cell">{{ $t('message.Footer.WebsiteLicense', { license: "AGPL 3.0" }) }}
            <a href="https://github.com/supadupadao/minter/blob/master/LICENSE">{{ $t('message.Footer.LicenseText')
              }}</a>.
            <br />
            {{ $t('message.Footer.ContractLicense', { license: "MIT" }) }}
            <a href="https://github.com/supadupadao/jetton/blob/master/LICENSE">{{ $t('message.Footer.LicenseText')
              }}</a>.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>