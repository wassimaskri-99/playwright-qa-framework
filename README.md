# playwright-qa-framework

E2E and API test automation built with Playwright and TypeScript.

- **E2E** — [SauceDemo](https://www.saucedemo.com) (login, cart, checkout), using the Page Object Model
- **API** — [restful-booker](https://restful-booker.herokuapp.com) (auth, booking CRUD)

## Structure

```
pages/       Page objects (LoginPage, InventoryPage, CartPage, CheckoutPage)
fixtures/    Custom fixtures (POM injection) and test data
tests/e2e/   UI test specs
tests/api/   API test specs
```

## Running the tests

```bash
npm install
npx playwright install --with-deps chromium
npm test            # everything
npm run test:e2e    # UI only
npm run test:api    # API only
```

## Notes from testing the APIs

A couple of restful-booker behaviors worth knowing before writing assertions against it:

- Authenticating with bad credentials returns **HTTP 200** with a `{ "reason": "Bad credentials" }` body, not a 401.
- A successful `DELETE /booking/{id}` returns **HTTP 201**, not 200/204.
