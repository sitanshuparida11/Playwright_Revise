# Playwright Agent Instructions --- SauceDemo POM Automation

## 1. Objective

Build and maintain a reliable Playwright + TypeScript test automation
suite for:

-   Application: https://www.saucedemo.com/
-   Design pattern: Page Object Model (POM)
-   Test runner: `@playwright/test`
-   Language: TypeScript

**Important:** A POM project structure already exists. First inspect the
repository and understand its current conventions. Extend the existing
structure instead of creating a second framework or duplicating files.
Do not replace configuration or restructure the project unless
necessary; explain any proposed structural change before making it.

The goal is to cover positive, negative, and edge cases for login,
inventory/products, sorting, cart, checkout, order completion,
navigation, and session behaviour.

## 2. Instructions for the Playwright agent

Before changing files:

1.  Inspect `package.json`, `playwright.config.ts`, `tsconfig.json`,
    existing `pages/`, `tests/`, fixtures, and helper files.
2.  Identify the existing naming conventions, test directory, reporters,
    browser settings, and POM implementation.
3.  Reuse existing utilities, fixtures, and page objects where
    appropriate.
4.  Check whether a scenario already exists before adding a new test.
5.  Make the smallest change that fits the existing project.
6.  Do not introduce a second Playwright config, duplicate workflow,
    duplicate page object, or unnecessary dependency.
7.  After implementation, run TypeScript type-checking if configured and
    run the relevant Playwright tests. Report commands executed and
    actual results. Do not claim tests passed unless they were run and
    passed.

## 3. Application test data

SauceDemo's standard public demo accounts commonly include:

  -----------------------------------------------------------------------
  Username                            Purpose
  ----------------------------------- -----------------------------------
  `standard_user`                     Standard successful user journey

  `locked_out_user`                   Verify locked-account error

  `problem_user`                      Check application behaviour with a
                                      problem user

  `performance_glitch_user`           Check behaviour when the
                                      application responds slowly

  `error_user`                        Explore known application error
                                      behaviour

  `visual_user`                       Optional visual-regression
                                      exploration
  -----------------------------------------------------------------------

Common demo password: `secret_sauce`

Use these only for this public demo application. Keep credentials
configurable through environment variables when that matches the
existing framework. Do not use real personal or production credentials.
Tests involving intentionally problematic users should assert only
documented/observed behaviour and should not be treated as normal-user
acceptance tests.

## 4. POM design requirements

Use the existing project structure. If no equivalent files exist, create
or adapt page objects along these lines:

-   `LoginPage`: username, password, login button, error message, login
    actions.
-   `InventoryPage`: product list, product names/prices, sort control,
    add/remove product actions, cart navigation, menu actions.
-   `ProductPage` or inventory product helpers: product detail
    navigation and detail-page assertions, only if this separation fits
    the existing app/framework.
-   `CartPage`: cart items, quantities, prices, remove actions, continue
    shopping, checkout.
-   `CheckoutInformationPage`: first name, last name, postal code,
    continue, cancel, validation error.
-   `CheckoutOverviewPage`: overview items, item total, tax, total,
    finish, cancel/back.
-   `CheckoutCompletePage`: completion message and return-to-products
    action.
-   Shared fixture or test helpers: only when useful and consistent with
    the existing project.

### POM rules

1.  Page objects should encapsulate page-specific locators and user
    actions.
2.  Tests should describe business scenarios and contain the main
    assertions.
3.  Avoid placing all assertions and entire test flows inside page
    objects.
4.  Prefer resilient locators: `getByRole`, `getByLabel`, `getByText`,
    and stable test IDs when available.
5.  Avoid brittle selectors based on deep CSS paths or positional XPath
    unless there is no robust alternative.
6.  Use Playwright auto-waiting and web-first assertions. Do not add
    fixed sleeps such as `waitForTimeout()` to solve timing issues
    unless there is a clearly justified diagnostic reason.
7.  Use typed method parameters and return types when they improve
    clarity.
8.  Keep methods small, named by user intent, and reusable.
9.  Do not create a generic utility for a one-off page-specific
    operation.
10. Do not use shared mutable test state across parallel tests.
11. Use a separate browser context/page per test through Playwright
    fixtures unless the existing framework has a well-justified
    alternative.
12. Do not hardcode environment-specific URLs throughout the suite; use
    the existing `baseURL` configuration if present.
13. Keep tests independent and safe to run in parallel.
14. Avoid assertions on unstable implementation details when a
    user-visible outcome can be asserted instead.

## 5. Required positive test cases

Implement the applicable cases below, adapting to the existing test
naming and folder conventions.

### Login

-   `LOGIN-POS-001`: Log in with `standard_user` and verify the
    inventory page is displayed.
-   `LOGIN-POS-002`: Verify the inventory heading and product list are
    visible after login.
-   `LOGIN-POS-003`: Verify product names and prices are displayed.
-   `LOGIN-POS-004`: Log out through the application menu and verify the
    login page is displayed.

### Inventory and sorting

-   `INV-POS-001`: Sort products by name, ascending.
-   `INV-POS-002`: Sort products by name, descending.
-   `INV-POS-003`: Sort products by price, low to high.
-   `INV-POS-004`: Sort products by price, high to low.
-   `INV-POS-005`: Open a product detail page and verify the correct
    product information.
-   `INV-POS-006`: Return from product details to inventory and verify
    the product list is available.

For sorting tests, read the displayed product names or prices and
compare them against a sorted copy of the same values. Do not merely
assert that the dropdown accepted an option.

### Cart

-   `CART-POS-001`: Add one product to the cart and verify the cart
    badge and item.
-   `CART-POS-002`: Add multiple different products and verify all
    expected items are present.
-   `CART-POS-003`: Remove a product from inventory and verify its
    button state and cart state are updated appropriately.
-   `CART-POS-004`: Remove a product from the cart and verify it is no
    longer listed.
-   `CART-POS-005`: Continue shopping from the cart and verify inventory
    is displayed.
-   `CART-POS-006`: Verify the correct product name, price, and quantity
    in the cart.

### Checkout

-   `CHK-POS-001`: Complete checkout with valid first name, last name,
    and postal code.
-   `CHK-POS-002`: Verify checkout overview contains the selected items.
-   `CHK-POS-003`: Verify item total equals the sum of item prices.
-   `CHK-POS-004`: Verify the displayed final total equals item total
    plus displayed tax, using an appropriate numeric comparison.
-   `CHK-POS-005`: Finish checkout and verify the order-completion
    message.
-   `CHK-POS-006`: Return to products after checkout and verify
    inventory is displayed.

## 6. Required negative test cases

### Login validation

-   `LOGIN-NEG-001`: Submit with both username and password empty;
    verify the required-field error.
-   `LOGIN-NEG-002`: Submit with username empty and password populated;
    verify the appropriate error.
-   `LOGIN-NEG-003`: Submit with username populated and password empty;
    verify the appropriate error.
-   `LOGIN-NEG-004`: Submit an invalid username and valid demo password;
    verify login is rejected.
-   `LOGIN-NEG-005`: Submit a valid demo username and invalid password;
    verify login is rejected.
-   `LOGIN-NEG-006`: Submit invalid username and invalid password;
    verify login is rejected.
-   `LOGIN-NEG-007`: Log in as `locked_out_user`; verify the locked-out
    error and that inventory is not opened.

### Checkout validation

-   `CHK-NEG-001`: Attempt to continue with all checkout information
    fields empty; verify validation feedback.
-   `CHK-NEG-002`: Leave first name empty; verify validation feedback.
-   `CHK-NEG-003`: Leave last name empty; verify validation feedback.
-   `CHK-NEG-004`: Leave postal code empty; verify validation feedback.
-   `CHK-NEG-005`: Cancel checkout information and verify the expected
    return page.
-   `CHK-NEG-006`: Cancel from checkout overview and verify the expected
    return page.

For validation tests, assert the user-visible error message or other
clear rejection outcome. Do not assume a particular error string until
it has been confirmed against the running application.

## 7. Required edge cases

-   `EDGE-001`: Open the cart with no products added; verify the cart is
    empty and checkout behaviour is correct for the application.
-   `EDGE-002`: Add a product, remove it, and verify the cart badge and
    cart contents update correctly.
-   `EDGE-003`: Add several products, remove one, and verify the
    remaining products are correct.
-   `EDGE-004`: Add all available products and verify the cart contains
    the expected number of items.
-   `EDGE-005`: Verify the cart badge is absent or has the correct value
    when the cart is empty, based on observed UI behaviour.
-   `EDGE-006`: Navigate to a product detail page and back; verify the
    inventory remains usable.
-   `EDGE-007`: Refresh the inventory page and verify the app remains in
    a valid state; document observed cart/session behaviour rather than
    assuming persistence.
-   `EDGE-008`: Attempt to open a protected inventory URL without
    logging in; verify the application redirects or otherwise blocks
    access as observed.
-   `EDGE-009`: Use browser back/forward navigation during a normal
    journey and verify the page remains functional.
-   `EDGE-010`: Verify product sorting with the full list and ensure the
    resulting order is correct, including prices with decimal values.
-   `EDGE-011`: Verify the cart quantity and item count when the same
    product's add/remove controls are used repeatedly. Assert only
    behaviour supported by the UI.
-   `EDGE-012`: Run independent tests in parallel and confirm there is
    no state leakage between tests.
-   `EDGE-013`: Test checkout with one item and with multiple items.
-   `EDGE-014`: Verify a completed checkout does not leave stale order
    items in the next independent test.
-   `EDGE-015`: Use `performance_glitch_user` for a smoke journey to
    check that the test relies on Playwright waiting/assertions rather
    than fixed sleeps. Set a sensible test timeout only if needed and
    explain why.

### Optional exploratory coverage

-   Investigate `problem_user`, `error_user`, and `visual_user` to
    understand their known demo behaviours.
-   Add tests for their observed behaviour only when the expected result
    is stable and meaningful.
-   Keep these tests clearly labelled as special-user or exploratory
    tests so they do not obscure the core acceptance suite.

## 8. Test structure and naming

Follow the repository's existing structure. If it does not already
define a convention, use descriptive names and group tests by feature,
for example:

-   `tests/login.spec.ts`
-   `tests/inventory.spec.ts`
-   `tests/cart.spec.ts`
-   `tests/checkout.spec.ts`

Use stable test titles that include the behaviour being checked. Use
test IDs from this document in titles or annotations if the current
project supports that convention.

Each test should: 1. Establish its own preconditions. 2. Perform one
main scenario. 3. Assert the expected user-visible result. 4. Avoid
depending on another test having run first. 5. Clean up only when needed
and without hiding a failed assertion.

## 9. Assertions and quality requirements

-   Use `await expect(locator).toBeVisible()`, `toHaveText()`,
    `toHaveURL()`, `toHaveCount()`, `toHaveValue()`, and other suitable
    web-first assertions.
-   For lists, verify actual values and ordering rather than only
    checking that the list exists.
-   For prices, parse displayed currency values carefully and compare
    numeric values. Avoid fragile string arithmetic.
-   For checkout totals, use a small appropriate tolerance for
    floating-point calculations if needed.
-   Prefer accessible, user-facing assertions.
-   Assert negative outcomes explicitly, such as an error message being
    visible and the protected page not being reached.
-   Avoid assertions that pass vacuously because a locator matches zero
    elements unexpectedly.
-   Do not swallow errors or mark a failing test as passed.
-   Do not weaken or delete an assertion simply to make the test green;
    investigate the root cause.

## 10. Execution and reporting

After implementing tests:

1.  Run the relevant test file first.
2.  Run the full suite after the targeted tests are stable.
3.  Run TypeScript type-checking if `tsconfig.json` or package scripts
    support it, for example:
    -   `npx tsc --noEmit`
    -   `npx playwright test`
4.  Use the existing reporter configuration. If HTML reporting is
    already configured, do not add a duplicate reporter.
5.  Inspect failure output, screenshots, traces, and videos when
    available.
6.  Fix genuine test or application-locator issues rather than
    introducing arbitrary delays.
7.  Summarize:
    -   files created or modified;
    -   scenarios covered;
    -   commands executed;
    -   actual pass/fail counts;
    -   any remaining failures, assumptions, or unimplemented cases.

## 11. Definition of done

The task is complete when:

-   The existing POM structure has been reused.
-   Page objects contain reusable locators/actions and tests contain
    scenario-level assertions.
-   Positive, negative, and edge cases listed above are implemented or
    explicitly marked as not applicable, exploratory, or blocked.
-   Tests are independent and suitable for parallel execution.
-   There are no unnecessary duplicate configs, workflows, or
    dependencies.
-   Relevant tests and type-checking have been run where available.
-   The final report accurately describes what was implemented and what
    passed or failed.

## 12. Agent final response format

When finished, provide:

1.  **Structure reviewed**
2.  **Files created/updated**
3.  **Positive cases implemented**
4.  **Negative cases implemented**
5.  **Edge cases implemented**
6.  **Validation commands and actual results**
7.  **Known limitations or follow-up work**

Do not claim full coverage if any listed scenarios remain unimplemented.
