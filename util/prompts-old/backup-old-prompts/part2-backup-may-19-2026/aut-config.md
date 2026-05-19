# Application Under Test Configuration

> **This is the single source of truth for all prompt files.**
> To test a different application, update only this file.
> All 7 prompt files (e2e-qa-prompt-part1 through part5, api-test-automation-prompt, bdd-test-automation-prompt) read this file first and use these values for every URL, credential, file path, and scope decision.

---

## 0. Project Metadata

> **Change these two fields when switching to a new application.** All output file names and paths are derived from `appSlug`.

| Field | Current value | Purpose |
|---|---|---|
| `appSlug` | `ecom-checkout` | Prefix for all generated file names — e.g. `ecom-checkout-test-plan.md` |
| `userStoryFile` | `util/userstory/ecom-checkout.md` | Input file read by Part 1 to derive manual test cases |

**Derived file paths** (update when `appSlug` changes):

| File | Path |
|---|---|
| User story | `util/userstory/<appSlug>.md` |
| Manual test cases | `util/manual-tests/manual-test-cases.md` |
| Test plan | `util/manual-tests/<appSlug>-test-plan.md` |
| Exploratory findings | `util/manual-tests/exploratory-testing-findings.md` |
| BDD smoke test cases | `util/manual-tests/bdd-smoke-test-cases.md` |

---

## 1. UI Application

| Field | Value |
|---|---|
| Application name | SauceDemo E-commerce |
| Base URL | `https://www.saucedemo.com` |
| Env var | `process.env.UI_BASE_URL` |
| Login username | `standard_user` |
| Login password | `secret_sauce` |
| Env vars for creds | `process.env.UI_USERNAME` / `process.env.UI_PASSWORD` |
| Technology | React SPA |
| Auth mechanism | Form login (username + password on `/`) |

### UI Feature Scope
The test suite covers the **checkout flow**:

1. Login page (`/`)
2. Products / Inventory page (`/inventory.html`)
3. Cart page (`/cart.html`)
4. Checkout step one — shipping info (`/checkout-step-one.html`)
5. Checkout step two — order review (`/checkout-step-two.html`)
6. Order confirmation (`/checkout-complete.html`)

### UI Selector Strategy
- Prefer `[data-test="..."]` attributes — SauceDemo provides them on all interactive elements
- For product-specific add-to-cart buttons: `[data-test="add-to-cart-<kebab-product-name>"]`
- For error messages: `[data-test="error"]`
- Never select by visible text alone for interactive elements

### Known UI Behaviours (from exploratory testing)
- The app accepts special characters and long strings in checkout fields — it does NOT show a validation error and instead advances to step two
- The app accepts numeric-only names in checkout fields
- Cart count badge disappears (element removed from DOM) when cart is empty — do not call `.textContent()` on it without checking `isVisible()` first
- After completing an order the cart is cleared automatically

---

## 2. API Application

| Field | Value |
|---|---|
| Application name | Restful-Booker |
| Base URL | `https://restful-booker.herokuapp.com` |
| Env var | `process.env.API_BASE_URL` |
| API documentation | `https://restful-booker.herokuapp.com/apidoc/index.html` |
| Auth username | `admin` |
| Auth password | `password123` |
| Env vars for creds | `process.env.API_USERNAME` / `process.env.API_PASSWORD` |
| Auth mechanism | Token-based (POST `/auth` → `{ token }`) + Basic Auth |
| API type | REST, JSON responses |

### API Endpoints Summary

| Method | Path | Auth required | Description |
|---|---|---|---|
| POST | `/auth` | No | Generate token |
| GET | `/booking` | No | List all booking IDs |
| GET | `/booking/:id` | No | Get booking detail |
| POST | `/booking` | No | Create booking |
| PUT | `/booking/:id` | Yes | Full update |
| PATCH | `/booking/:id` | Yes | Partial update |
| DELETE | `/booking/:id` | Yes | Delete booking (returns 201) |
| GET | `/ping` | No | Health check (returns 201) |

### Known API Behaviours
- `DELETE` returns **201** (not 204) on success
- API does not validate date ordering — checkout-before-checkin is accepted
- API accepts incomplete payloads (missing required fields) with status 200 in most cases
- Auth token is returned as `{ "token": "..." }` — if auth fails the field is absent (not null)
- All booking dates must be **future dates** — use `generateFutureDates()` helper, never hardcode

---

## 3. BDD Smoke Tests

The BDD layer reuses both the UI and API applications above. It covers one smoke scenario for each:

| Scenario | Application | Coverage |
|---|---|---|
| Complete checkout end-to-end | UI (SauceDemo) | Login → add product → cart → checkout form → review → confirm |
| Complete booking lifecycle | API (Restful-Booker) | Create → Read → Update (dates) → Delete → Verify 404 |

### BDD Technical Stack
- Framework: `playwright-bdd` v8
- Feature files: `tests/bdd/features/`
- Step definitions: `tests/bdd/steps/`
- Custom fixtures: `fixtures/bdd-fixtures.ts` (must exist before generating steps)
- Generated test files: `.features-gen/` (auto-generated, do not edit)

---

## 4. How to Adapt This Config for a Different Application

To point the entire test suite at a new application:

1. Update **Section 1** with the new UI app URL, credentials, selector strategy, and known behaviours
2. Update **Section 2** with the new API base URL, endpoints, auth mechanism, and known behaviours
3. Update **Section 3** BDD scenario descriptions to match the new app's key flows
4. Update `fixtures/bdd-fixtures.ts` — change the `testData` fixture values for `baseUrl` and `credentials`
5. Re-run the 5-part UI pipeline and the API/BDD prompts — the agents will use this file as their source of truth

**Do not change any other prompt file when switching applications.**

---

## 5. Environment Variables Reference

All generated code must read these environment variables with the defaults shown:

```typescript
// UI
const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const UI_USERNAME = process.env.UI_USERNAME ?? 'standard_user';
const UI_PASSWORD = process.env.UI_PASSWORD ?? 'secret_sauce';

// API
const API_BASE_URL = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';
const API_USERNAME = process.env.API_USERNAME ?? 'admin';
const API_PASSWORD = process.env.API_PASSWORD ?? 'password123';
```

These defaults allow the suite to run locally without any `.env` file.
In CI, set the env vars to override the defaults.
