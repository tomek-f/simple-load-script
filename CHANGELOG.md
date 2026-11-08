# changelog

## 3.0.0 (TO BE RELEASED)

- update deps
- switch to pnpm
- move tests from vitest to node:test and node:assert/strict
- remove vitest dev dependency
- fix script load errors to reject with an `Error` instance instead of the raw DOM event
- use node 26
- rename test files
- fix changelog typos
- **BREAKING CHANGE** load error message now includes the url (`Loading script error: <url>`), and the DOM event is available as `err.cause`
- **BREAKING CHANGE** empty string url is rejected (same as `{ url: '' }`)
- add `signal` option (`AbortSignal`) to cancel waiting or set a timeout with `AbortSignal.timeout(ms)`
- fix promise never settling when the script tag was removed by someone else before load/error (with `removeScript: true`)
- fix `simpleLoadScript(null)` rejecting with a `TypeError` instead of the config error
- remove event listeners after the script loads, fails or is aborted
- fix CommonJS types (`export =`) and split `exports` types for `import`/`require`
- add `sideEffects: false`
- move Node requirement from `engines` to `devEngines.runtime` (browser library; Node version only matters for development)
- remove author url
- add `check-package` script and CI job (publint + attw)
- tests: use `assert.rejects` (some error tests passed even when nothing was thrown), add a shared `mockScriptLoad` helper, add tests for missing cases
- type check `src` without Node types (`tsconfig.src.json`)
- remove React-related rules from oxlint config
- README: fix `removeScript` and `url` docs, add install, return value, errors, array order, cancel/timeout, CommonJS and UMD sections
- README: fix CI badge alt text

## 2.2.0

- update oxlint and add a config file
- add oxfmt
- remove prettier
- remove eslint configs
- format code
- fix oxlint issues

## 2.1.1

- update changelog

## 2.1.0

- add action status badge
- use oxlint instead of ESLint (leave config file)
- update deps

## 2.0.0

- **BREAKING CHANGE** exported files paths
- **BREAKING CHANGE** `jsonp` removed from Config
- **BREAKING CHANGE** `callBackName` removed from Config
- **BREAKING CHANGE** `removeScript` changes - script is not removed by default on an error
- **BREAKING CHANGE** `callBack` removed from Config - just run code after simpleLoadScript run (eg. `console.log` in examples)
- TS
- rollup
- deps
- tests
- readme

## 1.0.3

- update 2do
- update readme
- update dev deps

## 1.0.2

- added `insertInto` config option

## 1.0.1

- rename index.js
- readme
- changes in `all` method

## 1.0.0

- `dontRemoveCallBack` and `removeScript`
- readme
- removed ES6 version

## 0.0.0

- init version
