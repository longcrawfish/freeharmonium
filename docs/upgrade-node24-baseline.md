# Node 24 + pnpm 10 Upgrade Baseline

Issue: `nextjs-starter-16f`
Date: 2026-04-29

## Environment

- Node.js runtime: `v24.14.0`
- Corepack: `0.34.6`
- pnpm from `packageManager`: `10.12.4`
- npm on PATH: `11.9.0`

`pnpm` is not installed directly on PATH in this environment. `corepack pnpm` resolves to the repository `packageManager` version.

## Package Baseline

- `package.json` name/version: `nextjs-starter@2.2.0`
- `packageManager`: `pnpm@10.12.4`
- `engines.node`: `20.x`
- Lockfile version: `pnpm-lock.yaml` uses `lockfileVersion: '9.0'`

Running pnpm under Node 24 reports:

```text
WARN Unsupported engine: wanted: {"node":"20.x"} (current: {"node":"v24.14.0","pnpm":"10.12.4"})
```

## Framework And Tooling

- Next.js: `16.1.1`
- React: `19.2.3`
- React DOM: `19.2.3`
- TypeScript: `5.8.3`
- ESLint: `9.29.0`
- eslint-config-next: `16.0.0`
- `@types/node`: `20.19.1`

## Config Baseline

- `next.config.mjs`
  - Uses `next-intl/plugin`.
  - Configures image `remotePatterns` from `R2_PUBLIC_URL`.
  - Removes console calls in production except `console.error`.
- `.eslintrc.json`
  - Uses legacy config: `{ "extends": "next/core-web-vitals" }`.
  - No flat `eslint.config.*` file is present.
- `tsconfig.json`
  - `target`: `ES2017`
  - `module`: `esnext`
  - `moduleResolution`: `bundler`
  - `strict`: `true`
  - `jsx`: `react-jsx`
  - Includes Next generated route types from `.next/types/**/*.ts` and `.next/dev/types/**/*.ts`.
- `README.md`
  - Prerequisites still document Node.js `20.9 or higher` and pnpm `9.0 or higher`.
  - Code quality section references `pnpm type-check`, but no `type-check` script exists in `package.json`.

## Command Results

### `corepack pnpm install`

Result: passed.

Notes:

- pnpm emitted the Node engine warning because the package currently requires Node `20.x`.
- pnpm attempted an update metadata fetch for pnpm and logged `ERR_PNPM_META_FETCH_FAIL` due registry DNS/network availability, but installation still completed from available cache.
- pnpm 10 ignored build scripts for `sharp` and `unrs-resolver` and suggested `pnpm approve-builds`.
- No lockfile update was required.

### `corepack pnpm lint`

Result: failed.

Output:

```text
> nextjs-starter@2.2.0 lint /home/aiops/my-codes/nextjs-starter
> next lint

Invalid project directory provided, no such directory: /home/aiops/my-codes/nextjs-starter/lint
ELIFECYCLE Command failed with exit code 1.
```

Baseline finding: the lint script still uses `next lint`, which is no longer valid with this Next.js 16 setup. ESLint 9 is installed, but the repository only has legacy `.eslintrc.json` configuration.

### `corepack pnpm build`

Result: passed when run outside the command sandbox.

Notes:

- The first sandboxed build failed with a Turbopack internal error caused by `binding to a port: Operation not permitted`.
- Re-running the same command with sandbox port restrictions removed completed successfully.
- Build warnings included:
  - Node engine warning for `20.x` vs current Node `24.14.0`.
  - Browserslist/caniuse-lite data is 10 months old.
  - Upstash Redis config logs missing `url` and `token` during page generation.

## Upgrade Risks To Address Later

- Update `engines.node` and README prerequisites for the intended Node 24 baseline.
- Replace `next lint` with a Next 16 / ESLint 9 compatible lint command and config.
- Decide whether `@types/node` should move from 20.x to a Node 24-compatible major.
- Add or remove the documented `pnpm type-check` command.
- Review pnpm 10 build-script approval policy for dependencies that need native or postinstall setup.
