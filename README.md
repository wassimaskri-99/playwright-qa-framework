# playwright-qa-framework

E2E and API test automation built with Playwright and TypeScript.

- **E2E** — [SauceDemo](https://www.saucedemo.com) (login, cart, checkout), using the Page Object Model
- **API** — [restful-booker](https://restful-booker.herokuapp.com) (auth, booking CRUD)
- **BDD** — the same SauceDemo flows described as Gherkin scenarios and run with [playwright-bdd](https://github.com/vitalets/playwright-bdd), reusing the same page objects and fixtures as the plain E2E suite

## Structure

```
pages/       Page objects (LoginPage, InventoryPage, CartPage, CheckoutPage)
fixtures/    Custom fixtures (POM injection) and test data
tests/e2e/   UI test specs
tests/api/   API test specs
features/    Gherkin scenarios (.feature)
steps/       Step definitions, backed by the same page objects
```

The BDD layer isn't a separate test suite — the step definitions call into the exact same `LoginPage` / `InventoryPage` / `CartPage` / `CheckoutPage` objects used by `tests/e2e`. Gherkin scenarios are compiled into native Playwright tests under `.features-gen/` (generated, gitignored) before each run.

## Running the tests

```bash
npm install
npx playwright install --with-deps chromium
npm test            # everything (e2e + api + bdd)
npm run test:e2e    # UI only
npm run test:api    # API only
npm run test:bdd    # Cucumber scenarios only
```

## Notes from testing the APIs

A couple of restful-booker behaviors worth knowing before writing assertions against it:

- Authenticating with bad credentials returns **HTTP 200** with a `{ "reason": "Bad credentials" }` body, not a 401.
- A successful `DELETE /booking/{id}` returns **HTTP 201**, not 200/204.
