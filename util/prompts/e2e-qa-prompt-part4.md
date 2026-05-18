# E2E QA Prompt — Part 4 of 5: Test Data & Automation Scripts

**Part** : 4 of 5 | **Agent** : playwright-test-generator | **Steps covered** : Steps 4–5

---

## Pipeline Overview

| Part | File | Agent | Steps | Focus |
|---|---|---|---|---|
| Part 1 | `e2e-qa-prompt-part1.md` | Playwright MCP Server | Step 1 | Derive manual test cases from user story |
| Part 2 | `e2e-qa-prompt-part2.md` | Playwright Test Planner | Step 2 | Build structured E2E test plan |
| Part 3 | `e2e-qa-prompt-part3.md` | Playwright MCP Server | Step 3 | Exploratory testing + bug reports |
| **Part 4 — this file** | `e2e-qa-prompt-part4.md` | playwright-test-generator | Steps 4–5 | Test data JSON + POM automation scripts |
| Part 5 | `e2e-qa-prompt-part5.md` | playwright-test-healer | Steps 6–7 | Test healing + final test report |

**Execute parts strictly in order. Do not begin a part until all outputs of the previous part exist on disk.**

---

## Inputs Required

| File | Source |
|---|---|
| `specs/ecom-checkout-test-plan.md` | Output of Part 2 |
| `specs/exploratory-testing-findings.md` | Output of Part 3 — read for selector observations and UI quirks |

## Outputs Produced by This Part

| File | Content |
|---|---|
| `tests/data/checkout-test-data.json` | Single source of truth for all test input and expected output values |
| `tests/pages/BasePage.ts` | Shared base page object |
| `tests/pages/LoginPage.ts` | Login page actions & assertions |
| `tests/pages/InventoryPage.ts` | Product listing actions & assertions |
| `tests/pages/CartPage.ts` | Cart page actions & assertions |
| `tests/pages/CheckoutStepOnePage.ts` | Checkout info form actions & assertions |
| `tests/pages/CheckoutStepTwoPage.ts` | Order overview actions & assertions |
| `tests/pages/CheckoutCompletePage.ts` | Confirmation page actions & assertions |
| `tests/helpers/TestDataHelper.ts` | Utility to load test data from JSON |
| `tests/checkout/*.spec.ts` | All 19 automation spec files |

---

## How to Use This Part

1. Confirm `specs/ecom-checkout-test-plan.md` and `specs/exploratory-testing-findings.md` both exist on disk.
2. Paste this file into the **playwright-test-generator** agent chat.
3. The agent creates the test data JSON, all POM files, and all spec files in order.
4. Verify all output files exist and the happy-path spec passes before proceeding to Part 5.

---

## STEP 4 — Generate the Test Data JSON File

Create the file:

```
tests/data/checkout-test-data.json
```

The file must contain a top-level key for **every scenario** referenced in the test plan.
Each scenario key must include all input values and expected output values used in that scenario.

### Required JSON structure

```json
{
  "credentials": {
    "username": "standard_user",
    "password": "secret_sauce"
  },
  "products": {
    "backpack":      { "name": "Sauce Labs Backpack",      "price": "$29.99" },
    "bikeLight":     { "name": "Sauce Labs Bike Light",    "price": "$9.99"  },
    "fleeceJacket":  { "name": "Sauce Labs Fleece Jacket", "price": "$49.99" }
  },
  "happyPath": {
    "scenarioId": "HP-01",
    "checkoutInfo": {
      "firstName": "John",
      "lastName":  "Doe",
      "zipCode":   "12345"
    },
    "orderSummary": {
      "itemTotal": "$89.97",
      "tax":       "$7.20",
      "total":     "$97.17",
      "payment":   "SauceCard #31337",
      "shipping":  "Free Pony Express Delivery!"
    },
    "confirmation": {
      "heading":    "Thank you for your order!",
      "subheading": "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
    }
  },
  "negativeAllEmpty": {
    "scenarioId": "NE-01",
    "checkoutInfo": { "firstName": "", "lastName": "", "zipCode": "" },
    "expectedErrors": ["First Name is required"]
  },
  "negativeFirstNameEmpty": {
    "scenarioId": "NE-02",
    "checkoutInfo": { "firstName": "", "lastName": "Doe", "zipCode": "12345" },
    "expectedErrors": ["First Name is required"]
  },
  "negativeLastNameEmpty": {
    "scenarioId": "NE-03",
    "checkoutInfo": { "firstName": "John", "lastName": "", "zipCode": "12345" },
    "expectedErrors": ["Last Name is required"]
  },
  "negativeZipEmpty": {
    "scenarioId": "NE-04",
    "checkoutInfo": { "firstName": "John", "lastName": "Doe", "zipCode": "" },
    "expectedErrors": ["Postal Code is required"]
  },
  "negativeSpecialChars": {
    "scenarioId": "NE-05",
    "checkoutInfo": { "firstName": "J@hn!", "lastName": "D#e$", "zipCode": "!@#$%" },
    "_note": "SauceDemo does not enforce format validation on checkout fields — special characters are accepted and the form proceeds normally. This scenario verifies the app does NOT crash or corrupt state when given special-char input. Assert that the overview page loads successfully with no JS error."
  },
  "negativeLongStrings": {
    "scenarioId": "NE-06",
    "checkoutInfo": {
      "firstName": "Aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff1234567890AB",
      "lastName":  "Zzzzzzzzzzyyyyyyyyyyxxxxxxxxxxwwwwwwwwwwvvvvvvvvvvuuuuuuuuuu1234567890ZZ",
      "zipCode":   "123456789012345678901234567890123456789012345678901234567890123456789012"
    }
  },
  "edgeSingleChar": {
    "scenarioId": "EC-01",
    "checkoutInfo": { "firstName": "A", "lastName": "B", "zipCode": "1" }
  },
  "edgeNumericNames": {
    "scenarioId": "EC-02",
    "checkoutInfo": { "firstName": "12345", "lastName": "67890", "zipCode": "00000" }
  },
  "edgeSingleProduct": {
    "scenarioId": "EC-03",
    "product": { "name": "Sauce Labs Backpack", "price": "$29.99" },
    "checkoutInfo": { "firstName": "Jane", "lastName": "Smith", "zipCode": "90210" }
  },
  "edgeCartBadge": {
    "scenarioId": "EC-04",
    "productsToAdd": ["Sauce Labs Backpack", "Sauce Labs Bike Light", "Sauce Labs Fleece Jacket"],
    "expectedBadgeCount": "3"
  },
  "navCancelStepOne": {
    "scenarioId": "NF-01",
    "checkoutInfo": { "firstName": "John", "lastName": "Doe", "zipCode": "12345" },
    "expectedLandingPage": "/cart.html"
  },
  "navCancelStepTwo": {
    "scenarioId": "NF-02",
    "checkoutInfo": { "firstName": "John", "lastName": "Doe", "zipCode": "12345" },
    "expectedLandingPage": "/inventory.html"
  },
  "navContinueShopping": {
    "scenarioId": "NF-03",
    "expectedLandingPage": "/inventory.html"
  },
  "navBackHome": {
    "scenarioId": "NF-04",
    "expectedLandingPage": "/inventory.html",
    "cartShouldBeEmpty": true
  },
  "uiCartPage": {
    "scenarioId": "UI-01",
    "expectedElements": [
      "QTY label",
      "DESCRIPTION label",
      "Continue Shopping button",
      "Checkout button"
    ]
  },
  "uiCheckoutStepOne": {
    "scenarioId": "UI-02",
    "expectedLabels":       ["First Name", "Last Name", "Zip/Postal Code"],
    "expectedPlaceholders": ["First Name", "Last Name", "Zip/Postal Code"],
    "expectedButtons":      ["Cancel", "Continue"]
  },
  "uiCheckoutStepTwo": {
    "scenarioId": "UI-03",
    "expectedSections": ["Payment Information", "Shipping Information", "Price Total"],
    "expectedButtons":  ["Cancel", "Finish"]
  },
  "uiConfirmation": {
    "scenarioId": "UI-04",
    "expectedHeading": "Thank you for your order!",
    "expectedButton":  "Back Home"
  }
}
```

### JSON rules

- Every spec file MUST import its data from `tests/data/checkout-test-data.json` using the relevant top-level key.
- No hard-coded strings inside spec files — all values come from the JSON.
- Keep the JSON file as the **single source of truth** for all test inputs and expected outputs.

---

## STEP 5 — Generate Automation Scripts Using the `playwright-test-generator` Agent

### 5.1 Purpose

Using the test plan from `specs/ecom-checkout-test-plan.md`, the test data JSON from Step 4, and the selector and behaviour insights from `specs/exploratory-testing-findings.md`, the **`playwright-test-generator`** agent must generate production-ready Playwright automation scripts organised as a **Page Object Model (POM)** framework.

### 5.2 Pre-conditions

1. Parts 1–3 are complete and all their output files exist.
2. `specs/ecom-checkout-test-plan.md` exists and is fully populated.
3. `tests/data/checkout-test-data.json` exists with all scenario keys (created in Step 4).
4. `specs/exploratory-testing-findings.md` exists — the agent MUST read this file to learn which selectors proved reliable and which application behaviours require special wait handling.

### 5.3 POM Framework Structure

The agent MUST create the following directory and file layout. Do not deviate from these paths or names.

```
tests/
├── data/
│   └── checkout-test-data.json          ← already created in Step 4
├── pages/
│   ├── BasePage.ts                      ← shared helpers (navigate, waitForLoad, takeScreenshot)
│   ├── LoginPage.ts                     ← login page actions & assertions
│   ├── InventoryPage.ts                 ← product listing actions & assertions
│   ├── CartPage.ts                      ← cart page actions & assertions
│   ├── CheckoutStepOnePage.ts           ← checkout info form actions & assertions
│   ├── CheckoutStepTwoPage.ts           ← order overview actions & assertions
│   └── CheckoutCompletePage.ts         ← confirmation page actions & assertions
├── helpers/
│   └── TestDataHelper.ts               ← utility to load & type test data from JSON
├── checkout/
│   ├── happy-path-complete-checkout.spec.ts
│   ├── negative-all-fields-empty.spec.ts
│   ├── negative-first-name-empty.spec.ts
│   ├── negative-last-name-empty.spec.ts
│   ├── negative-zip-empty.spec.ts
│   ├── negative-special-chars.spec.ts
│   ├── negative-long-strings.spec.ts
│   ├── edge-single-char-fields.spec.ts
│   ├── edge-numeric-names.spec.ts
│   ├── edge-single-product-checkout.spec.ts
│   ├── edge-cart-badge-count.spec.ts
│   ├── nav-cancel-step-one.spec.ts
│   ├── nav-cancel-step-two.spec.ts
│   ├── nav-continue-shopping.spec.ts
│   ├── nav-back-home.spec.ts
│   ├── ui-cart-page.spec.ts
│   ├── ui-checkout-step-one.spec.ts
│   ├── ui-checkout-step-two.spec.ts
│   └── ui-confirmation-page.spec.ts
└── seed.spec.ts
```

### 5.4 Page Object Implementation Rules

For **every Page Object** (`tests/pages/*.ts`), the agent MUST follow these rules:

1. **Class declaration** — each page class extends `BasePage`.
2. **Locators as readonly fields** — all selectors are declared as `readonly` Playwright `Locator` fields at the top of the class. No inline `page.locator()` calls inside action or assertion methods.
3. **Selector strategy** — use selectors in this priority order (highest reliability first):
   - `data-test` attributes (e.g., `[data-test="username"]`) — prefer these where available on SauceDemo
   - ARIA roles with accessible names (e.g., `page.getByRole('button', { name: 'Checkout' })`)
   - `id` attributes
   - `name` attributes on input elements
   - CSS class selectors only as a last resort, and never for dynamic or generated class names
4. **No XPath** unless absolutely unavoidable.
5. **Action methods** — each method performs exactly one user action (click, fill, select) and returns `Promise<void>`.
6. **Assertion methods** — each `expect*` method contains exactly one `expect()` call and returns `Promise<void>`.
7. **No `page.waitForTimeout()`** — never use arbitrary time-based waits.

#### BasePage.ts requirements

```typescript
// tests/pages/BasePage.ts
export class BasePage {
  constructor(protected readonly page: Page) {}

  // Navigate to a URL and wait for network idle
  async navigate(url: string): Promise<void>

  // Wait for the page to reach DOMContentLoaded + networkidle
  async waitForPageLoad(): Promise<void>

  // Wait for a specific URL pattern
  async waitForUrl(pattern: string | RegExp): Promise<void>

  // Take a labelled screenshot for debugging
  async captureScreenshot(label: string): Promise<void>
}
```

#### LoginPage.ts requirements

```typescript
// tests/pages/LoginPage.ts
export class LoginPage extends BasePage {
  readonly usernameInput: Locator   // [data-test="username"]
  readonly passwordInput: Locator   // [data-test="password"]
  readonly loginButton:   Locator   // [data-test="login-button"]
  readonly errorMessage:  Locator   // [data-test="error"]

  async fillUsername(value: string): Promise<void>
  async fillPassword(value: string): Promise<void>
  async clickLogin(): Promise<void>
  async login(username: string, password: string): Promise<void>  // composite
  async expectErrorVisible(message: string): Promise<void>
  async expectOnProductsPage(): Promise<void>
}
```

#### InventoryPage.ts requirements

```typescript
// tests/pages/InventoryPage.ts
export class InventoryPage extends BasePage {
  readonly cartBadge:             Locator   // .shopping_cart_badge
  readonly cartIcon:              Locator   // .shopping_cart_link
  readonly inventoryItems:        Locator   // .inventory_item

  async addProductToCart(productName: string): Promise<void>
  async removeProductFromCart(productName: string): Promise<void>
  async clickCart(): Promise<void>
  async expectCartBadgeCount(count: string): Promise<void>
  async expectCartBadgeNotVisible(): Promise<void>
  async expectAddToCartButtonVisible(productName: string): Promise<void>
}
```

#### CartPage.ts requirements

```typescript
// tests/pages/CartPage.ts
export class CartPage extends BasePage {
  readonly checkoutButton:        Locator   // [data-test="checkout"]
  readonly continueShoppingButton:Locator   // [data-test="continue-shopping"]
  readonly cartItems:             Locator   // .cart_item
  readonly qtyLabel:              Locator   // .cart_quantity_label
  readonly descriptionLabel:      Locator   // .cart_desc_label

  async clickCheckout(): Promise<void>
  async clickContinueShopping(): Promise<void>
  async expectItemVisible(productName: string): Promise<void>
  async expectItemCount(count: number): Promise<void>
  async expectQtyLabelVisible(): Promise<void>
  async expectDescriptionLabelVisible(): Promise<void>
  async expectCheckoutButtonVisible(): Promise<void>
  async expectContinueShoppingButtonVisible(): Promise<void>
}
```

#### CheckoutStepOnePage.ts requirements

```typescript
// tests/pages/CheckoutStepOnePage.ts
export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput: Locator   // [data-test="firstName"]
  readonly lastNameInput:  Locator   // [data-test="lastName"]
  readonly zipCodeInput:   Locator   // [data-test="postalCode"]
  readonly continueButton: Locator   // [data-test="continue"]
  readonly cancelButton:   Locator   // [data-test="cancel"]
  readonly errorMessage:   Locator   // [data-test="error"]
  readonly errorIcon:      Locator   // .error_icon

  async fillFirstName(value: string): Promise<void>
  async fillLastName(value: string): Promise<void>
  async fillZipCode(value: string): Promise<void>
  async fillForm(firstName: string, lastName: string, zipCode: string): Promise<void>  // composite
  async clickContinue(): Promise<void>
  async clickCancel(): Promise<void>
  async expectErrorVisible(message: string): Promise<void>
  async expectErrorIconVisible(): Promise<void>
  async expectFieldLabelsVisible(): Promise<void>
  async expectPlaceholdersCorrect(): Promise<void>
  async expectContinueButtonVisible(): Promise<void>
  async expectCancelButtonVisible(): Promise<void>
}
```

#### CheckoutStepTwoPage.ts requirements

```typescript
// tests/pages/CheckoutStepTwoPage.ts
export class CheckoutStepTwoPage extends BasePage {
  readonly finishButton:       Locator   // [data-test="finish"]
  readonly cancelButton:       Locator   // [data-test="cancel"]
  readonly paymentInfo:        Locator   // [data-test="payment-info-value"]
  readonly shippingInfo:       Locator   // [data-test="shipping-info-value"]
  readonly subtotalLabel:      Locator   // .summary_subtotal_label
  readonly taxLabel:           Locator   // .summary_tax_label
  readonly totalLabel:         Locator   // .summary_total_label
  readonly summaryItems:       Locator   // .cart_item

  async clickFinish(): Promise<void>
  async clickCancel(): Promise<void>
  async expectPaymentInfo(value: string): Promise<void>
  async expectShippingInfo(value: string): Promise<void>
  async expectSubtotal(value: string): Promise<void>
  async expectTax(value: string): Promise<void>
  async expectTotal(value: string): Promise<void>
  async expectItemVisible(productName: string): Promise<void>
  async expectFinishButtonVisible(): Promise<void>
  async expectCancelButtonVisible(): Promise<void>
}
```

#### CheckoutCompletePage.ts requirements

```typescript
// tests/pages/CheckoutCompletePage.ts
export class CheckoutCompletePage extends BasePage {
  readonly successHeading:   Locator   // [data-test="complete-header"]
  readonly successText:      Locator   // [data-test="complete-text"]
  readonly backHomeButton:   Locator   // [data-test="back-to-products"]
  readonly ponyExpressImage: Locator   // .pony_express

  async clickBackHome(): Promise<void>
  async expectSuccessHeading(text: string): Promise<void>
  async expectSuccessText(text: string): Promise<void>
  async expectBackHomeButtonVisible(): Promise<void>
  async expectPonyExpressImageVisible(): Promise<void>
}
```

#### TestDataHelper.ts requirements

```typescript
// tests/helpers/TestDataHelper.ts
import testData from '../data/checkout-test-data.json';

export { testData };
export type TestData = typeof testData;
```

### 5.5 Spec File Implementation Rules

For **every spec file** (`tests/checkout/*.spec.ts`), the agent MUST:

1. Import page objects from `../pages/` — never import `Page` directly and call `.fill()` or `.click()` inline.
2. Import test data via `import { testData } from '../helpers/TestDataHelper'`.
3. Use `test.beforeEach` to: open a fresh context, navigate to the login page, and call `loginPage.login()`.
4. Use `test.afterEach` to capture a screenshot on failure using `captureScreenshot()`.
5. Group related scenarios using `test.describe`.
6. Each `test()` block maps to exactly **one** scenario from the test plan.
7. Test titles must match the `Test Title` field in the test plan entry exactly.
8. At the **end of every passing test body** (before the closing brace), call `captureScreenshot('<TestID>-expected-condition')` to record a screenshot of the final expected state.
9. `playwright.config.ts` MUST be configured with `screenshot: 'on'`, `video: 'on'`, and `trace: 'on'`. **Do not use `'only-on-failure'` or `'retain-on-failure'`** — passing tests must also have screenshot and video evidence.

#### Spec file template

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
// import additional page objects as needed
import { testData } from '../helpers/TestDataHelper';

test.describe('<Scenario Group Name>', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  // declare other page objects

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    // initialise other page objects
    await loginPage.navigate('https://www.saucedemo.com');
    await loginPage.login(
      testData.credentials.username,
      testData.credentials.password
    );
    await loginPage.expectOnProductsPage();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await new LoginPage(page).captureScreenshot(
        `FAILED-${testInfo.title}`
      );
    }
  });

  test('<Test Title from plan>', async ({ page }) => {
    // step-by-step actions using page objects
    // one assertion per logical verification point
  });
});
```

### 5.6 Wait Strategy Rules

The agent MUST apply the following wait strategies based on observed application behaviour. **Never use `page.waitForTimeout()`.**

| Situation | Required Wait Strategy |
|---|---|
| After navigation (page change) | `await page.waitForURL(/<url-pattern>/)` inside the page object method |
| After clicking a button that triggers a page transition | `await this.page.waitForURL(...)` immediately after the click |
| Before asserting a dynamically rendered element | Use `await expect(locator).toBeVisible()` — Playwright auto-waits |
| After adding item to cart (badge update) | `await expect(this.cartBadge).toHaveText('<count>')` — auto-wait |
| After form submission that shows an error message | `await expect(this.errorMessage).toBeVisible()` — auto-wait |
| Network-heavy pages (inventory load) | `await this.page.waitForLoadState('networkidle')` in `navigate()` |
| Single Page App route changes | `await this.page.waitForURL(...)` + `await expect(heading).toBeVisible()` |

### 5.7 Selector Reliability Rules (from Exploratory Testing)

The agent MUST cross-reference `specs/exploratory-testing-findings.md` for any selector that failed or proved unstable during exploration and apply the following rules:

1. Prefer `data-test` attributes — SauceDemo consistently uses `data-test` on all interactive elements.
2. If a `data-test` attribute is not present on an element, use `getByRole()` with an explicit `name`.
3. For product-specific buttons (Add to Cart / Remove), use:
   `page.locator('[data-test="add-to-cart-<kebab-product-name>"]')`
4. Never select elements by visible text alone using `.getByText()` for interactive elements — combine with role.
5. For error messages, always use `[data-test="error"]` — the text inside changes per validation rule, so assert using `.toContainText()` not `.toHaveText()`.

### 5.8 Assertion Rules

Every spec MUST include assertions from each of the following categories for its scenario:

| Category | Assertion Type | Example |
|---|---|---|
| URL / Navigation | `toHaveURL` | `await expect(page).toHaveURL(/inventory/)` |
| Element Visibility | `toBeVisible` | `await expect(locator).toBeVisible()` |
| Text Content | `toContainText` / `toHaveText` | `await expect(heading).toHaveText('Thank you...')` |
| Element State | `toBeEnabled` / `toBeDisabled` | `await expect(button).toBeEnabled()` |
| Input Value | `toHaveValue` | `await expect(input).toHaveValue('John')` |
| Count | `toHaveCount` | `await expect(items).toHaveCount(3)` |

### 5.9 Code Quality Requirements

- All files use TypeScript strict mode.
- No `any` types — use explicit types or `unknown`.
- All async functions are properly `await`-ed.
- No `eslint-disable` comments.
- Locator selectors are stored as `readonly` constants — not repeated inline.
- Files are formatted consistently (2-space indent, single quotes, trailing commas).

### 5.10 Generation Steps for the `playwright-test-generator` Agent

> **Configuration first.** Before creating any POM or spec files, update `playwright.config.ts` to set `screenshot: 'on'`, `video: 'on'`, `trace: 'on'`, `outputDir: 'reports/test-results'`, and `reporter: [['html'], ['json', { outputFile: 'reports/test-results/initial-run-report.json' }]]`. Every test run must produce screenshot, video, and trace artefacts embedded in the Playwright HTML report (`playwright-report/`). This is a hard requirement — do not proceed with file generation until the config is saved.

Execute in this exact order:

1. **Read** `specs/ecom-checkout-test-plan.md` — extract all test IDs, titles, steps, and expected results.
2. **Read** `tests/data/checkout-test-data.json` — understand all available scenario keys and data shapes.
3. **Read** `specs/exploratory-testing-findings.md` — extract selector observations, wait behaviour notes, and any bug-related UI quirks that affect automation.
4. **Create** `tests/pages/BasePage.ts` first — all other page objects depend on it.
5. **Create** page objects in dependency order: `LoginPage` → `InventoryPage` → `CartPage` → `CheckoutStepOnePage` → `CheckoutStepTwoPage` → `CheckoutCompletePage`.
6. **Create** `tests/helpers/TestDataHelper.ts`.
7. **Create** spec files one at a time, in the order listed in Section 5.3.
8. After creating each file, **verify** it compiles without TypeScript errors before moving to the next.
9. **Run** the happy-path spec (`happy-path-complete-checkout.spec.ts`) first to validate the POM wiring end-to-end.
10. **Fix** any selector or wait issues discovered during the run, applying the strategies in Sections 5.6 and 5.7.
11. **Run** all remaining specs.
12. **Report** final results: pass count, fail count, any known flakiness, and recommended follow-up actions.

---

## Before Proceeding to Part 5

Confirm every item below before opening `e2e-qa-prompt-part5.md`.

- [ ] `tests/data/checkout-test-data.json` exists and contains all scenario keys (HP-01 through UI-04)
- [ ] All 7 POM files exist under `tests/pages/`
- [ ] `tests/helpers/TestDataHelper.ts` exists
- [ ] All 19 spec files exist under `tests/checkout/`
- [ ] `playwright.config.ts` has `screenshot: 'on'`, `video: 'on'`, `trace: 'on'`, and `outputDir: 'reports/test-results'`
- [ ] The happy-path spec passes on Chromium
- [ ] No spec file contains inline `page.fill()` or `page.click()` calls
- [ ] No spec file contains `page.waitForTimeout()`
- [ ] Every passing test body ends with a `captureScreenshot('<TestID>-expected-condition')` call

**Do not open Part 5 until all items above are checked.**
