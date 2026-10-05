# CRM app (DevExtreme UI Template Gallery)

The Angular package of DevExpress's [DevExtreme UI Template Gallery](https://github.com/DevExpress/devextreme-ui-template-gallery), used here as an app under test. MIT license, see [LICENSE.md](LICENSE.md). The DevExtreme library itself needs a commercial license outside of evaluation.

Changes from the original:

- `src/app/services/auth.service.ts`: real demo sign-in (`jheart@dx-email.com` / `password`), the session is kept in `sessionStorage`, logout ends it, and the route guard redirects to sign-in.
- The login form no longer pre-fills the demo credentials.
- pnpm `catalog:` versions replaced with plain versions so it installs with npm. Lint and Karma tooling removed (the tests live in Playwright at the repo root).

```bash
npm ci
npm start -- --port 4300
```
