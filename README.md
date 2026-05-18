# AI QA Agent — Playwright E2E Test Suite

An AI-driven QA automation pipeline that reads a user story, generates manual test cases, builds a structured test plan, runs exploratory testing, produces a Page Object Model (POM) Playwright test suite, and self-heals any failing tests — end to end, without manual intervention.

---

## How It Works

The pipeline is split into five sequential parts, each driven by a dedicated AI agent:

| Part | Prompt File | Agent | Output |
|------|-------------|-------|--------|
| 1 | `e2e-qa-prompt-part1.md` | Playwright MCP Server | Manual test cases derived from the user story |
| 2 | `e2e-qa-prompt-part2.md` | Playwright Test Planner | Structured E2E test plan with selectors verified against the live app |
| 3 | `e2e-qa-prompt-part3.md` | Playwright MCP Server | Exploratory testing findings and bug reports |
| 4 | `e2e-qa-prompt-part4.md` | playwright-test-generator | Test data JSON + POM automation scripts |
| 5 | `e2e-qa-prompt-part5.md` | playwright-test-healer | Healed test suite + final test report |

> Execute parts strictly in order. Do not begin a part until all outputs of the previous part exist on disk.

---

## Pipeline Steps

### Step 1 — Manual Test Cases
The agent reads `util/userstory/ecom-checkout.md`, extracts every Acceptance Criterion, business rule, and technical note, and produces structured `TC-*` test case blocks grouped by AC into `util/manual-tests/manual-test-cases.md`.

### Step 2 — E2E Test Plan
The Playwright Test Planner navigates the live application, visually inspects each page, and builds a complete test plan in `util/manual-tests/ecom-checkout-test-plan.md` with accurate selectors and expected outcomes.

### Step 3 — Exploratory Testing
The agent exercises the application beyond the scripted paths, logs unexpected behaviours, and saves findings to `util/manual-tests/exploratory-testing-findings.md`.

### Step 4 — Automated Test Generation
The playwright-test-generator agent creates:
- `tests/data/checkout-test-data.json` — all test data in one place
- `tests/pages/*.ts` — Page Object Model classes for every page
- `tests/helpers/TestDataHelper.ts` — helper utilities
- `tests/checkout/*.spec.ts` — one spec file per test scenario

### Step 5 — Test Healing & Final Report
The playwright-test-healer agent:
1. Runs the full suite and captures the initial results
2. Triages every failure (selector drift, timing, data mismatch)
3. Applies targeted fixes to specs and page objects
4. Re-runs the suite to confirm all tests pass
5. Writes the final report to `reports/runs/<timestamp>/test-report-<YYYY-MM-DD>.md`

---

## Project Structure

```
.
├── util/
│   ├── userstory/
│   │   └── ecom-checkout.md               # Source user story (SCRUM-101)
│   ├── prompts/
│   │   ├── e2e-qa-prompt-part1.md         # Prompt: manual test cases
│   │   ├── e2e-qa-prompt-part2.md         # Prompt: test plan
│   │   ├── e2e-qa-prompt-part3.md         # Prompt: exploratory testing
│   │   ├── e2e-qa-prompt-part4.md         # Prompt: test generation
│   │   └── e2e-qa-prompt-part5.md         # Prompt: healing + report
│   └── manual-tests/
│       ├── manual-test-cases.md           # Generated TC-* test cases
│       ├── ecom-checkout-test-plan.md     # Structured E2E test plan
│       └── exploratory-testing-findings.md
├── tests/
│   ├── data/
│   │   └── checkout-test-data.json        # Centralised test data
│   ├── helpers/
│   │   └── TestDataHelper.ts
│   ├── pages/                             # Page Object Models
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutStepOnePage.ts
│   │   ├── CheckoutStepTwoPage.ts
│   │   └── CheckoutCompletePage.ts
│   └── checkout/                          # Spec files (17 scenarios)
│       ├── happy-path-complete-checkout.spec.ts
│       ├── negative-*.spec.ts             # Validation error scenarios
│       ├── edge-*.spec.ts                 # Edge case scenarios
│       ├── nav-*.spec.ts                  # Navigation flow scenarios
│       └── ui-*.spec.ts                   # UI visibility scenarios
├── reports/
│   ├── screenshots/                       # Manual evidence PNGs
│   └── runs/
│       └── <YYYY-MM-DD_HH-MM-SS>/        # One folder created per run
│           ├── artifacts/                 # Per-test videos, traces, screenshots
│           ├── html-report/              # Playwright HTML report (open with show-report)
│           └── test-results.json         # JSON summary (committed to git)
├── .github/
│   ├── agents/                            # AI agent definitions
│   │   ├── playwright-test-generator.agent.md
│   │   ├── playwright-test-healer.agent.md
│   │   └── playwright-test-planner.agent.md
│   └── workflows/
│       └── playwright.yml                 # CI pipeline
└── playwright.config.ts
```

---

## Application Under Test

**URL**: https://www.saucedemo.com  
**Feature**: E-commerce checkout flow (cart → shipping info → order review → confirmation)  
**Credentials**: `standard_user` / `secret_sauce`

---

## Test Coverage

| Category | Spec Files |
|----------|-----------|
| Happy Path | Complete checkout end-to-end |
| Negative | All fields empty, first/last name empty, zip empty, special characters, long strings |
| Edge Cases | Single product, cart badge count, single-char fields, numeric-only names |
| Navigation | Back to home, cancel step one, cancel step two, continue shopping |
| UI | Cart page elements, checkout step one elements |

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

```bash
# Run all tests (Chromium only — fast)
npx playwright test --project=chromium

# Run all tests across all browsers
npx playwright test

# Run a specific spec
npx playwright test tests/checkout/happy-path-complete-checkout.spec.ts

# Open interactive UI mode
npx playwright test --ui

# View the HTML report for the latest run
npx playwright show-report reports/runs/$(ls reports/runs | sort | tail -1)/html-report
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

Screenshots, videos, and traces are captured for every test. Firefox and WebKit are available but commented out in `playwright.config.ts` for speed — uncomment to enable cross-browser runs.

Environment variables (e.g. API keys for MCP tools) are stored in `.env`, which is excluded from version control via `.gitignore`.

