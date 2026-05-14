# Template Release Checklist

Use this checklist before publishing or reusing this starter as the base for a
new project.

## 1. Clone And Prepare

- [ ] Clone the template repository.

  ```bash
  git clone https://github.com/weijunext/nextjs-starter.git new-project
  cd new-project
  ```

- [ ] Update Git remotes for the new project.

  ```bash
  git remote -v
  git remote set-url origin <new-repository-url>
  ```

- [ ] Confirm the project identity is updated where needed:
  - [ ] `package.json` name and version
  - [ ] `config/site.ts`
  - [ ] `README.md` and localized README files
  - [ ] `public/` logos, icons, and Open Graph assets

## 2. Runtime And Package Manager

- [ ] Use a supported Node.js version.

  ```bash
  node --version
  ```

  Expected range: `>=20 <25`.

- [ ] Enable Corepack and activate the pinned pnpm version.

  ```bash
  corepack enable
  corepack prepare pnpm@10.12.4 --activate
  pnpm --version
  ```

  Expected pnpm version: `10.12.4`.

## 3. Environment Setup

- [ ] Create the local environment file.

  ```bash
  cp -f .env.example .env
  ```

- [ ] Fill required environment variables for the target project.
- [ ] Confirm optional integrations are either configured or intentionally blank:
  - [ ] Analytics IDs
  - [ ] Newsletter/email provider settings
  - [ ] Upstash Redis settings
  - [ ] Storage/image host settings

## 4. Install Dependencies

- [ ] Install dependencies with pnpm.

  ```bash
  pnpm install
  ```

- [ ] Review any `Ignored build scripts` warning before running:

  ```bash
  pnpm approve-builds
  ```

- [ ] Confirm `pnpm-lock.yaml` changes are expected before committing.

## 5. Quality Gates

- [ ] Run lint.

  ```bash
  pnpm lint
  ```

  Expected result: exit code `0` with no errors.

- [ ] Run the production build.

  ```bash
  pnpm build
  ```

  Expected result: exit code `0`.

- [ ] Review build warnings and decide whether they are acceptable for release.
  Common warnings to review:
  - [ ] Browserslist/caniuse-lite data age
  - [ ] Missing optional service configuration during static generation
  - [ ] pnpm build-script approval messages

## 6. Local Runtime Check

- [ ] Start the development server.

  ```bash
  pnpm dev
  ```

- [ ] Open `http://localhost:3000`.
- [ ] Smoke test the main user-facing paths:
  - [ ] Home page
  - [ ] Locale switching
  - [ ] Blog list and blog detail pages
  - [ ] Static content pages
  - [ ] Theme toggle
  - [ ] Newsletter or contact flows, if enabled

## 7. Deployment Checks

- [ ] Configure deployment environment variables in the hosting provider.
- [ ] Confirm the production Node.js version matches the supported range.
- [ ] Confirm the hosting provider uses pnpm through Corepack or the pinned
      package manager version.
- [ ] Run a preview deployment.
- [ ] Verify preview deployment routes:
  - [ ] `/`
  - [ ] Locale home pages
  - [ ] Blog pages
  - [ ] `/robots.txt`
  - [ ] `/sitemap.xml`
  - [ ] API routes used by enabled integrations
- [ ] Check production logs for missing environment variables or runtime errors.

## 8. Release Handoff

- [ ] Commit documentation and configuration updates.
- [ ] Push the release branch.
- [ ] Tag the release, if the project uses tags.
- [ ] Record known warnings or intentionally disabled integrations.
- [ ] Share the preview or production URL with the project owner.
