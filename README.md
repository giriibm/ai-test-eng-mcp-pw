# AI QA Agent — Playwright Test Automation Suite

A comprehensive AI-driven QA automation framework featuring **57 automated tests**:
- **UI Testing**: E2E test pipeline that reads user stories, generates manual test cases, builds structured test plans, performs exploratory testing, and produces self-healing Page Object Model (POM) test suites (17 tests)
- **API Testing**: Professional API test automation with service layer architecture, covering authentication, CRUD operations, and end-to-end workflows (37 tests)
- **BDD Smoke Tests**: Behavior-Driven Development tests using Gherkin syntax for quick validation and demo purposes (3 tests)

---

## How It Works

### UI Testing Pipeline

The UI testing pipeline is split into five sequential parts, each driven by a dedicated AI agent:

| Part | Prompt File | Agent | Output |
|------|-------------|-------|--------|
| 1 | `e2e-qa-prompt-part1.md` | Playwright MCP Server | Manual test cases derived from the user story |
| 2 | `e2e-qa-prompt-part2.md` | Playwright Test Planner | Structured E2E test plan with selectors verified against the live app |
| 3 | `e2e-qa-prompt-part3.md` | Playwright MCP Server | Exploratory testing findings and bug reports |
| 4 | `e2e-qa-prompt-part4.md` | playwright-test-generator | Test data JSON + POM automation scripts |
| 5 | `e2e-qa-prompt-part5.md` | playwright-test-healer | Healed test suite + final test report |

> Execute parts strictly in order. Do not begin a part until all outputs of the previous part exist on disk.

### API Testing Pipeline

The API testing follows a comprehensive, production-ready approach:

| Phase | Description | Output |
|-------|-------------|--------|
| 1 | Manual Test Case Design | 32 documented test cases in `util/manual-tests/api-manual-test-cases.md` |
| 2 | Service Layer Implementation | BaseApiClient, AuthService, BookingService in `helpers/api/` |
| 3 | Test Data Management | Centralized test data with type safety in `test-data/api/` |
| 4 | Test Automation | 37 automated tests across auth, CRUD, and E2E scenarios |
| 5 | Execution & Reporting | 100% passing tests with HTML reports and traces |

**Key Features**:
- ✅ Service layer pattern for clean, maintainable code
- ✅ TypeScript type safety throughout
- ✅ 37 automated tests (116% coverage of manual test cases)
- ✅ Authentication, CRUD operations, and E2E workflows
- ✅ Parallel execution with 6 workers
- ✅ Comprehensive documentation and examples

### BDD Smoke Testing

The BDD smoke tests provide quick validation using business-readable Gherkin syntax:

| Feature | Scenarios | Execution Time |
|---------|-----------|----------------|
| E-commerce Checkout | 2 UI scenarios | ~4s |
| Booking API Lifecycle | 1 API scenario | ~5s |

**Key Features**:
- ✅ Gherkin syntax readable by non-technical stakeholders
- ✅ Reuses existing Page Objects and API Services
- ✅ Fast execution (< 6 seconds for 3 critical paths)
- ✅ playwright-bdd framework integration
- ✅ Perfect for CI/CD smoke testing and demos
- ✅ Living documentation as executable specifications

---

## Pipeline Steps

### UI Testing Pipeline

#### Step 1 — Manual Test Cases
The agent reads `util/userstory/ecom-checkout.md`, extracts every Acceptance Criterion, business rule, and technical note, and produces structured `TC-*` test case blocks grouped by AC into `util/manual-tests/manual-test-cases.md`.

#### Step 2 — E2E Test Plan
The Playwright Test Planner navigates the live application, visually inspects each page, and builds a complete test plan in `util/manual-tests/ecom-checkout-test-plan.md` with accurate selectors and expected outcomes.

#### Step 3 — Exploratory Testing
The agent exercises the application beyond the scripted paths, logs unexpected behaviours, and saves findings to `util/manual-tests/exploratory-testing-findings.md`.

#### Step 4 — Automated Test Generation
The playwright-test-generator agent creates:
- `tests/ui/data/checkout-test-data.json` — all test data in one place
- `tests/ui/pages/*.ts` — Page Object Model classes for every page
- `tests/ui/helpers/TestDataHelper.ts` — helper utilities
- `tests/ui/checkout/*.spec.ts` — one spec file per test scenario

#### Step 5 — Test Healing & Final Report
The playwright-test-healer agent:
1. Runs the full suite and captures the initial results
2. Triages every failure (selector drift, timing, data mismatch)
3. Applies targeted fixes to specs and page objects
4. Re-runs the suite to confirm all tests pass
5. Writes the final report to `reports/runs/<timestamp>/test-report-<YYYY-MM-DD>.md`

### API Testing Implementation

#### Phase 1 — Manual Test Design
Document comprehensive test scenarios in `util/manual-tests/api-manual-test-cases.md`:
- Authentication tests (valid/invalid credentials)
- CRUD operations (Create, Read, Update, Delete bookings)
- Filtering and search scenarios
- Authorization tests (with/without auth)
- Negative test cases

#### Phase 2 — Service Layer Implementation
Build reusable API service classes following the service layer pattern:
- `BaseApiClient.ts`: Core HTTP methods (GET, POST, PUT, PATCH, DELETE)
- `AuthService.ts`: Token generation, cookie/header management
- `BookingService.ts`: All booking CRUD operations with filtering

#### Phase 3 — Test Data Management
Create centralized, type-safe test data in `test-data/api/booking-test-data.ts`:
- Authentication credentials (valid/invalid)
- Booking templates (complete, minimum, special chars, edge cases)
- Helper functions for dynamic data generation

#### Phase 4 — Test Automation
Implement automated tests organized by functionality:
- `tests/api/auth/`: Authentication endpoint tests (4 tests)
- `tests/api/booking/`: CRUD operation tests (29 tests)
- `tests/api/e2e/`: End-to-end workflow tests (4 tests)

#### Phase 5 — Execution & Validation
Run tests with parallel execution, generate reports:
- All 37 tests passing (100% success rate)
- HTML reports with traces and screenshots
- Timestamped test artifacts for debugging

---

## Project Structure

```
.
├── util/
│   ├── userstory/
│   │   └── ecom-checkout.md               # Source user story (SCRUM-101)
│   ├── prompts/
│   │   ├── e2e-qa-prompt-part1.md         # Prompt: manual test cases (UI)
│   │   ├── e2e-qa-prompt-part2.md         # Prompt: test plan (UI)
│   │   ├── e2e-qa-prompt-part3.md         # Prompt: exploratory testing (UI)
│   │   ├── e2e-qa-prompt-part4.md         # Prompt: test generation (UI)
│   │   ├── e2e-qa-prompt-part5.md         # Prompt: healing + report (UI)
│   │   ├── api-test-automation-prompt.md  # Prompt: API test suite
│   │   └── bdd-test-automation-prompt.md  # Prompt: BDD smoke tests
│   ├── manual-tests/
│   │   ├── manual-test-cases.md           # UI test cases
│   │   ├── ecom-checkout-test-plan.md     # UI test plan
│   │   ├── exploratory-testing-findings.md
│   │   ├── api-manual-test-cases.md       # API test cases (32 tests)
│   │   └── bdd-smoke-test-cases.md        # BDD test cases in Gherkin (3 tests)
│   └── design-doc/
├── tests/
│   ├── ui/                                # UI Test Suite
│   │   ├── data/
│   │   │   └── checkout-test-data.json    # UI test data
│   │   ├── helpers/
│   │   │   └── TestDataHelper.ts
│   │   ├── pages/                         # Page Object Models
│   │   │   ├── BasePage.ts
│   │   │   ├── LoginPage.ts
│   │   │   ├── InventoryPage.ts
│   │   │   ├── CartPage.ts
│   │   │   ├── CheckoutStepOnePage.ts
│   │   │   ├── CheckoutStepTwoPage.ts
│   │   │   └── CheckoutCompletePage.ts
│   │   └── checkout/                      # 17 UI test specs
│   │       ├── happy-path-complete-checkout.spec.ts
│   │       ├── negative-*.spec.ts         # Validation error scenarios
│   │       ├── edge-*.spec.ts             # Edge case scenarios
│   │       ├── nav-*.spec.ts              # Navigation flow scenarios
│   │       └── ui-*.spec.ts               # UI visibility scenarios
│   └── api/                               # API Test Suite
│       ├── auth/
│       │   └── auth.spec.ts               # Authentication tests (4 tests)
│       ├── booking/
│       │   ├── create-booking.spec.ts     # Booking creation (8 tests)
│       │   ├── get-booking.spec.ts        # Booking retrieval (8 tests)
│       │   ├── update-booking.spec.ts     # Booking updates (7 tests)
│       │   └── delete-booking.spec.ts     # Booking deletion (6 tests)
│       ├── e2e/
│       │   └── complete-lifecycle.spec.ts # End-to-end workflows (4 tests)
│       └── README.md                      # API test documentation
│   └── bdd/                               # BDD Smoke Tests
│       ├── features/                      # Gherkin feature files
│       │   ├── ui/
│       │   │   └── checkout-smoke.feature # UI smoke scenarios (2 tests)
│       │   └── api/
│       │       └── booking-smoke.feature  # API smoke scenario (1 test)
│       └── steps/                         # Step definitions
│           ├── ui/
│           │   └── checkout-steps.ts      # Reuses Page Objects
│           └── api/
│               └── booking-steps.ts       # Reuses API Services
├── fixtures/
│   └── bdd-fixtures.ts                    # BDD test fixtures
├── helpers/
│   └── api/                               # API Service Layer
│       ├── BaseApiClient.ts               # Base HTTP client
│       ├── AuthService.ts                 # Authentication service
│       └── BookingService.ts              # Booking service
├── test-data/
│   └── api/
│       └── booking-test-data.ts           # API test data & generators
├── reports/
│   ├── screenshots/                       # Manual evidence PNGs
│   └── runs/
│       └── <YYYY-MM-DD_HH-MM-SS>/        # One folder per test run
│           ├── artifacts/                 # Videos, traces, screenshots (gitignored)
│           ├── html-report/              # Playwright HTML report (gitignored)
│           └── test-results.json         # JSON summary (committed)
├── .github/
│   ├── agents/                            # AI agent definitions
│   │   ├── playwright-test-generator.agent.md
│   │   ├── playwright-test-healer.agent.md
│   │   └── playwright-test-planner.agent.md
│   └── workflows/
│       └── playwright.yml                 # CI pipeline
├── playwright.config.ts                   # Playwright configuration (UI + API projects)
└── package.json                           # Dependencies & test scripts
```

---

## Applications Under Test

### UI Testing
**URL**: https://www.saucedemo.com  
**Feature**: E-commerce checkout flow (cart → shipping info → order review → confirmation)  
**Credentials**: `standard_user` / `secret_sauce`

### API Testing
**URL**: https://restful-booker.herokuapp.com  
**API**: Restful-Booker API (Hotel booking REST API)  
**Documentation**: https://restful-booker.herokuapp.com/apidoc/index.html  
**Auth**: Token-based and Basic Auth (`admin` / `password123`)

---

## Test Coverage

### UI Tests (17 tests)
| Category | Spec Files |
|----------|-----------|
| Happy Path | Complete checkout end-to-end |
| Negative | All fields empty, first/last name empty, zip empty, special characters, long strings |
| Edge Cases | Single product, cart badge count, single-char fields, numeric-only names |
| Navigation | Back to home, cancel step one, cancel step two, continue shopping |
| UI | Cart page elements, checkout step one elements |

### API Tests (37 tests)
| Category | Tests | Description |
|----------|-------|-------------|
| Authentication | 4 | Token creation, validation, expiry handling |
| Create Booking | 8 | Standard creation, required fields, optional fields, validation |
| Get Booking | 8 | Retrieval by ID, filtering, non-existent bookings, pagination |
| Update Booking | 7 | Full/partial updates, authorization, idempotency, concurrency |
| Delete Booking | 6 | Deletion, authorization, non-existent resources, idempotency |
| E2E Workflows | 4 | Complete booking lifecycle, multi-booking operations |

### BDD Smoke Tests (3 tests)
| Feature | Scenarios | Description |
|---------|-----------|-------------|
| E-commerce Checkout | 2 | Complete checkout flow, cart navigation with Gherkin syntax |
| Booking API | 1 | Complete lifecycle (Create → Retrieve → Update → Delete) |

**Total**: 57 automated tests (17 UI + 37 API + 3 BDD Smoke)

---

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npx playwright install
```

## Running Tests

### All Tests
```bash
# Run ALL tests (UI + API, excludes BDD)
npm test

# Run UI tests only (17 tests)
npm run test:ui

# Run API tests only (37 tests)
npm run test:api
```

### BDD Smoke Tests
```bash
# Run BDD smoke tests (3 tests, ~5 seconds)
npm run test:bdd

# Run UI BDD tests only (2 tests)
npm run test:bdd:ui

# Run API BDD test only (1 test)
npm run test:bdd:api
```

### Advanced Options
```bash
# Run specific test suite
npx playwright test tests/ui/checkout/happy-path-complete-checkout.spec.ts
npx playwright test tests/api/auth/auth.spec.ts

# Run tests across all browsers (UI only)
npx playwright test --project=UI-Chrome --project=UI-Firefox --project=UI-Safari

# Run specific BDD project
npx playwright test --project=BDD-Smoke

# Open interactive UI mode
npx playwright test --ui

# View last test report
npm run show-report
```

---

## Reports

Every test run creates a timestamped folder so no results are ever overwritten:

```
reports/runs/
└── 2026-05-18_14-30-00/
    ├── artifacts/          ← videos, traces, screenshots per test  (gitignored)
    ├── html-report/        ← full Playwright HTML report           (gitignored)
    └── test-results.json   ← JSON pass/fail summary                (committed)
```

The `test-results.json` from every run is committed to git, giving you a lightweight history of pass/fail counts over time. The large binary artifacts (videos, traces) are gitignored.

Manual evidence screenshots captured by spec files are saved to `reports/screenshots/`.

---

## Configuration

The `playwright.config.ts` defines separate projects for different test types:
- **BDD-Smoke**: Gherkin-based smoke tests (3 tests, both UI and API)
- **UI-Chrome/Firefox/Safari**: Browser-based E2E tests with screenshots, videos, and traces
- **API-Tests**: API tests with request/response logging

### BDD Test Generation
BDD tests use `playwright-bdd` which generates Playwright test files from Gherkin feature files:
```bash
# Generate test files from .feature files
npx bddgen test

# Generated files are placed in .features-gen/ (gitignored)
```

Screenshots, videos, and traces are captured for UI and BDD tests. Additional browsers (Firefox, Safari) are available but can be enabled/disabled in the config as needed.

Environment variables (e.g., API keys for MCP tools) are stored in `.env`, which is excluded from version control via `.gitignore`.

---

## Test Execution Summary

| Test Suite | Tests | Typical Duration | Purpose |
|------------|-------|------------------|----------|
| **BDD Smoke** | 3 | ~5s | Quick validation, demos, CI/CD smoke testing |
| **UI Tests** | 17 | ~40s | Comprehensive E-commerce checkout validation |
| **API Tests** | 37 | ~25s | Complete API endpoint coverage |
| **TOTAL** | **57** | **~70s** | Full regression suite |

**Recommendation**: Run BDD smoke tests on every commit, full suite nightly or on release branches.

