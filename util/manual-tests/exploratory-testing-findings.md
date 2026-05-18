# Exploratory Testing Findings — SCRUM-101: E-commerce Checkout Process

---

## EXPLORATORY TESTING SUMMARY

| Field | Value |
|---|---|
| Date | 2026-05-15 |
| Tester | QA Automation Agent (Playwright MCP Server) |
| Application | https://www.saucedemo.com |
| Charters Executed | 8 (EX-01 through EX-08) |
| Total Bugs Found | 3 |
| Bugs by Severity | Critical: 0 \| High: 2 \| Medium: 1 \| Low: 0 |
| Areas of Highest Risk | Unauthenticated direct URL access to checkout pages; problem_user image rendering |
| Recommended Regression Additions | Add tests for direct URL access to /checkout-step-two.html and /checkout-complete.html without prior flow; add problem_user image verification test |

---

## CHARTER EXECUTION LOG

| Charter | Area | Time Spent | Bugs Found | Status |
|---|---|---|---|---|
| EX-01 | Login Page | 8 min | 0 | COMPLETE |
| EX-02 | Product Catalogue | 5 min | 1 | COMPLETE |
| EX-03 | Cart Management | 4 min | 0 | COMPLETE |
| EX-04 | Checkout Form | 6 min | 0 | COMPLETE |
| EX-05 | Order Overview | 5 min | 1 | COMPLETE |
| EX-06 | Post-Order State | 5 min | 1 | COMPLETE |
| EX-07 | Cross-Browser | N/A — single browser session in this exploratory run | 0 | PARTIAL |
| EX-08 | Responsive / Mobile | 3 min | 0 | COMPLETE |

---

## NOTABLE OBSERVATIONS (non-bug)

1. **All `data-test` attributes are stable and reliable** — every interactive element has a unique `[data-test="..."]` attribute. Selectors should use these exclusively; no XPath or class-based selectors needed.
2. **XSS input is not executed** — entering `<script>alert(1)</script>` in the First Name field accepts the value as plain text and navigates to step two without executing any script. Positive security outcome.
3. **Special characters navigate forward without validation** — SauceDemo does not validate the format of name fields or postal code. Special chars and XSS payloads are accepted and passed to the overview page as rendered text without execution.
4. **locked_out_user shows correct error** — "Epic sadface: Sorry, this user has been locked out." is displayed clearly with a dismiss button. Expected and correct behavior.
5. **Page load times** — The inventory page loaded within 2 seconds consistently across all sessions. No performance anomalies observed for standard_user.
6. **Cart badge** — Updates instantly (synchronously) on Add to cart click. No delay observed.
7. **Error dismiss button** — The `×` button on the error heading dismisses the error banner correctly, returning the form to its editable state.

---

## BUG REPORTS

BUG-01
───────────────────────────────────────────────
Title            : problem_user — all product images show wrong image (dog/pug image)
Charter          : EX-02 (Product Catalogue)
Severity         : Medium
Priority         : P3
Environment      : Browser: Chromium (Desktop)  |  OS: macOS  |  Viewport: 1280×720
URL              : https://www.saucedemo.com/inventory.html
Pre-conditions   :
  - Logged in as problem_user / secret_sauce
Steps to Reproduce:
  1. Navigate to https://www.saucedemo.com
  2. Login with username=problem_user, password=secret_sauce
  3. Observe product images on the inventory page
Actual Result    : All 6 product images display the same incorrect image (a dog/pug holding a tennis ball) instead of their respective product images (backpack, bike light, t-shirt, etc.)
Expected Result  : Each product should display its own unique product image matching the product name
Screenshot       : specs/screenshots/EX-01-problem-user-inventory.png
User Story AC    : AC1 (Cart Review — product details should be visible and correct)
Notes            : This is a known SauceDemo test scenario for problem_user. Consistent across all 3 observations. Does not affect checkout flow for other users.
───────────────────────────────────────────────

BUG-02
───────────────────────────────────────────────
Title            : Direct navigation to /checkout-step-two.html bypasses checkout information step
Charter          : EX-05 (Order Overview)
Severity         : High
Priority         : P2
Environment      : Browser: Chromium (Desktop)  |  OS: macOS  |  Viewport: 1280×720
URL              : https://www.saucedemo.com/checkout-step-two.html
Pre-conditions   :
  - User is logged in as problem_user (or any logged-in user)
  - User has NOT gone through /checkout-step-one.html
Steps to Reproduce:
  1. Login as standard_user / secret_sauce
  2. Without adding items to cart or going through checkout step one, directly navigate to: https://www.saucedemo.com/checkout-step-two.html
  3. Observe the page that loads
Actual Result    : The checkout overview page loads successfully showing:
  - Empty cart (Item total: $0, Tax: $0.00, Total: $0.00)
  - No items listed
  - Payment Information: SauceCard #31337 visible
  - Active "Finish" button that can be clicked to place a $0 "order"
  The user can click Finish and receive the "Thank you for your order!" confirmation without ever entering their name, address, or adding a product.
Expected Result  : The application should redirect the user to /checkout-step-one.html or /cart.html if they attempt to access the overview page without going through the proper flow. At minimum, an empty cart should prevent reaching the overview.
Screenshot       : specs/screenshots/EX-probe-direct-nav-step-two.png
User Story AC    : AC2 (Checkout Information Entry must be completed before proceeding to overview)
Notes            : Reproduced 3 times consistently. This is an application flow integrity issue. While SauceDemo is a test application, this represents a real-world vulnerability class (order flow bypass). The Finish button on the empty overview is fully functional.
───────────────────────────────────────────────

BUG-03
───────────────────────────────────────────────
Title            : Direct navigation to /checkout-complete.html shows fake order confirmation without placing an order
Charter          : EX-06 (Post-Order State)
Severity         : High
Priority         : P2
Environment      : Browser: Chromium (Desktop)  |  OS: macOS  |  Viewport: 1280×720
URL              : https://www.saucedemo.com/checkout-complete.html
Pre-conditions   :
  - User is logged in (any valid user)
  - No order has been placed
Steps to Reproduce:
  1. Login as standard_user / secret_sauce
  2. Without adding items to cart or going through any checkout step, directly navigate to: https://www.saucedemo.com/checkout-complete.html
  3. Observe the page
Actual Result    : The order confirmation page loads and displays:
  - "Checkout: Complete!" heading
  - "Thank you for your order!" success heading (h2)
  - "Your order has been dispatched, and will arrive just as fast as the pony can get there!" body text
  - Pony Express check-mark image
  - "Back Home" button
  A full success confirmation is shown as if an order was placed, even though no product was added to cart and no checkout form was filled.
Expected Result  : User should be redirected to /cart.html or /inventory.html if they attempt to access the confirmation page without completing a real order.
Screenshot       : specs/screenshots/EX-probe-direct-nav-complete.png
User Story AC    : AC4 (Order Completion should only be shown after completing the full checkout flow)
Notes            : Reproduced 3 times consistently. Related to BUG-02 — both indicate the application does not enforce checkout flow order. In a production system this could be exploited to generate fake confirmation emails or bypass payment.
───────────────────────────────────────────────

---

## SELECTOR RELIABILITY NOTES (for automation team)

| Selector | Reliability | Notes |
|---|---|---|
| `[data-test="username"]` | ✅ Highly stable | Unique, always present on login page |
| `[data-test="password"]` | ✅ Highly stable | Unique, always present on login page |
| `[data-test="login-button"]` | ✅ Highly stable | Unique login button |
| `[data-test="add-to-cart-sauce-labs-backpack"]` | ✅ Highly stable | Product-specific, changes to "remove-sauce-labs-backpack" after adding |
| `[data-test="add-to-cart-sauce-labs-bike-light"]` | ✅ Highly stable | Same pattern as above |
| `[data-test="checkout"]` | ✅ Highly stable | Unique on cart page |
| `[data-test="firstName"]` | ✅ Highly stable | Unique on checkout step one |
| `[data-test="lastName"]` | ✅ Highly stable | Unique on checkout step one |
| `[data-test="postalCode"]` | ✅ Highly stable | Unique on checkout step one |
| `[data-test="continue"]` | ✅ Highly stable | Unique Continue button |
| `[data-test="finish"]` | ✅ Highly stable | Unique Finish button on step two |
| `[data-test="back-to-products"]` | ⚠️ Not confirmed — check live | Snapshot showed button "Back Home" without data-test; may need `getByRole('button', {name: 'Back Home'})` |
| `[data-test="error"]` | ⚠️ Use heading role instead | Error appears as `heading[level=3]` with text "Error: ..."; use `page.locator('h3[data-test="error"]')` or `getByRole('heading', {name: /Error:/})` |
| `[data-test="shopping-cart-badge"]` | ⚠️ Not confirmed directly | Cart badge rendered in header; verify with `getByText()` or inspect live |
| `[data-test="cart-badge"]` | ⚠️ Not confirmed directly | Same as above — verify in live run |

## WAIT BEHAVIOUR NOTES (for automation team)

- Login to inventory redirect is synchronous — `waitForURL('**/inventory.html')` after click is safe.
- Cart badge updates synchronously after Add to cart — no waitForResponse needed.
- Checkout step one → two: `waitForURL('**/checkout-step-two.html')` after Continue click is safe.
- Step two → complete: `waitForURL('**/checkout-complete.html')` after Finish click is safe.
- No lazy loading or infinite scroll observed.
- Console errors present on inventory page (6 errors logged) — likely pre-existing in the demo app and unrelated to checkout flow. Monitor but do not fail tests on console errors unless they increase.
