# extract-changelog-release

[![npm version](https://img.shields.io/npm/v/extract-changelog-release.svg)](https://www.npmjs.com/package/extract-changelog-release)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fnonara%2Fextract-changelog-release%2Fbadge&style=flat)](https://actions-badge.atrox.dev/nonara/extract-changelog-release/goto)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Extract release notes from latest entry in standard-version changelog.

This project can be used for automating GH releases with standard-version — see [GH Actions](#GH-Actions) example.

## Usage

### CLI
```sh
# Extracts from CHANGELOG.md in the current working directory
npx extract-changelog-release

# Extracts from package/CHANGELOG.md relative to CWD
npx extract-changelog-release ./package/CHANGELOG.md

# Extracts from absolute path /path/to/LOG.md
npx extract-changelog-release /path/to/LOG.md
```

#### Example Result
```shell
$ extract-changelog-release
## [3.2.0](https://github.com/LeDDGroup/typescript-transform-paths/compare/v3.1.0...v3.2.0) (2021-08-03)

### Features

* Support transformation via ts-node transpileOnly and compiler API transformNodes (closes [#123](https://github.com/LeDDGroup/typescript-transform-paths/issues/123)) ([dd942fd](https://github.com/LeDDGroup/typescript-transform-paths/commit/dd942fdbf34afcdec8f976a1540746521a758c73))

### Bug Fixes

* Custom JSDoc tags not working for older TS (fixes [#126](https://github.com/LeDDGroup/typescript-transform-paths/issues/126)) ([d4280c3](https://github.com/LeDDGroup/typescript-transform-paths/commit/d4280c3dec4dc9f3834fc98be2e51109422bd9aa))
```

### Programmatic

```ts
import { extractLog } from 'extract-changelog-release';

let releaseNotes: string;

// Extracts from CHANGELOG.md in the current working directory
releaseNotes = extractLog(); 

// Extracts from package/CHANGELOG.md relative to CWD
releaseNotes = extractLog('package/CHANGELOG.md'); 

// Extracts from absolute path /path/to/LOG.md
releaseNotes = extractLog('/path/to/LOG.md');
```

### GH Actions

#### Example config

The following action is triggered when a new version tag is pushed. It will:

- Build
- Test
- Publish to NPM
- Create a GitHub Release based on the latest entry in CHANGELOG.md

`.github/workflows/publish.yml`
```yaml
name: Publish

on:
  push:
    tags:
      - v*.*.*

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js 14.x to publish to npmjs.org
        uses: actions/setup-node@v1
        with:
          node-version: '14.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Install Packages
        run: yarn install --frozen-lockfile

      - name: Build
        run: yarn build

      - name: Test
        run: yarn test
        env:
          CI: true
          
      - name: Generate Release Body
        run: npx extract-changelog-release > RELEASE_BODY.md

      - name: Publish to NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
        
      - name: Create GitHub Release
        uses: ncipollo/release-action@v1
        with:
          bodyFile: "RELEASE_BODY.md"
          token: ${{ secrets.GITHUB_TOKEN }}
```
