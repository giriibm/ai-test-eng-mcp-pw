# BDD Smoke Test Automation Prompt - Playwright BDD

> **Before starting: read `util/prompts/aut-config.md`.**
> That file is the single source of truth for both the UI and API application URLs, credentials, and known behaviours. Use those values everywhere. Do not hardcode URLs or credentials.

## Objective
Create a focused Behavior-Driven Development (BDD) smoke test suite using Gherkin syntax and playwright-bdd framework. This suite serves as a quick validation of critical functionality for demo and CI/CD pipelines.

---

## Requirements

### Scope
- **Test Count**: 3 smoke tests only (2 UI + 1 API)
- **Purpose**: Demo and rapid smoke testing
- **Framework**: playwright-bdd with Gherkin feature files
- **Organization**: Separate `tests/bdd/` folder for isolation
- **Pattern**: Given-When-Then syntax with reusable step definitions

### Applications Under Test

Read **all** application details from `util/prompts/aut-config.md`:
- Section 1 for the UI app: base URL, credentials, selector strategy, known behaviours
- Section 2 for the API app: base URL, auth credentials, endpoint list, known behaviours
- Section 3 for the BDD scope: which scenarios to cover for each app

Do not hardcode any URL, credential, product name, or endpoint in this prompt or in generated files.

---

## Architecture Requirements

### Folder Structure
```
tests/bdd/
├── features/
│   ├── ui/
│   │   └── checkout-smoke.feature      # 2 UI smoke tests in Gherkin
│   └── api/
│       └── booking-smoke.feature       # 1 API smoke test in Gherkin
└── steps/
    ├── ui/
    │   └── checkout-steps.ts           # Step definitions for UI tests
    └── api/
        └── booking-steps.ts            # Step definitions for API tests

util/manual-tests/
└── bdd-smoke-test-cases.md            # Manual test cases in Gherkin format

util/prompts/
└── bdd-test-automation-prompt.md      # This file
```

### Technology Stack
- **playwright-bdd**: Converts Gherkin to Playwright tests
- **Cucumber/Gherkin**: Feature file syntax
- **TypeScript**: Step definition implementation
- **Existing Infrastructure**: Reuse Page Objects and API Services

---

## Test Coverage Requirements

### UI Smoke Tests (2 tests)

#### Test 1: Complete Checkout with Single Product
```gherkin
Feature: E-commerce Checkout Smoke Tests

  Scenario: User can complete checkout with single product
    Given the user is logged in as a standard user
    When the user adds the first available product to cart
    And the user navigates to cart page
    And the user proceeds to checkout
    And the user enters shipping information:
      | firstName | lastName | zipCode |
      | John      | Doe      | 12345   |
    And the user continues to order review
    And the user completes the order
    Then the order confirmation page should display "Thank you for your order!"
```

#### Test 2: View Cart and Continue Shopping
```gherkin
  Scenario: User can view cart and return to shopping
    Given the user is logged in as a standard user
    When the user adds a product to cart
    And the user navigates to cart page
    Then the cart badge should show "1"
    When the user clicks "Continue Shopping"
    Then the user should be on the inventory page
```

### API Smoke Test (1 test)

#### Test 3: Complete Booking Lifecycle
```gherkin
Feature: Booking API Smoke Tests

  Scenario: Complete booking lifecycle - Create, Retrieve, Update, Delete
    Given authentication token is obtained using credentials from the testData fixture
    When a new booking is created with future dates computed at runtime
    Then the booking should be created successfully
    And the booking should be retrievable by ID
    When the booking is updated with new future dates
    Then the booking should reflect the updated dates
    When the booking is deleted
    Then the booking should no longer exist

> Note: Never hardcode credentials or dates in feature files. Credentials are resolved inside step definitions from the `testData` fixture. Dates must always be future dates — use `generateFutureDates()` in the step definition, never a literal date string.
```

---

## Implementation Steps

### Step 0: Create fixtures/bdd-fixtures.ts

Before generating any step definitions, create the file `fixtures/bdd-fixtures.ts` using the env-var pattern below. Substitute the default values with the URLs and credentials from `util/prompts/aut-config.md` Sections 1 and 2:

```typescript
import { test as base, createBdd } from 'playwright-bdd';

export const test = base.extend({
  testData: async ({}, use) => {
    await use({
      ui: {
        baseUrl: process.env.UI_BASE_URL ?? '<UI_BASE_URL from aut-config.md>',
        credentials: {
          username: process.env.UI_USERNAME ?? '<UI_USERNAME from aut-config.md>',
          password: process.env.UI_PASSWORD ?? '<UI_PASSWORD from aut-config.md>',
        },
      },
      api: {
        baseUrl: process.env.API_BASE_URL ?? '<API_BASE_URL from aut-config.md>',
        credentials: {
          username: process.env.API_USERNAME ?? '<API_USERNAME from aut-config.md>',
          password: process.env.API_PASSWORD ?? '<API_PASSWORD from aut-config.md>',
        },
      },
    });
  },
});

export const { Given, When, Then } = createBdd(test);
```

This file can be safely deleted and regenerated by re-running this prompt.

### Step 1: Install playwright-bdd
```bash
npm install -D playwright-bdd
```

### Step 2: Create or update playwright.config.ts

If `playwright.config.ts` was already created by the UI pipeline (Part 4), verify it contains a `BDD-Smoke` project and the `defineBddConfig` block. If not, create the full file now.

The minimum required additions are:

```typescript
/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['tests/bdd/features/**/*.feature'],
  require: ['tests/bdd/steps/**/*.ts'],
});

export default defineConfig({
  // ... all other projects ...

  // BDD-Smoke project — must be present
  projects: [
    {
      name: 'BDD-Smoke',
      testDir: '.features-gen',
      testMatch: /.*\.feature\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on',
        video: 'on',
        trace: 'on',
      },
    },
    // ... keep all other projects ...
  ],
});
```

> If creating from scratch (no existing config), use the full template in `util/prompts/e2e-qa-prompt-part4.md` Step 3.5 as the base.

### Step 3: Add npm script
Add to `package.json`:
```json
{
  "scripts": {
    "test:bdd": "bddgen && playwright test --project=BDD-Smoke",
    "test:bdd:ui": "bddgen && playwright test .features-gen/tests/bdd/features/ui --project=BDD-Smoke",
    "test:bdd:api": "bddgen && playwright test .features-gen/tests/bdd/features/api --project=BDD-Smoke"
  }
}
```

> Note: `bddgen` generates test files only. `playwright test` runs them separately. Never use `bddgen test` (which would run tests twice).

### Step 4: Create Feature Files
Create Gherkin feature files in `tests/bdd/features/` following the scenarios above.

### Step 5: Generate Step Definitions
```bash
npx bddgen --features tests/bdd/features
```

### Step 6: Implement Step Definitions

**Critical quality rules for all step definition files:**

- Import `Given`, `When`, `Then` exclusively from `fixtures/bdd-fixtures.ts` using `createBdd(test)`. Never call bare `createBdd()` — the custom fixtures must be bound.
- Test context (auth token, booking ID, etc.) must be scoped per-scenario using a Playwright fixture, not a module-level object. A module-level object is shared across all scenarios and causes data leakage and race conditions when tests run in parallel.
- Never use `page.waitForSelector()` — it is deprecated. Use `await expect(page.locator('...')).toBeVisible()` instead.
- Never put credentials (`username`, `password`) in `.feature` files. Use generic step text like `Given the user is logged in as a standard user` and resolve credentials inside the step definition from `process.env` or the `testData` fixture.
- Use `data-test` attribute selectors, not CSS class names.
- API step files must include an `After` hook that deletes any booking created during the scenario, wrapped in `try/finally`.

Example UI Step Definition (correct pattern):
```typescript
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../../../fixtures/bdd-fixtures';
import { LoginPage } from '../../../ui/pages/LoginPage';

const { Given, When, Then } = createBdd(test);

Given('the user is logged in as a standard user', async ({ page, testData }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto(testData.ui.baseUrl);
  await loginPage.login(testData.ui.credentials.username, testData.ui.credentials.password);
  await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
});
```

Example API Step Definition (correct pattern with per-scenario context fixture):
```typescript
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../../../fixtures/bdd-fixtures';
import { AuthService } from '../../../../helpers/api/AuthService';
import { BookingService } from '../../../../helpers/api/BookingService';

const { Given, When, Then, After } = createBdd(test);

// Per-scenario context stored in a Map keyed by Playwright's test object
const ctx = new WeakMap<object, { authToken?: string; bookingId?: number }>();

function getCtx(world: object) {
  if (!ctx.has(world)) ctx.set(world, {});
  return ctx.get(world)!;
}

After(async ({ request, $test }) => {
  const c = ctx.get($test);
  if (c?.bookingId) {
    const auth = new AuthService(request);
    const svc = new BookingService(request);
    const tokenResp = await auth.createToken({
      username: process.env.API_USERNAME ?? 'admin',
      password: process.env.API_PASSWORD ?? 'password123',
    });
    const headers = auth.createAuthCookie(await auth.getToken(tokenResp));
    try { await svc.deleteBooking(c.bookingId, headers); }
    finally { c.bookingId = undefined; }
  }
});
```

---

## Acceptance Criteria

### Functionality
- All 3 smoke tests pass consistently
- Tests use proper Gherkin syntax (Given-When-Then)
- Feature files are business-readable
- No credentials appear in `.feature` files
- Step definitions import `Given`/`When`/`Then` from `fixtures/bdd-fixtures.ts` via `createBdd(test)`
- API scenario context is per-scenario scoped, not module-level
- `After` hook ensures created bookings are deleted even when assertions fail
- Step definitions reuse existing Page Objects and Services

### Code Quality
- TypeScript type safety maintained
- No duplicate step definitions
- Clear, descriptive step names
- Proper error handling

### Performance
- All 3 tests complete in < 30 seconds
- Tests run independently (no dependencies)
- Can run in parallel

### Documentation
- Manual test cases documented in Gherkin format
- README.md updated with BDD test section
- Clear execution instructions

---

## Expected Test Execution

### Run Commands
```bash
# Run all BDD smoke tests (3 tests)
npm run test:bdd

# Run UI smoke tests only (2 tests)
npm run test:bdd:ui

# Run API smoke test only (1 test)
npm run test:bdd:api

# Run with HTML report
npm run test:bdd -- --reporter=html
```

### Expected Output
```
Running 3 tests using 3 workers

  ✓ features/ui/checkout-smoke.feature:3:5 › Complete checkout with single product (8s)
  ✓ features/ui/checkout-smoke.feature:15:5 › View cart and return to shopping (3s)
  ✓ features/api/booking-smoke.feature:3:5 › Complete booking lifecycle (5s)

  3 passed (16s)
```

---

## Key Benefits of This BDD Approach

### For Stakeholders
- **Business-Readable**: Gherkin syntax readable by non-technical stakeholders
- **Living Documentation**: Feature files serve as executable specifications
- **Quick Validation**: 3 critical paths validated in < 30 seconds

### For Developers
- **Reusability**: Leverages existing Page Objects and API Services
- **Maintainability**: Centralized step definitions, minimal duplication
- **Integration**: Works alongside existing 54 test suite

### For QA
- **Fast Feedback**: Rapid smoke test execution for CI/CD
- **Demo-Ready**: Clean, professional test output for presentations
- **Extensible**: Easy to add more scenarios without framework changes

---

## Manual Test Cases Reference

Create manual test cases in `util/manual-tests/bdd-smoke-test-cases.md` with:
- Full Gherkin syntax for all 3 scenarios
- Expected results for each step
- Test data requirements
- Prerequisites and setup instructions

---

## Execution Workflow

1. **Manual Test Case Creation**
   - Document 3 smoke tests in Gherkin format
   - Review and approve scenarios with stakeholders

2. **Feature File Creation**
   - Convert manual cases to `.feature` files
   - Validate Gherkin syntax

3. **Step Definition Generation**
   - Use `bddgen` to scaffold step definitions
   - Implement using existing Page Objects/Services

4. **Test Execution**
   - Run `npm run test:bdd`
   - Verify all 3 tests pass

5. **CI/CD Integration**
   - Add BDD smoke tests to pipeline
   - Run on every commit/PR

---

## Demo Talking Points

When demonstrating these BDD smoke tests:

1. **Show Feature Files**: Highlight business-readable Gherkin syntax
2. **Run Tests**: Execute `npm run test:bdd` showing fast execution
3. **Show Reports**: Display HTML report with Gherkin steps
4. **Explain Value**: 
   - Critical path validation in < 30 seconds
   - Business stakeholder collaboration via Gherkin
   - Part of comprehensive test strategy (54 total tests)
5. **Code Reuse**: Show how step definitions leverage existing POMs/Services

---

## Related Documentation

- **Existing Test Suite**: 54 tests (17 UI + 37 API)
- **UI Test Documentation**: `tests/ui/checkout/` (Page Object Model)
- **API Test Documentation**: `tests/api/README.md` (Service Layer)
- **Manual Test Cases**: 
  - UI: `util/manual-tests/manual-test-cases.md`
  - API: `util/manual-tests/api-manual-test-cases.md`
  - BDD: `util/manual-tests/bdd-smoke-test-cases.md` (new)

---

## 🏁 Success Metrics

- ✅ 3/3 smoke tests passing (100% success rate)
- ✅ Execution time < 30 seconds
- ✅ Zero flaky tests
- ✅ Business stakeholders can read and understand feature files
- ✅ Successfully integrated into CI/CD pipeline
- ✅ Demo-ready with clean, professional output

---

**End of BDD Test Automation Prompt**
