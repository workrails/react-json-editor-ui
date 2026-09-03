# Repo Notes

Working knowledge for this codebase. Read at the start of work; keep it current.

## Run / test / deploy
- `npm ci` also builds `dist/` — the `prepare` script runs `tsdx build`. CI (`.github/workflows/main.yml`) relies on this, then runs `npm run size`.
- Publishing goes to GitHub Packages (`@workrails` scope → `https://npm.pkg.github.com`, see `.npmrc` + `publishConfig`). Versioning is manual: bump `version` in `package.json`, then publish.
- Publish runs in CI (`.github/workflows/publish.yml`): `workflow_dispatch`, or a push to `main` that touches `package.json`. It skips when the version is already in the registry, so re-runs are safe.

## Gotchas
- You cannot publish from a laptop with the usual local `GH_NPM_TOKEN` — that token only carries `read:packages`, and `npm publish` fails with `403 … token provided does not match expected scopes`. Publishing needs a `write:packages` token; CI uses `secrets.GH_RW_TOKEN`, the same secret `workrails/tools` publishes with.
