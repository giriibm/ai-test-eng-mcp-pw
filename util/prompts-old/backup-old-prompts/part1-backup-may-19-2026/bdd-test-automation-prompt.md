# BDD Smoke Test Automation Prompt - Playwright BDD

## 🎯 Objective
Create a focused Behavior-Driven Development (BDD) smoke test suite using Gherkin syntax and playwright-bdd framework. This suite serves as a quick validation of critical functionality for demo and CI/CD pipelines.

---

## 📋 Requirements

### Scope
- **Test Count**: 3 smoke tests only (2 UI + 1 API)
- **Purpose**: Demo and rapid smoke testing
- **Framework**: playwright-bdd with Gherkin feature files
- **Organization**: Separate `tests/bdd/` folder for isolation
- **Pattern**: Given-When-Then syntax with reusable step definitions

### Applications Under Test

#### UI Testing
- **URL**: https://www.saucedemo.com
- **Feature**: E-commerce checkout flow
- **Credentials**: `standard_user` / `secret_sauce`

#### API Testing
- **URL**: https://restful-booker.herokuapp.com
- **API**: Restful-Booker API
- **Auth**: `admin` / `password123`

---

## 🏗️ Architecture Requirements

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

## 📊 Test Coverage Requirements

### UI Smoke Tests (2 tests)

#### Test 1: Complete Checkout with Single Product
```gherkin
Feature: E-commerce Checkout Smoke Tests

  Scenario: User can complete checkout with single product
    Given the user is logged in as "standard_user"
    When the user adds "Sauce Labs Backpack" to cart
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
    Given the user is logged in as "standard_user"
    When the user adds "Sauce Labs Bike Light" to cart
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
    Given authentication token is obtained with credentials:
      | username | password    |
      | admin    | password123 |
    When a new booking is created with:
      | firstname | lastname | totalprice | depositpaid | checkin    | checkout   |
      | John      | Doe      | 200        | true        | 2026-06-01 | 2026-06-05 |
    Then the booking should be created successfully
    And the booking should be retrievable by ID
    When the booking is updated with new dates:
      | checkin    | checkout   |
      | 2026-07-01 | 2026-07-10 |
    Then the booking should reflect the updated dates
    When the booking is deleted
    Then the booking should no longer exist
```

---

## 🔧 Implementation Steps

### Step 1: Install playwright-bdd
```bash
npm install -D playwright-bdd
```

### Step 2: Configure playwright-bdd
Add to `playwright.config.ts`:
```typescript
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  paths: ['tests/bdd/features/**/*.feature'],
  require: ['tests/bdd/steps/**/*.ts'],
});

export default defineConfig({
  testDir,
  // ... existing config
});
```

### Step 3: Add npm script
Add to `package.json`:
```json
{
  "scripts": {
    "test:bdd": "playwright test --project=BDD-Smoke",
    "test:bdd:ui": "playwright test tests/bdd/features/ui",
    "test:bdd:api": "playwright test tests/bdd/features/api"
  }
}
```

### Step 4: Create Feature Files
Create Gherkin feature files in `tests/bdd/features/` following the scenarios above.

### Step 5: Generate Step Definitions
```bash
npx bddgen --features tests/bdd/features
```

### Step 6: Implement Step Definitions
- **UI Steps**: Reuse existing Page Objects from `tests/pages/`
- **API Steps**: Reuse existing Service Layer from `helpers/api/`

Example UI Step Definition:
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../../pages/LoginPage';

Given('the user is logged in as {string}', async ({ page }, username) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, 'secret_sauce');
});
```

Example API Step Definition:
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { AuthService } from '../../../helpers/api/AuthService';
import { BookingService } from '../../../helpers/api/BookingService';

Given('authentication token is obtained with credentials:', async ({ context }, dataTable) => {
  const credentials = dataTable.hashes()[0];
  const authService = new AuthService(context);
  const response = await authService.createToken(credentials);
  // Store token in context
});
```

---

## ✅ Acceptance Criteria

### Functionality
- ✅ All 3 smoke tests pass consistently
- ✅ Tests use proper Gherkin syntax (Given-When-Then)
- ✅ Feature files are business-readable
- ✅ Step definitions reuse existing Page Objects and Services

### Code Quality
- ✅ TypeScript type safety maintained
- ✅ No duplicate step definitions
- ✅ Clear, descriptive step names
- ✅ Proper error handling

### Performance
- ✅ All 3 tests complete in < 30 seconds
- ✅ Tests run independently (no dependencies)
- ✅ Can run in parallel

### Documentation
- ✅ Manual test cases documented in Gherkin format
- ✅ README.md updated with BDD test section
- ✅ Clear execution instructions

---

## 📈 Expected Test Execution

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

## 🎯 Key Benefits of This BDD Approach

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

## 📝 Manual Test Cases Reference

Create manual test cases in `util/manual-tests/bdd-smoke-test-cases.md` with:
- Full Gherkin syntax for all 3 scenarios
- Expected results for each step
- Test data requirements
- Prerequisites and setup instructions

---

## 🚀 Execution Workflow

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

## 🎬 Demo Talking Points

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

## 📚 Related Documentation

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
