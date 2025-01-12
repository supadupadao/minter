# Welcome to Minter contributing guide

❤️ We are very grateful for any kind of contibution!

👀 Any contribution you make will be reflected on [minter.supadupa.space](https://minter.supadupa.space)

# Git workflow

We are using [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) for naming commit messages.

In short: add one of following prefix to your commit message:

- `feat:` - for new features
- `fix:` - for bug fixes
- `docs:` - for documentation updates.
- etc

Also add this prefix to PR title because when PR will be merged to master we squash PR commits to single commit with following commit message "{PR title} (#PR id)" (e.g. "feat: add new feature (#69)").

Useful links

- [How to sync fork](docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

# New feature / Bug fixes

If you want to implement new feature or fix bug, please leave message about it in issue with feature request.
If there is no issue related to changes you want to make, please open this issue and write in issue body that you could do it.

We use multiple CI code checks. You can locally check it before push:

1. `npm run build` - check that your code is building
2. `npm run lint` - check your code with static analyzer
3. `npm run format` - to format your code before push

At the moment application doesn't have any tests. You can help with it :)

# Improve translation

If you want suggest more correct translation or fix typo in website texts. You can find translation files in [`src/i18n`](https://github.com/supadupadao/minter/tree/master/src/i18n) directory. There is JSON files with translations:
- [English](https://github.com/supadupadao/minter/blob/master/src/i18n/en.json)
- [Russian](https://github.com/supadupadao/minter/blob/master/src/i18n/ru.json)

# Update docs

If you want to improve project documentation you can find documentation files in [`docs/`](https://github.com/supadupadao/minter/tree/master/docs) directory.

To preview your changes in Gitbook you need push your changes and open Pull Request. In PR checks there will be URL to your changes preview.

<img width="862" alt="Docs preview URL" src="https://github.com/user-attachments/assets/addaf46e-dcde-4db0-8893-1444cbc201af" />

# Anything else

If someone you want to make is not described in this document feel free to open issue
