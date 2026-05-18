# E2E QA Prompt — Part 3 of 5: Exploratory Testing

**Part** : 3 of 5 | **Agent** : Playwright MCP Server | **Step covered** : Step 3

---

## Pipeline Overview

| Part | File | Agent | Steps | Focus |
|---|---|---|---|---|
| Part 1 | `e2e-qa-prompt-part1.md` | Playwright MCP Server | Step 1 | Derive manual test cases from user story |
| Part 2 | `e2e-qa-prompt-part2.md` | Playwright Test Planner | Step 2 | Build structured E2E test plan |
| **Part 3 — this file** | `e2e-qa-prompt-part3.md` | Playwright MCP Server | Step 3 | Exploratory testing + bug reports |
| Part 4 | `e2e-qa-prompt-part4.md` | playwright-test-generator | Steps 4–5 | Test data JSON + POM automation scripts |
| Part 5 | `e2e-qa-prompt-part5.md` | playwright-test-healer | Steps 6–7 | Test healing + final test report |

**Execute parts strictly in order. Do not begin a part until all outputs of the previous part exist on disk.**

---

## Inputs Required

| File | Source |
|---|---|
| `specs/manual-test-cases.md` | Output of Part 1 |
| `specs/ecom-checkout-test-plan.md` | Output of Part 2 — use as a reference map for coverage |

## Outputs Produced by This Part

| File | Content |
|---|---|
| `specs/exploratory-testing-findings.md` | Exploratory testing summary + all bug reports |
| `reports/screenshots/EX-*.png` | All screenshots taken during exploration |

---

## How to Use This Part

1. Confirm `specs/ecom-checkout-test-plan.md` exists on disk (output of Part 2).
2. Paste this file into the **Playwright MCP Server** agent chat.
3. The agent navigates the live application freely, beyond the scripted paths, and documents every observation.
4. All findings and screenshots are saved as described in Section 3.8.
5. Verify both output files exist before proceeding to Part 4.

---

## STEP 3 — Perform Exploratory Testing

### 3.1 Purpose

Exploratory testing uncovers defects, usability issues, and unexpected behaviours that scripted test cases miss. In this step the **Playwright MCP Server** agent navigates the live application freely, documents every observation, and records findings as structured bug reports.

### 3.2 Pre-conditions

1. The application at `https://www.saucedemo.com` is reachable.
2. Credentials available: username `standard_user` / password `secret_sauce`.
3. Parts 1 and 2 are complete — use `specs/manual-test-cases.md` and `specs/ecom-checkout-test-plan.md` as a reference map, but intentionally go **beyond** the scripted paths.

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
11. Append all bug reports to the file `specs/exploratory-testing-findings.md`.

**Phase E — Summarise**
12. After all charters are complete, write an **Exploratory Testing Summary** at the top of `specs/exploratory-testing-findings.md` containing:
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
| `specs/exploratory-testing-findings.md` | Summary + all bug reports in template format |
| `reports/screenshots/EX-*.png` | All screenshots taken during exploration |

---

## Before Proceeding to Part 4

Confirm every item below before opening `e2e-qa-prompt-part4.md`.

- [ ] `specs/exploratory-testing-findings.md` exists on disk
- [ ] The file begins with the Exploratory Testing Summary (charters executed, time, bug counts by severity)
- [ ] All 8 charters (EX-01 through EX-08) have been executed and documented
- [ ] Every confirmed bug has a full `BUG-*` entry using the template in Section 3.5
- [ ] All screenshots are saved under `reports/screenshots/` with `EX-*` naming
- [ ] The summary includes recommended regression test additions

**Do not open Part 4 until all items above are checked.**
