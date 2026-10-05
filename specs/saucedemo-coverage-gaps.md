# SauceDemo – coverage gaps

Seed: `tests/e2e/seed.spec.ts` (standard_user logged in on the products page).

Already covered elsewhere: login (valid, wrong password, locked out), add/remove a
product, viewing the cart, checkout happy path, checkout without a first name.

Drafted by the Playwright planner agent, then every expected result below was
checked against the live site before writing the tests.

## 1. Sorting — `tests/e2e/sorting.spec.ts`

- **Name (Z to A)**: first product is "Test.allTheThings() T-Shirt (Red)", last is "Sauce Labs Backpack".
- **Price (low to high)**: $7.99, $9.99, $15.99, $15.99, $29.99, $49.99.

## 2. Product details — `tests/e2e/product-details.spec.ts`

- Opening "Sauce Labs Bike Light" shows its name and $9.99.
- Adding it from the details page, then "Back to products": badge shows 1 and the
  product button says "Remove".

## 3. Menu — `tests/e2e/menu.spec.ts`

- **Logout**: going to `/inventory.html` afterwards shows "You can only access
  '/inventory.html' when you are logged in."
- **Reset App State**: the cart badge disappears.
- **Bug**: after the reset, product buttons still say "Remove" until the page is reloaded.

## 4. Checkout validation — `tests/e2e/checkout.spec.ts`

- No last name → "Error: Last Name is required".
- No postal code → "Error: Postal Code is required".

## 5. problem_user — `tests/e2e/problem-user.spec.ts`

All seen in the browser, kept as `test.fail()`:

- All six products show the same "404" image.
- Choosing a sort option does nothing.
- At checkout, typing the last name overwrites the first name, and the last name stays empty.
- (Also seen: "Add to cart" on the Bolt T-Shirt does nothing. Not automated yet.)
