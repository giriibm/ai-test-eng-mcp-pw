# E2E QA Prompt — Part 2 of 5: E2E Test Plan

> **Before starting: read `util/prompts/aut-config.md`.**
> That file is the single source of truth for the application URL, credentials, selector strategy, and known behaviours. Use those values everywhere in this prompt. Do not hardcode URLs or credentials.
>
> **File path substitution**: This prompt uses `ecom-checkout` as the default app slug in all file names. Read the actual `appSlug` from `util/prompts/aut-config.md` Section 0 and substitute it everywhere before proceeding.

**Part** : 2 of 5 | **Agent** : Playwright Test Planner | **Step covered** : Step 2

---

## Pipeline Overview

| Part | File | Agent | Steps | Focus |
|---|---|---|---|---|
| Part 1 | `ui-step1-manual-test-cases.md` | Playwright MCP Server | Step 1 | Derive manual test cases from user story |
| **Part 2 — this file** | `ui-step2-test-plan.md` | Playwright Test Planner | Step 2 | Build structured E2E test plan |
| Part 3 | `ui-step3-exploratory-testing.md` | Playwright MCP Server | Step 3 | Exploratory testing + bug reports |
| Part 4 | `ui-step4-test-generation.md` | playwright-test-generator | Steps 4–5 | Test data JSON + POM automation scripts |
| Part 5 | `ui-step5-self-heal-report.md` | playwright-test-healer | Steps 6–7 | Test healing + final test report |

**Execute parts strictly in order. Do not begin a part until all outputs of the previous part exist on disk.**

---

## Inputs Required

| File | Source |
|---|---|
| `util/manual-tests/manual-test-cases.md` | Output of Part 1 — must exist before starting this part |

## Outputs Produced by This Part

| File | Content |
|---|---|
| `util/manual-tests/ecom-checkout-test-plan.md` | Complete structured test plan, one entry per scenario from Section 2.3 |

---

## How to Use This Part

1. Confirm `util/manual-tests/manual-test-cases.md` exists on disk (output of Part 1).
2. Paste this file into the **Playwright Test Planner** agent chat.
3. The agent navigates the live application, then builds the full test plan from the manual test cases.
4. The plan is saved to `util/manual-tests/ecom-checkout-test-plan.md`.
5. Verify the output file exists before proceeding to Part 3.

---

## STEP 2 — Create the Playwright Test Plan

### 2.1 Instructions for the Playwright Test Planner agent

Using the manual test cases in `util/manual-tests/manual-test-cases.md` (produced in Part 1), the **Playwright Test Planner** must generate a complete, production-ready test plan.

The agent must:

1. Navigate to the application under test:
   - **URL**: read from `util/prompts/aut-config.md` Section 1 (UI Base URL)
   - **Credentials**: read from `util/prompts/aut-config.md` Section 1 (UI credentials)

2. Visually inspect each page involved in the checkout flow (login, products, cart, checkout-step-one, checkout-step-two, checkout-complete) before writing any test step, so that selectors and element labels are accurate.

3. For every manual test case from `util/manual-tests/manual-test-cases.md` produce a corresponding test plan entry using the structure below.

### 2.2 Test plan entry structure

```
Test ID          : <TC-AC_NUMBER-SEQ from manual test cases>
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

## Before Proceeding to Part 3

Confirm every item below before opening `ui-step3-exploratory-testing.md`.

- [ ] `util/manual-tests/ecom-checkout-test-plan.md` exists on disk
- [ ] All 19 scenarios (HP-01 through UI-04) have a test plan entry
- [ ] Every entry has an `Output File` path under `tests/checkout/` using kebab-case naming
- [ ] Every entry has a `Test Data Reference` key pointing to `tests/data/checkout-test-data.json`
- [ ] Every test step maps to exactly one `Expected:` result
- [ ] The agent visually inspected all 6 pages before writing any steps

**Do not open Part 3 until all items above are checked.**
