# E2E QA Prompt — Part 1 of 5: Manual Test Cases

> **Before starting: read `util/prompts/aut-config.md`.**
> That file is the single source of truth for the application URL, credentials, selector strategy, and known behaviours. Use those values everywhere in this prompt. Do not hardcode URLs or credentials.
>
> **File path substitution**: This prompt uses `ecom-checkout` as the default app slug in all file names. Read the actual `appSlug` and `userStoryFile` from `util/prompts/aut-config.md` Section 0 and substitute them everywhere before proceeding.

**Part** : 1 of 5 | **Agent** : Playwright MCP Server | **Step covered** : Step 1

---

## Pipeline Overview

| Part | File | Agent | Steps | Focus |
|---|---|---|---|---|
| **Part 1 — this file** | `e2e-qa-prompt-part1.md` | Playwright MCP Server | Step 1 | Derive manual test cases from user story |
| Part 2 | `e2e-qa-prompt-part2.md` | Playwright Test Planner | Step 2 | Build structured E2E test plan |
| Part 3 | `e2e-qa-prompt-part3.md` | Playwright MCP Server | Step 3 | Exploratory testing + bug reports |
| Part 4 | `e2e-qa-prompt-part4.md` | playwright-test-generator | Steps 4–5 | Test data JSON + POM automation scripts |
| Part 5 | `e2e-qa-prompt-part5.md` | playwright-test-healer | Steps 6–7 | Test healing + final test report |

**Execute parts strictly in order. Do not begin a part until all outputs of the previous part exist on disk.**

---

## Inputs Required

| File | Source |
|---|---|
| `util/userstory/ecom-checkout.md` | Provided in workspace — read this before producing any test cases |

## Outputs Produced by This Part

| File | Content |
|---|---|
| `util/manual-tests/manual-test-cases.md` | All structured `TC-*` blocks, one per scenario, grouped by AC |

---

## How to Use This Part

1. Paste this file into the **Playwright MCP Server** agent chat.
2. The agent reads `util/userstory/ecom-checkout.md` and produces all manual test cases.
3. Save all test case output to `util/manual-tests/manual-test-cases.md`.
4. Verify the output file exists on disk before proceeding to Part 2.
5. Execute **only Step 1** from this file — Steps 2–8 below are preserved for reference only.

---

## Pre-flight: Environment Setup

Before generating any test cases, ensure the project environment is ready. Run these commands once in the terminal:

```bash
# 1. Install all npm dependencies (@playwright/test, playwright-bdd, TypeScript types, etc.)
npm install

# 2. Download Playwright browsers and OS-level dependencies
npx playwright install --with-deps

# 3. Verify Playwright is working
npx playwright --version
```

Check that the following exist — do NOT delete them, they configure the AI tooling:
- `.env` — API keys for the MCP server tools
- `.playwright-mcp/` — MCP server configuration folder

If any tool call fails during test generation, re-run `npm install` and `npx playwright install --with-deps` before retrying.

---

## STEP 1 — Derive Manual Test Cases from the User Story

### 1.1 Input

Read the file at:

```
util/userstory/ecom-checkout.md
```

Extract every Acceptance Criterion (AC), business rule, and technical note from the document.

### 1.2 Output format — one test case block per scenario

For **every distinct scenario** you identify, produce a structured test case using the template below.
Group test cases under the same AC that they validate.

```
TC-<AC_NUMBER>-<SEQ>
───────────────────────────────────────────────
Test Title       : <short, action-oriented title>
Test Objective   : <one or two sentences describing what this test verifies and why it matters>
Testing Scope    : <list the features, pages, components, or integrations covered>
Pre-conditions   : <what must be true before the test starts (login state, cart state, etc.)>
Test Steps       :
  1. <action>  →  Expected: <observable outcome>
  2. <action>  →  Expected: <observable outcome>
  … (continue for every step)
Test Data        : <exact values to use — usernames, form inputs, prices, etc.>
Acceptance Criteria Met : <list each AC ID this test validates>
Pass Criteria    : <what constitutes a pass — all assertions must hold>
Fail Criteria    : <what constitutes a fail — any assertion breaks or unexpected behaviour>
───────────────────────────────────────────────
```

### 1.3 Required test case categories

You MUST produce at least one test case for each of the following categories:

| Category | Description |
|---|---|
| Happy Path | End-to-end success flow with valid data |
| Negative — Empty Fields | Submit form(s) with one or more mandatory fields left blank |
| Negative — Invalid Data | Enter special characters, excessively long strings, wrong formats |
| Edge Case / Boundary | Minimum/maximum length values, single-character inputs, numeric limits |
| Navigation Flow | Back button, Cancel button, direct URL access, mid-flow navigation |
| UI Element Validation | Labels, placeholders, buttons, error banners, visual confirmations |

### 1.4 Save Location

Save all produced test cases to:

```
util/manual-tests/manual-test-cases.md
```

---

## Before Proceeding to Part 2

Confirm every item below before opening `e2e-qa-prompt-part2.md`.

- [ ] `util/manual-tests/manual-test-cases.md` exists on disk
- [ ] At least one `TC-*` block exists for each of the 6 required categories: Happy Path, Negative–Empty Fields, Negative–Invalid Data, Edge Case, Navigation, UI Element Validation
- [ ] Every `TC-*` block uses the full template (Title, Objective, Scope, Pre-conditions, Steps, Data, AC Met, Pass/Fail Criteria)
- [ ] Every test step has a corresponding `Expected:` outcome

**Do not open Part 2 until all items above are checked.**

---

> **⚠️ REFERENCE ONLY — The content below (Steps 2–8) is preserved for reference. For agent invocations use the dedicated part files:**
> - **Step 2** → `prompts/e2e-qa-prompt-part2.md`
> - **Step 3** → `prompts/e2e-qa-prompt-part3.md`
> - **Steps 4–5** → `prompts/e2e-qa-prompt-part4.md`
> - **Steps 6–7 + Checklist** → `prompts/e2e-qa-prompt-part5.md`

---

## STEP 2 — Create the Playwright Test Plan

### 2.1 Instructions for the Playwright Test Planner agent

Using the manual test cases produced in Step 1, instruct the **Playwright Test Planner** to generate a complete, production-ready test plan.

The agent must:

1. Navigate to the application under test:
   - **URL**: `https://www.saucedemo.com`
   - **Credentials**: username `standard_user` / password `secret_sauce`

2. Visually inspect each page involved in the checkout flow (login, products, cart, checkout-step-one, checkout-step-two, checkout-complete) before writing any test step, so that selectors and element labels are accurate.

3. For every manual test case from Step 1 produce a corresponding test plan entry using the structure below.

### 2.2 Test plan entry structure

```
Test ID          : <TC-AC_NUMBER-SEQ from Step 1>
Test Title       : <same title as manual test case>
Scenario Type    : <Happy Path | Negative | Edge Case | Navigation | UI Validation>
Seed File        : tests/seed.spec.ts
Output File      : tests/<folder>/<kebab-case-title>.spec.ts
───────────────────────────────────────────────
Step-by-step Instructions (Playwright actions):
  1. page.goto('<url>')
     Expected: <what should be visible/true>
  2. page.fill('<selector>', testData.<field>)
     Expected: <what should be visible/true>
  … (every action maps to one expected result)
───────────────────────────────────────────────
Expected Result Validation:
  - <assertion 1>
  - <assertion 2>
  …
Test Data Reference : testData.<scenarioKey> (from tests/data/checkout-test-data.json)
───────────────────────────────────────────────
```

### 2.3 Scenario coverage requirements

The test plan MUST include entries for ALL of the following scenarios:

#### Happy Path
- **HP-01** Complete checkout — login → add multiple products → cart → checkout info → overview → finish → confirmation → back home

#### Negative — Validation Errors
- **NE-01** Checkout info submitted with all fields empty  
- **NE-02** Checkout info submitted with First Name empty only  
- **NE-03** Checkout info submitted with Last Name empty only  
- **NE-04** Checkout info submitted with Zip/Postal Code empty only  
- **NE-05** Checkout info submitted with special characters in all fields  
- **NE-06** Checkout info submitted with excessively long strings (> 100 chars)

#### Edge Cases / Boundary Conditions
- **EC-01** Checkout info with single-character values in all fields  
- **EC-02** Checkout info with numeric-only First/Last Name  
- **EC-03** Checkout with exactly one product in cart  
- **EC-04** Verify cart badge count reflects exact number of items added

#### Navigation Flow
- **NF-01** Click Cancel on checkout-step-one → returns to cart with items intact  
- **NF-02** Click Cancel on checkout-step-two → returns to products page  
- **NF-03** Click Continue Shopping on cart page → returns to products page  
- **NF-04** Click Back Home after order confirmation → products page, cart cleared

#### UI Element Validation
- **UI-01** Cart page — verify item name, description, price, quantity labels are visible  
- **UI-02** Checkout-step-one — verify field labels, placeholders, and button labels  
- **UI-03** Checkout-step-two — verify payment info, shipping info, subtotal, tax, total  
- **UI-04** Order confirmation — verify success heading, body text, and Back Home button

### 2.4 Save location

Save the completed test plan as:

```
util/manual-tests/ecom-checkout-test-plan.md
```

---

## STEP 3 — Perform Exploratory Testing

### 3.1 Purpose

Exploratory testing uncovers defects, usability issues, and unexpected behaviours that scripted test cases miss. In this step the **Playwright MCP Server** agent navigates the live application freely, documents every observation, and records findings as structured bug reports.

### 3.2 Pre-conditions

1. The application at `https://www.saucedemo.com` is reachable.
2. Credentials available: username `standard_user` / password `secret_sauce`.
3. Steps 1 and 2 are complete — use the manual test cases and test plan as a reference map, but intentionally go **beyond** the scripted paths.

### 3.3 Exploratory Testing Charter

For each charter below, spend focused time on that area, taking screenshots and recording observations.

| Charter ID | Area | Goal |
|---|---|---|
| EX-01 | Login Page | Probe all credential combinations, locked-out user, problem user, performance glitch user |
| EX-02 | Product Catalogue | Sort products, filter views, verify product images load, check prices render correctly |
| EX-03 | Cart Management | Add/remove items rapidly, refresh page mid-cart, verify persistence across page reload |
| EX-04 | Checkout Form | Paste content, use tab-key navigation, use mobile keyboard input, autocomplete behaviour |
| EX-05 | Order Overview | Verify all price calculations are arithmetically correct, look for rounding errors |
| EX-06 | Post-Order State | Verify cart resets after order, session persistence, logout and re-login state |
| EX-07 | Cross-Browser | Repeat EX-01 → EX-06 observations on Firefox and Safari |
| EX-08 | Responsive / Mobile | Resize viewport to 375×812 (iPhone) and 768×1024 (iPad), test all flows |

### 3.4 Step-by-step Exploratory Testing Procedure

Execute the following steps in order for each charter:

**Phase A — Setup**
1. Open a fresh browser context (no cookies, no local storage).
2. Navigate to `https://www.saucedemo.com`.
3. Take a baseline screenshot and label it `EX-<charter>-baseline`.

**Phase B — Explore**
4. For each charter area, follow the goal defined in Section 3.3.
5. At every step:
   a. Perform the action.
   b. Observe the response.
   c. Note any **anomaly, surprise, or question** — do not dismiss anything as minor.
6. Capture a screenshot whenever:
   - An error message appears (expected or unexpected).
   - The UI behaves differently from what the user story implies.
   - A visual element is misaligned, truncated, missing, or overlapping.
   - A network request fails or returns an unexpected status code.
   - Page load takes more than 3 seconds.

**Phase C — Probe Deeper**
7. For any anomaly found in Phase B:
   a. Attempt to reproduce it three times.
   b. Try to reproduce it with different input data.
   c. Try to reproduce it in a different browser.
8. Record whether the anomaly is **consistent** or **intermittent**.

**Phase D — Document Findings**
9. For every confirmed anomaly, create a bug report using the template in Section 3.5.
10. Assign a severity level using the scale in Section 3.6.
11. Append all bug reports to the file `util/manual-tests/exploratory-testing-findings.md`.

**Phase E — Summarise**
12. After all charters are complete, write an **Exploratory Testing Summary** at the top of `util/manual-tests/exploratory-testing-findings.md` containing:
    - Total charters executed.
    - Total time spent per charter.
    - Total bugs found, broken down by severity.
    - Areas of highest risk identified.
    - Recommended regression test additions.

### 3.5 Bug Report Template

```
BUG-<SEQ>
───────────────────────────────────────────────
Title            : <short description of the defect>
Charter          : EX-<charter ID>
Severity         : <Critical | High | Medium | Low>
Priority         : <P1 | P2 | P3 | P4>
Environment      : Browser: <name & version>  |  OS: macOS  |  Viewport: <WxH>
URL              : <exact URL where the bug was observed>
Pre-conditions   :
  - <state before reproducing the bug>
Steps to Reproduce:
  1. <action>
  2. <action>
  3. <action>
Actual Result    : <what actually happened — be specific>
Expected Result  : <what should have happened per the user story or AC>
Screenshot       : <filename of the captured screenshot>
User Story AC    : <which AC this violates, e.g., AC2, AC5>
Notes            : <any additional context, intermittency info, workaround>
───────────────────────────────────────────────
```

### 3.6 Severity Scale

| Severity | Definition | Example |
|---|---|---|
| Critical | Application is unusable; data loss or security issue | Cannot complete checkout at all |
| High | Core functionality broken for most users | Error message not shown on empty field submit |
| Medium | Feature works but with noticeable defects | Price total display rounded incorrectly |
| Low | Cosmetic or minor usability issue | Button label has an extra space |

### 3.7 Specific Exploratory Test Ideas (seed the imagination)

The agent should also try the following targeted probes — none of these are covered by the scripted plan:

1. **Rapid double-click** the Checkout button — does it submit twice?
2. **Directly navigate** to `/checkout-step-two.html` without going through step one — what happens?
3. **Directly navigate** to `/checkout-complete.html` without placing an order — is a fake confirmation shown?
4. **Add all available products** to the cart — does the badge number display correctly for 6+ items?
5. **Use the `locked_out_user` credential** — verify the correct error message is shown and no checkout is possible.
6. **Use the `problem_user` credential** — explore what visual or functional issues appear.
7. **Use the `performance_glitch_user` credential** — measure and record perceived load times.
8. **Press browser Back** from the confirmation page — can the order be resubmitted?
9. **Tab through the checkout form** using only the keyboard — verify focus order is logical.
10. **Paste a URL with XSS payload** into the First Name field (e.g., `<script>alert(1)</script>`) — verify the app sanitises input and does not execute scripts.
11. **Resize the viewport** to 320×568 (smallest common mobile) — verify no horizontal scroll and all buttons remain tappable.
12. **Disable JavaScript** in the browser — verify the app shows a graceful degradation message or still functions.

### 3.8 Output Files

| File | Content |
|---|---|
| `util/manual-tests/exploratory-testing-findings.md` | Summary + all bug reports in template format |
| `reports/screenshots/EX-*.png` | All screenshots taken during exploration |

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

Using the test plan from Step 2, the test data JSON from Step 4, and the selector and behaviour insights from the Exploratory Testing in Step 3, the **`playwright-test-generator`** agent must generate production-ready Playwright automation scripts organised as a **Page Object Model (POM)** framework.

### 5.2 Pre-conditions

1. Steps 1–4 are complete.
2. `util/manual-tests/ecom-checkout-test-plan.md` exists and is fully populated.
3. `tests/data/checkout-test-data.json` exists with all scenario keys.
4. `util/manual-tests/exploratory-testing-findings.md` exists — the agent MUST read this file to learn which selectors proved reliable and which application behaviours require special wait handling.

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
8. At the **end of every passing test body** (before the closing brace), call `captureScreenshot('<TestID>-expected-condition')` to record a screenshot of the final expected state. This screenshot is evidence that the pass condition was reached and will be embedded in the Playwright HTML report.
9. `playwright.config.ts` MUST be configured with `screenshot: 'on'`, `video: 'on'`, and `trace: 'on'` so that Playwright automatically captures visual evidence for every test — regardless of pass or fail — and embeds it in the HTML report. **Do not use `'only-on-failure'` or `'retain-on-failure'`** — passing tests must also have screenshot and video evidence.

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

The agent MUST cross-reference `util/manual-tests/exploratory-testing-findings.md` for any selector that failed or proved unstable during exploration and apply the following rules:

1. Prefer `data-test` attributes — SauceDemo consistently uses `data-test` on all interactive elements.
2. If a `data-test` attribute is not present on an element, use `getByRole()` with an explicit `name`.
3. For product-specific buttons (Add to Cart / Remove), use:
   `page.locator(`[data-test="add-to-cart-<kebab-product-name>"]`)`
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

> **Configuration first.** Before creating any POM or spec files, update `playwright.config.ts` to set `screenshot: 'on'`, `video: 'on'`, `trace: 'on'`, `outputDir: 'reports/test-results'`, and `reporter: [['html', { outputFolder: 'reports/html-report' }], ['json', { outputFile: 'reports/runs/<timestamp>/test-results.json' }]]`. Every test run must produce screenshot, video, and trace artefacts that are embedded in the Playwright HTML report (`reports/runs/<timestamp>/html-report/`). This is a hard requirement — do not proceed with file generation until the config is saved.

Execute in this exact order:

1. **Read** `util/manual-tests/ecom-checkout-test-plan.md` — extract all test IDs, titles, steps, and expected results.
2. **Read** `tests/data/checkout-test-data.json` — understand all available scenario keys and data shapes.
3. **Read** `util/manual-tests/exploratory-testing-findings.md` — extract selector observations, wait behaviour notes, and any bug-related UI quirks that affect automation.
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

## STEP 6 — Execute & Heal Automation Scripts Using the `playwright-test-healer` Agent

### 6.1 Purpose

After the `playwright-test-generator` agent produces the POM-based automation scripts in Step 5, the **`playwright-test-healer`** agent takes ownership of running every spec, diagnosing every failure, and applying targeted fixes. The goal is a fully green test suite with no flakiness, no suppressed errors, and no workarounds.

### 6.2 Pre-conditions

1. All files listed in Step 5 Section 5.3 exist in the workspace.
2. `tests/data/checkout-test-data.json` is populated.
3. `util/manual-tests/exploratory-testing-findings.md` is available for cross-referencing known UI quirks.
4. Playwright is installed and `npx playwright install` has been run for all browsers.
5. The application at `https://www.saucedemo.com` is reachable.

### 6.3 Execution & Healing Procedure

Execute the following phases in strict order. Do not skip a phase even if the previous phase produced no failures.

---

#### Phase 1 — Initial Full Test Run

1. Run the complete test suite across all configured browsers:
   ```
   npx playwright test --reporter=html,json
   ```
2. Save the raw JSON report as `reports/runs/<timestamp>/test-results.json`.
3. Open the HTML report and take a screenshot of the results summary. Save it as `reports/runs/<timestamp>/initial-run-summary.png`.
4. Record the following metrics:
   - Total tests run
   - Total passed
   - Total failed
   - Total skipped
   - Flaky tests (passed on retry)
5. Proceed to Phase 2 for every test that did not pass on the first attempt.
6. Verify that the `reports/runs/<timestamp>/html-report/` folder has been generated. Open it with `npx playwright show-report` and confirm:
   - Every test entry has an embedded **screenshot** of the final expected condition (the success state captured at test end).
   - Every test entry has an embedded **video recording** of the full test run.
   - Every test entry has an embedded **trace** that can be opened in the trace viewer.
   If any of these artefacts are missing, stop and fix the `playwright.config.ts` before proceeding to Phase 2.

> **IMPORTANT — Healing is a loop, not a single pass.**
> After each fix in Phase 4, the healer agent MUST re-run the specific failing test and confirm it passes before moving to the next failure. If the test still fails after a fix, the agent MUST repeat the triage → RCA → fix → re-run cycle for that test until it passes or is definitively classified as a confirmed application bug. Only when every test is either **passing** or **marked `test.fail()` with a bug report** is the healing process considered complete.

---

#### Phase 2 — Failure Triage

For each failing or flaky test, open the Playwright trace viewer (`npx playwright show-report`) and collect the following information before attempting any fix:

| Field | What to Capture |
|---|---|
| Test ID | Matching ID from the test plan (e.g., HP-01, NE-02) |
| Spec File | File path of the failing spec |
| Test Title | Exact test title string |
| Browser | Which browser(s) it failed on |
| Failure Type | See Section 5.4 for classification |
| Error Message | Full error text from the Playwright output |
| Failed Step | The exact action or assertion that threw the error |
| Selector Used | The locator string that was involved, if any |
| Screenshot at Failure | Path to the auto-captured failure screenshot |
| Trace File | Path to the `.zip` trace file |
| Intermittent? | Did it pass on retry? Yes / No |

Record all triage data for every failure in `reports/runs/<timestamp>/failure-triage.md` before applying any fix.

---

#### Phase 3 — Root Cause Analysis

For each triaged failure, perform a structured root cause analysis following the decision tree below:

```
Is the error "Element not found" or "Timeout waiting for locator"?
├─ YES → Go to RCA-A: Selector Issue
└─ NO
   Is the error "Timeout" on a navigation or page-load assertion?
   ├─ YES → Go to RCA-B: Wait / Timing Issue
   └─ NO
      Is the assertion comparing a string value that does not match?
      ├─ YES → Go to RCA-C: Test Data Issue
      └─ NO
         Is the error thrown inside a beforeEach or login step?
         ├─ YES → Go to RCA-D: Setup / Environment Issue
         └─ NO
            Does the failure only occur on Firefox or Safari?
            ├─ YES → Go to RCA-E: Cross-Browser Compatibility Issue
            └─ NO → Go to RCA-F: Logic / Assertion Issue
```

---

### 6.4 Failure Classification & Healing Playbook

For each root cause category, apply the prescribed healing steps in order. Do not skip steps.

---

#### RCA-A — Selector Issue

**Symptoms:** `locator.click: Timeout`, `locator.fill: Element not found`, `strict mode violation`.

**Healing steps:**
1. Open the Playwright trace for the failed test and locate the DOM snapshot at the point of failure.
2. Inspect the actual HTML in the trace to find the element's attributes (`id`, `data-test`, `aria-label`, `role`, `name`, `class`).
3. Update the locator in the relevant Page Object file using the selector priority from Step 5 Section 5.7:
   - `[data-test="..."]` → `getByRole(...)` → `[id="..."]` → `[name="..."]`
4. If the element exists in the DOM but is hidden or behind an overlay, add `await expect(locator).toBeVisible()` before the action and verify the overlay is dismissed first.
5. If a `strict mode violation` error appears (multiple elements match), make the selector more specific by chaining a parent context: `page.locator('.parent-class').locator('[data-test="..."]')`.
6. Re-run the single spec to confirm the fix: `npx playwright test <spec-file> --project=chromium`.
7. Confirm the fix also passes on Firefox and Safari.
8. Document the selector change in `reports/runs/<timestamp>/healing-log.md` (see Section 6.7).

---

#### RCA-B — Wait / Timing Issue

**Symptoms:** `Timeout exceeded`, `Navigation timeout`, assertion fails intermittently, element found but not yet interactive.

**Healing steps:**
1. Identify the action that timed out from the trace network panel — note whether a network request was still in-flight.
2. Choose the correct wait strategy from the table below — never add `page.waitForTimeout()`:

   | Cause | Fix |
   |---|---|
   | Page transition not complete | `await page.waitForURL(/<expected-url-pattern>/)` after the triggering click |
   | Dynamic element not yet in DOM | Playwright's built-in auto-wait via `expect(locator).toBeVisible()` — increase `timeout` option if needed |
   | Element in DOM but not yet enabled | `await expect(locator).toBeEnabled({ timeout: 10000 })` |
   | Network still loading after navigation | `await page.waitForLoadState('networkidle')` in `BasePage.navigate()` |
   | Cart badge not updated yet | `await expect(cartBadge).toHaveText('<count>', { timeout: 8000 })` |
   | Checkout form fields not accepting input | `await expect(input).toBeEditable()` before `fill()` |
   | SPA route change slower than expected | `await Promise.all([page.waitForURL(...), triggerElement.click()])` |

3. Apply the fix in the Page Object method — not in the spec file.
4. Re-run the spec 3 times consecutively to confirm the fix eliminates flakiness: `npx playwright test <spec-file> --repeat-each=3`.
5. Document the change in `reports/runs/<timestamp>/healing-log.md`.

---

#### RCA-C — Test Data Issue

**Symptoms:** Assertion fails comparing actual text vs expected value from JSON, unexpected price, wrong error message text.

**Healing steps:**
1. Open the Playwright trace and capture the actual text rendered in the UI at the point of the assertion.
2. Compare it against the value in `tests/data/checkout-test-data.json` for the failing scenario key.
3. Determine which is wrong — the JSON value or the application's actual output:
   - If the **JSON value is wrong**: update `checkout-test-data.json` to match the correct expected value from the application. Never change the application to match the test.
   - If the **application value is wrong**: the test is correctly detecting a bug. Do NOT fix the assertion — log a bug report using the template in Step 3 Section 3.5 and mark the test with `test.fail()` pending the bug fix.
4. If the mismatch is due to whitespace or formatting (e.g., `"$89.97 "` vs `"$89.97"`), switch from `.toHaveText()` to `.toContainText()` or trim the actual value.
5. If a price total is calculated at runtime and may vary, use a regex assertion: `await expect(label).toHaveText(/\$\d+\.\d{2}/)`.
6. Document the data change or bug report in `reports/runs/<timestamp>/healing-log.md`.

---

#### RCA-D — Setup / Environment Issue

**Symptoms:** `beforeEach` fails, login step errors, `ERR_CONNECTION_REFUSED`, session not established.

**Healing steps:**
1. Verify the application is reachable: `npx playwright test --project=chromium --grep "login"`.
2. Check that credentials in `testData.credentials` match the live application. If the application rejects them, update the JSON — do not hard-code credentials in spec files.
3. If a `beforeEach` hook fails due to a prior test leaving the application in a broken state (e.g., a half-completed checkout), add `await page.context().clearCookies()` at the start of `beforeEach` to guarantee a clean session.
4. If the login page itself fails to load, add `await page.waitForLoadState('domcontentloaded')` in `BasePage.navigate()`.
5. Run only the `beforeEach` setup by isolating it: add a temporary `test('setup check', ...)` that only runs login and asserts the products page.
6. Document in `reports/runs/<timestamp>/healing-log.md`.

---

#### RCA-E — Cross-Browser Compatibility Issue

**Symptoms:** Test passes on Chromium but fails on Firefox or Safari.

**Healing steps:**
1. Open the trace for the browser-specific failure and compare it with the passing Chromium trace side-by-side.
2. Check for the following known cross-browser differences on SauceDemo:
   - Font rendering differences causing text assertions to fail — switch to `.toContainText()`.
   - Focus management differences — use `locator.focus()` explicitly before keyboard actions.
   - WebKit form auto-fill behaviour overwriting `fill()` values — call `locator.clear()` before `fill()`.
   - Firefox animation timing causing elements to be obscured — add `await expect(overlay).toBeHidden()` before the action.
3. If the fix requires browser-specific logic, use a Playwright `browserName` fixture condition inside the Page Object method:
   ```typescript
   if (browserName === 'webkit') {
     await this.input.clear();
   }
   await this.input.fill(value);
   ```
4. Re-run on the failing browser 3 times to confirm: `npx playwright test <spec-file> --project=firefox --repeat-each=3`.
5. Document in `reports/runs/<timestamp>/healing-log.md`.

---

#### RCA-F — Logic / Assertion Issue

**Symptoms:** The action completes but the assertion logic is incorrect — asserting the wrong element, wrong text, or wrong state.

**Healing steps:**
1. Re-read the test plan entry for this test ID in `util/manual-tests/ecom-checkout-test-plan.md`.
2. Compare the intended assertion in the plan against what is coded in the spec.
3. If the spec asserts something not stated in the plan, remove or correct the assertion.
4. If the plan says to assert X but the spec asserts Y, align the spec to the plan — update the spec, not the plan.
5. If the assertion type is wrong (e.g., `.toHaveText()` used where `.toContainText()` is needed), correct it using the assertion rules in Step 5 Section 5.8.
6. Document in `reports/runs/<timestamp>/healing-log.md`.

---

### 6.5 Per-Test Heal-and-Verify Loop (Phase 4)

For every failing test identified in Phase 1, the healer agent MUST execute the following loop. **Do not batch fixes across multiple tests before verifying — fix one test at a time.**

```
FOR EACH failing test:
  LOOP:
    1. Triage  → collect failure data (Phase 2 template)
    2. Analyse → classify root cause (Phase 3 decision tree)
    3. Fix     → apply the prescribed healing steps from Section 5.4
    4. Re-run  → execute ONLY this test on the browser it failed on:
                 npx playwright test <spec-file> --project=<browser> --reporter=list
    5. Check result:
       ├─ PASS → append HEAL-<SEQ> entry to healing-log.md
       │         mark test as healed
       │         BREAK loop for this test
       └─ FAIL → read the new error output
                 update triage entry with new failure details
                 determine if this is the same root cause or a new one
                 ├─ Same root cause → refine the fix and go to step 3
                 └─ New root cause  → re-classify and go to step 2
  END LOOP
  IF the test cannot be healed after 3 fix attempts:
    → Classify as a confirmed application defect
    → Mark the test with test.fail() and a descriptive comment
    → Log a bug report in util/manual-tests/exploratory-testing-findings.md
    → Record in healing-log.md with Re-run Result: CONFIRMED BUG
END FOR
```

**After every individual test is healed, immediately re-run the full spec file** (not just the single test) to confirm the fix did not break any previously passing tests in that file:
```
npx playwright test <spec-file> --reporter=list
```
If a previously passing test in the same file now fails, treat it as a new failure and enter the heal-and-verify loop for it.

---

### 6.6 Post-Healing Full Suite Verification Run

Only after every individual test has been healed (or classified as a bug), run the complete suite:

1. Run the full suite again across all browsers:
   ```
   npx playwright test --reporter=html,json
   ```
2. Save the report as `reports/runs/<timestamp>/test-results.json`.
3. Every previously failing test MUST now either:
   - **Pass** — healing was successful, OR
   - Be marked `test.fail()` with a linked bug report — the failure is a confirmed application defect.
4. No test may be deleted, skipped with `test.skip()`, or commented out as a way to avoid a failure.
5. If **any new failure** appears that was not present in the initial run:
   - Do NOT proceed to the flakiness check.
   - Re-enter the heal-and-verify loop (Section 6.5) for each new failure.
   - Repeat until the full suite is clean.
6. Flakiness check — only when the full suite is green, run with `--repeat-each=2` to confirm no intermittent failures:
   ```
   npx playwright test --repeat-each=2 --reporter=html
   ```
7. If flakiness is detected during the repeat run, enter the heal-and-verify loop for those tests with root cause **RCA-B (Wait/Timing Issue)** as the starting hypothesis.

### 6.7 Healing Log Format

For every fix applied, append an entry to `reports/runs/<timestamp>/healing-log.md` using the following template:

```
HEAL-<SEQ>
───────────────────────────────────────────────
Test ID          : <TC plan ID, e.g., NE-03>
Spec File        : tests/checkout/<filename>.spec.ts
Page Object File : tests/pages/<ClassName>.ts  (if applicable)
Browser(s)       : <Chromium | Firefox | Safari | All>
Failure Type     : <RCA category from Section 6.4>
Root Cause       : <one or two sentences describing the exact cause>
Fix Applied      :
  Before: <original code snippet>
  After:  <fixed code snippet>
Data Change      : <if checkout-test-data.json was updated, describe the change>
Bug Logged       : <BUG-XX if a new bug was raised, else N/A>
Re-run Result    : PASS / FAIL (with reason if still failing)
───────────────────────────────────────────────
```

### 6.8 Output Files

| File | Content |
|---|---|
| `reports/runs/<timestamp>/test-results.json` | Raw JSON output from the first full run |
| `reports/runs/<timestamp>/initial-run-summary.png` | Screenshot of the HTML report summary |
| `reports/runs/<timestamp>/failure-triage.md` | Triage table for all failures before healing |
| `reports/runs/<timestamp>/healing-log.md` | Chronological log of every fix applied |
| `reports/runs/<timestamp>/test-results.json` | Raw JSON output after all healing is complete |

---

## STEP 7 — Generate Detailed Test Report

### 7.1 Purpose

After Steps 1–6 are complete, produce a single, comprehensive test report that consolidates manual test results, automated test results, exploratory findings, and defect logs into a clearly structured document. This report is the audit trail for the entire testing engagement and must be readable by both technical and non-technical stakeholders.

### 7.2 Pre-conditions

1. Step 1 manual test cases are written and reviewed.
2. Step 2 test plan exists at `util/manual-tests/ecom-checkout-test-plan.md`.
3. Step 3 exploratory testing findings exist at `util/manual-tests/exploratory-testing-findings.md`.
4. Step 4 test data JSON exists at `tests/data/checkout-test-data.json`.
5. Step 5 automation scripts exist under `tests/`.
6. Step 6 healing is complete:
   - `reports/runs/<timestamp>/test-results.json` exists.
   - `reports/runs/<timestamp>/test-results.json` exists.
   - `reports/runs/<timestamp>/failure-triage.md` exists.
   - `reports/runs/<timestamp>/healing-log.md` exists.

### 7.3 Report Generation Steps

Execute the following steps in order:

**Step 7.3.1 — Read All Source Data**

1. Read `util/userstory/ecom-checkout.md` — extract the story title, acceptance criteria IDs, and business rules.
2. Read `util/manual-tests/ecom-checkout-test-plan.md` — extract all Test IDs, titles, scenario types, and expected results.
3. Read `util/manual-tests/exploratory-testing-findings.md` — extract the summary section: charters executed, time spent, bug count by severity.
4. Read `reports/runs/<timestamp>/test-results.json` — extract total tests, passed, failed, flaky counts and per-browser breakdown.
5. Read `reports/runs/<timestamp>/test-results.json` — extract final pass/fail/confirmed-bug counts and per-browser breakdown.
6. Read `reports/runs/<timestamp>/failure-triage.md` — extract every failure entry.
7. Read `reports/runs/<timestamp>/healing-log.md` — extract every `HEAL-<SEQ>` entry.

**Step 7.3.2 — Compute Report Metrics**

Calculate the following before writing the report:

| Metric | Source |
|---|---|
| Total manual test cases written | Count of `TC-*` blocks from Step 1 |
| Manual test cases passed | Count of test cases with no linked open bug |
| Manual test cases failed | Count of test cases with a linked bug |
| Total automated tests | `initial-run-report.json` → total |
| Automated tests passed (post-healing) | `post-healing-run-report.json` → passed |
| Automated tests failed — confirmed bugs | Count of `test.fail()` entries |
| Total defects logged | Count of `BUG-*` entries across all files |
| Defects by severity | Critical / High / Medium / Low counts |
| Total healing iterations | Count of `HEAL-*` entries in healing log |
| Test coverage by AC | For each AC1–AC5 list: covered / not covered |

**Step 7.3.3 — Write the Report File**

Create the file:

```
reports/runs/<timestamp>/test-report-<YYYY-MM-DD>.md
```

Use today's date (`2026-05-15`) in the filename.

The file MUST follow this exact structure:

---

```
# Test Report — SCRUM-101: E-commerce Checkout Process
Generated: <YYYY-MM-DD HH:MM:SS>  |  Tester: QA Automation Agent  |  Application: https://www.saucedemo.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 1. EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Status       : <PASS | PASS WITH DEFECTS | FAIL>
Testing Period       : <start date> to <end date>
User Story           : SCRUM-101 — As a customer, I want to complete my purchase through a checkout process
Browsers Tested      : Chromium | Firefox | Safari

### 1.1 Test Execution Summary

| Category                       | Count |
|---|---|
| Manual Test Cases Written      | <n> |
| Manual Test Cases Passed       | <n> |
| Manual Test Cases Failed       | <n> |
| Automated Tests Executed       | <n> |
| Automated Tests Passed         | <n> |
| Automated Tests Failed         | <n> |
| Confirmed Application Defects  | <n> |
| Tests Healed (automation fix)  | <n> |
| Exploratory Charters Executed  | <n> |

### 1.2 Defect Summary

| Severity | Count |
|---|---|
| Critical | <n> |
| High     | <n> |
| Medium   | <n> |
| Low      | <n> |
| **Total**| **<n>** |

### 1.3 Acceptance Criteria Coverage

| AC ID | Description                        | Status  |
|---|---|---|
| AC1   | Cart Review                        | <COVERED / NOT COVERED> |
| AC2   | Checkout Information Entry         | <COVERED / NOT COVERED> |
| AC3   | Order Overview                     | <COVERED / NOT COVERED> |
| AC4   | Order Completion                   | <COVERED / NOT COVERED> |
| AC5   | Error Handling                     | <COVERED / NOT COVERED> |

### 1.4 Key Risks & Recommendations

- <Risk or observation 1 — derived from exploratory findings and defect patterns>
- <Risk or observation 2>
- <Recommended regression tests to add for next sprint>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 2. MANUAL TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each manual test case from Step 1, record one row:

| Test ID     | Test Title                             | Category       | AC Covered | Result | Defect Ref |
|---|---|---|---|---|---|
| TC-AC1-01   | <title>                                | Happy Path     | AC1        | PASS   | —          |
| TC-AC2-01   | <title>                                | Negative       | AC2        | FAIL   | BUG-01     |
| …           | …                                      | …              | …          | …      | …          |

Result values: PASS | FAIL | BLOCKED | NOT EXECUTED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 3. AUTOMATED TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 3.1 Per-Browser Summary

| Browser   | Total | Passed | Failed | Confirmed Bug |
|---|---|---|---|---|
| Chromium  | <n>   | <n>    | <n>    | <n>           |
| Firefox   | <n>   | <n>    | <n>    | <n>           |
| Safari    | <n>   | <n>    | <n>    | <n>           |

### 3.2 Per-Test Results Table

For every automated test, record one row:

| Test ID | Test Title                                  | Spec File                              | Chromium | Firefox | Safari | Healed | Defect Ref |
|---|---|---|---|---|---|---|---|
| HP-01   | Complete checkout end-to-end happy path     | checkout/happy-path-complete-checkout  | PASS     | PASS    | PASS   | —      | —          |
| NE-01   | All checkout fields empty validation        | checkout/negative-all-fields-empty     | PASS     | PASS    | PASS   | HEAL-1 | —          |
| …       | …                                           | …                                      | …        | …       | …      | …      | …          |

Result values: PASS | FAIL | CONFIRMED BUG

### 3.3 Healing Summary

| HEAL Ref | Test ID | Root Cause Type | Fix Summary                    | Final Result |
|---|---|---|---|---|
| HEAL-01  | NE-03   | RCA-A           | Updated selector to data-test  | PASS         |
| …        | …       | …               | …                              | …            |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 4. EXPLORATORY TESTING RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 4.1 Charter Execution Summary

| Charter | Area                  | Time Spent | Bugs Found | Status   |
|---|---|---|---|---|
| EX-01   | Login Page            | <mm> min   | <n>        | COMPLETE |
| EX-02   | Product Catalogue     | <mm> min   | <n>        | COMPLETE |
| EX-03   | Cart Management       | <mm> min   | <n>        | COMPLETE |
| EX-04   | Checkout Form         | <mm> min   | <n>        | COMPLETE |
| EX-05   | Order Overview        | <mm> min   | <n>        | COMPLETE |
| EX-06   | Post-Order State      | <mm> min   | <n>        | COMPLETE |
| EX-07   | Cross-Browser         | <mm> min   | <n>        | COMPLETE |
| EX-08   | Responsive / Mobile   | <mm> min   | <n>        | COMPLETE |

### 4.2 Notable Observations (non-bug)

- <observation 1 — e.g., selector patterns that are stable>
- <observation 2 — e.g., page load characteristics>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 5. DEFECT LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For every BUG-* entry found across all findings files, record a full defect entry:

BUG-<SEQ>
────────────────────────────────────────────────────────────────
Timestamp        : <YYYY-MM-DD HH:MM:SS>
Title            : <bug title>
Severity         : <Critical | High | Medium | Low>
Priority         : <P1 | P2 | P3 | P4>
Source           : <Manual | Exploratory | Automated>
Test ID          : <TC or scenario ID that exposed the bug>
AC Violated      : <AC1 | AC2 | … | N/A>
Environment      : Browser: <name>  |  OS: macOS  |  Viewport: <WxH>
URL              : <page URL where bug occurs>
Steps to Reproduce:
  1. <step>
  2. <step>
  3. <step>
Actual Result    : <what happened>
Expected Result  : <what should have happened>
Screenshot       : <path to screenshot of expected condition — from reports/runs/<timestamp>/html-report/ or reports/screenshots/>
Video Recording  : <path to video file embedded in reports/runs/<timestamp>/html-report/ for this test>
Status           : <Open | Confirmed | Won't Fix>
────────────────────────────────────────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## 6. APPENDIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 6.1 Artefact Index

| Artefact                                           | Location |
|---|---|
| User Story                                         | util/userstory/ecom-checkout.md |
| Manual Test Cases                                  | Step 1 output (inline in prompt) |
| Test Plan                                          | util/manual-tests/ecom-checkout-test-plan.md |
| Test Data JSON                                     | tests/data/checkout-test-data.json |
| Exploratory Testing Findings                       | util/manual-tests/exploratory-testing-findings.md |
| Automation — Page Objects                          | tests/pages/ |
| Automation — Spec Files                            | tests/checkout/ |
| Initial Run Report (JSON)                          | reports/runs/<timestamp>/test-results.json |
| Failure Triage                                     | reports/runs/<timestamp>/failure-triage.md |
| Healing Log                                        | reports/runs/<timestamp>/healing-log.md |
| Post-Healing Run Report (JSON)                     | reports/runs/<timestamp>/test-results.json |
| Screenshots (exploratory)                          | reports/screenshots/ |
| Playwright HTML Report (screenshots + video embedded)  | reports/runs/<timestamp>/html-report/ |
| Per-test screenshots of expected (pass) condition  | reports/runs/<timestamp>/html-report/ (embedded per test) |
| Per-test video recordings                          | reports/runs/<timestamp>/html-report/ (embedded per test) |
| Per-test trace files                               | reports/runs/<timestamp>/html-report/ (embedded per test) |

### 6.2 Test Environment

| Item           | Detail |
|---|---|
| Application    | https://www.saucedemo.com |
| Test User      | standard_user |
| Browsers       | Chromium (latest), Firefox (latest), Safari / WebKit (latest) |
| OS             | macOS |
| Playwright     | <version from package.json> |
| Node.js        | <version> |
| Report Date    | <YYYY-MM-DD> |
```

---

### 7.4 Timestamp Rules

- The `Generated:` timestamp in the report header MUST be the actual wall-clock time at the moment the file is written, formatted as `YYYY-MM-DD HH:MM:SS`.
- Every defect entry in Section 5 MUST include a `Timestamp:` field set to the time the bug was first discovered (from the exploratory findings or healing log).
- If a timestamp is not available in the source data, use the report generation time and note `(estimated)`.

### 7.5 Report Quality Rules

- No placeholder text (`<n>`, `<title>`, `…`) may remain in the final file — every field must be filled from actual data.
- Every BUG-* reference in Sections 2 and 3 must have a corresponding full entry in Section 5.
- Every HEAL-* reference in Section 3.3 must have a corresponding entry in `reports/runs/<timestamp>/healing-log.md`.
- Every automated test entry in the Playwright HTML report must have an embedded **screenshot of the expected final condition** (the state captured at test end, not just on failure).
- Every automated test entry in the Playwright HTML report must have an embedded **video recording** of the full test execution.
- The `reports/runs/<timestamp>/html-report/` folder must exist and be accessible before the written report references it. If it does not exist, re-run the final test suite with the correct `playwright.config.ts` settings before writing the report.
- The Overall Status in Section 1 is determined as follows:
  - **PASS** — all tests pass, zero open defects.
  - **PASS WITH DEFECTS** — all tests pass or are `test.fail()` with logged bugs, at least one open defect exists.
  - **FAIL** — one or more tests fail without a linked bug report.

### 7.6 Output File

```
reports/runs/<timestamp>/test-report-<YYYY-MM-DD>.md
```

---

## STEP 8 — Final Checklist for the QA AI Agent Workflow

Before declaring the engagement complete, verify every item below. All items must be checked. If any item fails, return to the relevant step and resolve it before proceeding.

### Planning & Coverage
- [ ] Every scenario from Section 2.3 has a corresponding test plan entry in `util/manual-tests/ecom-checkout-test-plan.md`
- [ ] Every test plan entry references a unique output file path under `tests/`
- [ ] Every output file path uses kebab-case naming
- [ ] Every test step in the plan maps to exactly one expected result
- [ ] Test plan covers Chrome, Firefox, and Safari as per the Technical Notes in the user story
- [ ] All 5 Acceptance Criteria (AC1–AC5) are covered by at least one test case

### Test Data
- [ ] Every test plan entry references the correct `testData.<scenarioKey>` from `tests/data/checkout-test-data.json`
- [ ] The JSON file contains every scenario key referenced in the test plan
- [ ] Test data JSON contains no hard-coded selectors — only input values and expected output strings
- [ ] Seed file is referenced correctly as `tests/seed.spec.ts` in every entry

### Automation & Healing
- [ ] All POM files exist as defined in Step 5 Section 5.3
- [ ] No spec file contains inline `page.fill()` or `page.click()` calls — all actions go through page objects
- [ ] No spec file contains `page.waitForTimeout()`
- [ ] `reports/runs/<timestamp>/healing-log.md` has an entry for every fix applied in Step 6
- [ ] `reports/runs/<timestamp>/test-results.json` exists and shows no unexpected failures
- [ ] No test is deleted, skipped, or commented out without a linked bug report
- [ ] `playwright.config.ts` has `screenshot: 'on'`, `video: 'on'`, and `trace: 'on'`
- [ ] `reports/runs/<timestamp>/html-report/` folder exists and every test entry has an embedded screenshot, video, and trace
- [ ] Every passing test body ends with a `captureScreenshot('<TestID>-expected-condition')` call

### Test Report
- [ ] `reports/runs/<timestamp>/test-report-<YYYY-MM-DD>.md` exists and contains no unfilled placeholder values (`<n>`, `<title>`, `…`)
- [ ] Every BUG-* referenced in the report has a full defect entry in Section 5 of the report
- [ ] Every HEAL-* referenced in the report has a matching entry in `healing-log.md`
- [ ] Report Overall Status reflects the actual final test suite outcome
- [ ] All defect entries include a timestamp
- [ ] Every defect entry has a `Video Recording` field pointing to the video in `reports/runs/<timestamp>/html-report/`
- [ ] The Appendix artefact index lists `reports/runs/<timestamp>/html-report/` as the source for embedded screenshots and video recordings
