# AI QA Agent — Playwright Test Automation Suite

A comprehensive AI-driven QA automation framework featuring **57 automated tests** (or **11 tests** in demo mode — see [Generation Mode](#generation-mode)):
- **UI Testing**: E2E test pipeline that reads user stories, generates manual test cases, builds structured test plans, performs exploratory testing, and produces self-healing Page Object Model (POM) test suites (17 tests)
- **API Testing**: Professional API test automation with service layer architecture, covering authentication, CRUD operations, and end-to-end workflows — with built-in run, triage, and self-heal step (37 tests)
- **BDD Smoke Tests**: Behavior-Driven Development tests using Gherkin syntax for quick validation and demo purposes — with built-in run, triage, and self-heal step (3 tests)

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

A single prompt (`api-test-automation-prompt.md`) drives the entire API pipeline end-to-end, including a final self-heal loop:

| Phase | Description | Output |
|-------|-------------|--------|
| 1 | Pre-flight | `npm install` + `npx playwright install --with-deps` |
| 2 | Manual Test Case Design | 32 documented test cases in `util/manual-tests/api-manual-test-cases.md` |
| 3 | Service Layer Implementation | `BaseApiClient`, `AuthService`, `BookingService` in `helpers/api/` |
| 4 | Test Data Management | Centralized test data with type safety in `test-data/api/` |
| 5 | Test Automation | 37 automated tests across auth, CRUD, and E2E scenarios |
| 6 | Run, Triage & Self-Heal | Run suite → triage any failures → fix → re-run until 100% pass → save report |

**Key Features**:
- ✅ Service layer pattern for clean, maintainable code
- ✅ TypeScript type safety throughout
- ✅ 37 automated tests (116% coverage of manual test cases)
- ✅ Authentication, CRUD operations, and E2E workflows
- ✅ Parallel execution with 6 workers
- ✅ Built-in self-heal loop — exits only when all tests pass

### BDD Smoke Testing

A single prompt (`bdd-test-automation-prompt.md`) drives the entire BDD pipeline end-to-end, including a final self-heal loop:

| Step | Description | Output |
|------|-------------|--------|
| 0 | Pre-flight | `npm install` + `npx playwright install --with-deps` |
| 1 | Fixtures | `fixtures/bdd-fixtures.ts` |
| 2 | Config | `BDD-Smoke` project added to `playwright.config.ts` |
| 3 | Page Object stubs | Creates `tests/ui/pages/` stubs if UI pipeline has not run yet |
| 4 | Feature Files | Gherkin `.feature` files in `tests/bdd/features/` |
| 5 | Step Definitions | TypeScript step files in `tests/bdd/steps/` |
| 6 | Run, Triage & Self-Heal | Run suite → triage any failures → fix → re-run until 3/3 pass → save report |

**Key Features**:
- ✅ Gherkin syntax readable by non-technical stakeholders
- ✅ Reuses existing Page Objects and API Services when available; creates stubs when they don't exist yet
- ✅ Fast execution (< 30 seconds for 3 critical paths)
- ✅ playwright-bdd framework integration
- ✅ Built-in self-heal loop — exits only when all tests pass
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

#### Phase 1 — Pre-flight
Run `npm install` and `npx playwright install --with-deps` before any generation.

#### Phase 2 — Manual Test Design
Document comprehensive test scenarios in `util/manual-tests/api-manual-test-cases.md`:
- Authentication tests (valid/invalid credentials)
- CRUD operations (Create, Read, Update, Delete bookings)
- Filtering and search scenarios
- Authorization tests (with/without auth)
- Negative test cases

#### Phase 3 — Service Layer Implementation
Build reusable API service classes following the service layer pattern:
- `BaseApiClient.ts`: Core HTTP methods (GET, POST, PUT, PATCH, DELETE)
- `AuthService.ts`: Token generation, cookie/header management
- `BookingService.ts`: All booking CRUD operations with filtering

#### Phase 4 — Test Data Management
Create centralized, type-safe test data in `test-data/api/booking-test-data.ts`:
- Authentication credentials (valid/invalid)
- Booking templates (complete, minimum, special chars, edge cases)
- Helper functions for dynamic data generation

#### Phase 5 — Test Automation
Implement automated tests organised by functionality:
- `tests/api/auth/`: Authentication endpoint tests (4 tests)
- `tests/api/booking/`: CRUD operation tests (29 tests)
- `tests/api/e2e/`: End-to-end workflow tests (4 tests)

#### Phase 6 — Run, Triage & Self-Heal
1. Run `npm run test:api`
2. For each failure, identify root cause from the triage table in the prompt (auth errors, 404s, type errors, cleanup failures)
3. Apply fixes and re-run
4. Repeat until all 37 tests pass
5. Save timestamped report to `reports/runs/<timestamp>/test-report-api-<YYYY-MM-DD>.md`

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

> The single source of truth for all application URLs, credentials, selector strategy, and known behaviours is **`util/prompts/aut-config.md`**. To change the application under test, update only that file.

### UI Testing
**URL**: see `util/prompts/aut-config.md` Section 1  
**Feature**: E-commerce checkout flow (cart → shipping info → order review → confirmation)  
**Credentials**: see `util/prompts/aut-config.md` Section 1

### API Testing
**URL**: see `util/prompts/aut-config.md` Section 2  
**API**: see `util/prompts/aut-config.md` Section 2  
**Auth**: see `util/prompts/aut-config.md` Section 2

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

## Generation Mode

`util/prompts/aut-config.md` Section 6 controls how many tests are generated when you run the prompts.

```
mode: demo    ← generate a focused demo suite  (5 UI + 3 API + 3 BDD = 11 tests)
mode: full    ← generate the full regression suite  (17 UI + 37 API + 3 BDD = 57 tests)
```

This is the **only field you need to change**. No other file needs editing.

### Demo Suite Scope (`mode: demo`)

When `mode: demo`, each prompt generates the minimum representative set:

| Suite | Count | Scenarios |
|---|---|---|
| UI | 5 | Happy Path checkout, All-fields-empty negative, One-product edge case, Back-to-home navigation, Cart page UI validation |
| API | 3 spec files | `auth.spec.ts` (token generation), `create-booking.spec.ts` (happy path), `complete-lifecycle.spec.ts` (full lifecycle) |
| BDD | 3 | All 3 BDD scenarios — already the minimum smoke scope, no reduction applied |

The demo suite runs in under 30 seconds and is ideal for showing the framework to stakeholders, CI smoke runs, or onboarding.

### Switching Between Modes

1. Open `util/prompts/aut-config.md`
2. Change the one line in Section 6: `mode: demo` ↔ `mode: full`
3. Delete generated code and re-run the prompts (see [Regenerating the Test Suite](#regenerating-the-test-suite))

---

## Regenerating the Test Suite

The entire test suite can be deleted and regenerated from the prompt files at any time. The prompt files and `package.json` are the only things you need to keep. Everything else — including `playwright.config.ts` — is regenerated by the prompts.

### What to Delete (generated code)

```
tests/            ← all spec files, page objects, BDD features & steps
helpers/api/      ← API service layer (AuthService, BaseApiClient, BookingService)
test-data/        ← API test data constants & generators
fixtures/         ← bdd-fixtures.ts
playwright.config.ts  ← config file (fully regenerated by Part 4)
```

### What to Keep (inputs & config)

| Item | Why keep it |
|---|---|
| `util/prompts/aut-config.md` | Single source of truth — drives all prompts |
| `util/prompts/e2e-qa-prompt-part*.md` | UI pipeline prompt files |
| `util/prompts/api-test-automation-prompt.md` | API prompt file |
| `util/prompts/bdd-test-automation-prompt.md` | BDD prompt file |
| `util/userstory/ecom-checkout.md` | Input to Part 1 — the user story |
| `package.json` | Dependency list — needed for `npm install` to work |
| `.env` | API keys for MCP server tools — never regenerated |
| `.playwright-mcp/` | MCP server config — never regenerated |
| `.github/` | CI/CD workflows — optional but not regenerated |

> `util/manual-tests/` (manual test cases, test plan) are intermediate artifacts. They are regenerated by Parts 1-3 but can be kept to skip those parts.

### Step-by-step Regeneration

The three pipelines are **independent** — run them in any order. Common orderings:

| Order | When to use |
|---|---|
| UI (Parts 1–5) → API → BDD | Default — BDD reuses the finished page objects |
| API → BDD → UI (Parts 1–5) | API-first projects; BDD creates minimal page object stubs that UI pipeline later overwrites |
| API only | API testing only, no UI or BDD needed |
| UI only | UI testing only, no API or BDD needed |
| BDD only | Smoke tests only; BDD prompt creates minimal page objects and API services itself |

> The only hard constraint is **within** the UI pipeline: Parts must run 1 → 2 → 3 → 4 → 5 in order.

```bash
# 1. Delete all generated code
rm -rf tests/ helpers/api/ test-data/ fixtures/ playwright.config.ts

# ── Option A: UI → API → BDD (default) ────────────────────────────────────────

# 2a. Run UI pipeline Parts 1–5 in order
#     Part 1 → Playwright MCP Server agent  (pre-flight + manual test cases)
#     Part 2 → Playwright Test Planner agent  (test plan with verified selectors)
#     Part 3 → Playwright MCP Server agent  (exploratory testing findings)
#     Part 4 → playwright-test-generator agent  (playwright.config.ts + all UI tests)
#     Part 5 → playwright-test-healer agent  (run → triage → fix → report)

# 2b. Run API prompt  (pre-flight + service layer + 37 tests + self-heal)
#     Open util/prompts/api-test-automation-prompt.md in the default agent

# 2c. Run BDD prompt  (pre-flight + fixtures + feature files + step defs + self-heal)
#     Open util/prompts/bdd-test-automation-prompt.md in the default agent
#     BDD reuses the page objects created by Part 4

# ── Option B: API → BDD → UI ──────────────────────────────────────────────────

# 2a. Run API prompt  (creates helpers/api/, test-data/, tests/api/, playwright.config.ts)
# 2b. Run BDD prompt  (Step 3b auto-creates minimal page object stubs if tests/ui/pages/ is missing)
# 2c. Run UI pipeline Parts 1–5  (overwrites the stubs with production-grade page objects)

# ── Option C: standalone pipelines ────────────────────────────────────────────

# API only:  run api-test-automation-prompt.md  →  37 tests
# UI only:   run Parts 1–5  →  17 tests
# BDD only:  run bdd-test-automation-prompt.md  →  3 tests (creates its own stubs)

# ── Verify everything ─────────────────────────────────────────────────────────
npm test           # UI + API (57 tests)
npm run test:bdd   # BDD smoke (3 tests)
```

### Switching to a Different Application Under Test

1. Edit **`util/prompts/aut-config.md`** — this is the only file you need to change:
   - **Section 0**: set `appSlug` (e.g. `my-new-app`) and `userStoryFile` (path to your user story)
   - **Section 1**: new UI app URL, credentials, selector strategy, known behaviours
   - **Section 2**: new API base URL, auth credentials, endpoints, known behaviours
   - **Section 3**: update BDD scope to match the new app's key flows
   - **Section 6**: optionally set `mode: demo` to generate a small representative suite first, then switch to `mode: full` for full coverage
2. Delete all generated code: `rm -rf tests/ helpers/api/ test-data/ fixtures/ playwright.config.ts`
3. Replace `util/userstory/ecom-checkout.md` with your new user story (use the path set in Section 0)
4. Re-run all 7 prompts in the order shown above — they will read `aut-config.md` and use your new app slug, URLs, and credentials everywhere.
5. No other file needs to change.

---

## Test Execution Summary

| Test Suite | Tests | Typical Duration | Purpose |
|------------|-------|------------------|----------|
| **BDD Smoke** | 3 | ~5s | Quick validation, demos, CI/CD smoke testing |
| **UI Tests** | 17 | ~40s | Comprehensive E-commerce checkout validation |
| **API Tests** | 37 | ~25s | Complete API endpoint coverage |
| **TOTAL** | **57** | **~70s** | Full regression suite |

**Recommendation**: Run BDD smoke tests on every commit, full suite nightly or on release branches.

