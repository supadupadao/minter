# SupaDupaMinter

[![Deploy status](https://img.shields.io/github/actions/workflow/status/supadupadao/minter/ci.yml?label=CI)](https://github.com/supadupadao/minter/actions/workflows/ci.yml)
[![Build status](https://img.shields.io/github/actions/workflow/status/supadupadao/minter/cd.yml?label=deploy)](https://github.com/supadupadao/minter/actions/workflows/cd.yml)
[![GitHub License](https://img.shields.io/github/license/supadupadao/minter)](https://github.com/supadupadao/minter/blob/master/LICENSE)

ℹ️ Web application for deploying jettons and interacting with TON smart contracts.

❤️ Any contributions are welcome. Feel free to open pull requests, issues, bug reports, feature proposals or anything else

🌍 Last version of application automatically deploys at [minter.supadupa.space](https://minter.supadupa.space) by pushing to `master` branch

📖 [Minter documentation](https://docs.supadupa.space/minter)

# Features

🆕 **Jetton deploy**:

Using this application you can deploy new TON Jetton. This application is based on our Jetton standard implementation written in [Tact language](https://tact-lang.org). This implementation build with goal to store full metadata on-chain and be usable with DAO. [More about this jetton implementation you can read in it's repo](https://github.com/supadupadao/jetton)

🎚️ **Smart contract dev tools**:

This application provides functionality to interact with TON smart contracts. Application fetch contract ABI uploaded using [TON Verifier](https://verifier.ton.org) from IPFS and generate UI for it. At the moment application works only with verified contracts, but in future it will be improved.

[You can see example of jetton management here](https://minter.supadupa.space/manage/kQC1I2HcAkUSfMCQCezbL9bVtC_kqnX-gQIToAqXJNTP7yVj)

# Translation

If you find wrong translation, typo etc, please open Pull Request with fixes. You can find translation files in `src/i18n/` directory.

Supported languages:
- English - `src/i18n/en.json`
- Russian - `src/i18n/ru.json`

# Development

This is default Tact blueprint project with default commands:

- `npm i` - install dependencies and setup project
- `npm run dev` - run development web server with hot reaload compilation
- `npm run build` - check types and compile for production
- `npm run lint` - run [ESLint](https://eslint.org)

## Project structure

- `public/` - directory with public files with access from root directory in deployed website
- `src/` - all source codes of application
  - `assets/` - static assets directory
  - `components/` - Vue components directory
  - `i18n/` - translations files
  - `router/` - vue-router configuration files
  - `utils/` - non-Vue utils
  - `views/` - big Vue components on which vue-router refers to

# License

[GNU Affero General Public License v3.0](https://github.com/supadupadao/minter/blob/master/LICENSE)
