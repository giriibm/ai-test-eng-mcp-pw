# Manual Test Cases — SCRUM-101: E-commerce Checkout Process
Generated: 2026-05-15 | Source: userstory/ecom-checkout.md

---

## AC1 — Cart Review

TC-AC1-01
───────────────────────────────────────────────
Test Title       : View cart with multiple items and verify all item details
Test Objective   : Verify that the cart page displays all added items with name, description, price, and quantity, and shows options to continue shopping or proceed to checkout.
Testing Scope    : Login page, Inventory page, Cart page
Pre-conditions   : User is logged in as standard_user; at least two products have been added to cart
Test Steps       :
  1. Navigate to https://www.saucedemo.com  →  Expected: Login page visible
  2. Login with standard_user / secret_sauce  →  Expected: Inventory/products page visible
  3. Click "Add to cart" on "Sauce Labs Backpack"  →  Expected: Cart badge shows "1"
  4. Click "Add to cart" on "Sauce Labs Bike Light"  →  Expected: Cart badge shows "2"
  5. Click the cart icon  →  Expected: Cart page loads at /cart.html
  6. Verify item row for "Sauce Labs Backpack" shows name, description, price ($29.99), quantity (1)  →  Expected: All four data points visible
  7. Verify item row for "Sauce Labs Bike Light" shows name, description, price ($9.99), quantity (1)  →  Expected: All four data points visible
  8. Verify "Continue Shopping" button is visible  →  Expected: Button present and labelled correctly
  9. Verify "Checkout" button is visible  →  Expected: Button present and labelled correctly
Test Data        : username=standard_user, password=secret_sauce, items=[Sauce Labs Backpack ($29.99), Sauce Labs Bike Light ($9.99)]
Acceptance Criteria Met : AC1
Pass Criteria    : All item details visible; both action buttons present; cart badge matches item count
Fail Criteria    : Any item detail missing; button absent; badge count incorrect
───────────────────────────────────────────────

TC-AC1-02
───────────────────────────────────────────────
Test Title       : Verify cart badge count reflects exact number of items added
Test Objective   : Confirm the cart badge increments correctly as items are added, ensuring accurate item count feedback.
Testing Scope    : Inventory page, Cart badge, Cart page
Pre-conditions   : User is logged in; cart is empty
Test Steps       :
  1. Add 1 item to cart  →  Expected: Badge shows "1"
  2. Add a second item  →  Expected: Badge shows "2"
  3. Add a third item  →  Expected: Badge shows "3"
  4. Navigate to cart  →  Expected: Cart shows 3 line items
Test Data        : username=standard_user, password=secret_sauce
Acceptance Criteria Met : AC1
Pass Criteria    : Badge integer matches the count of items added at every increment
Fail Criteria    : Badge missing; badge count mismatches item count
───────────────────────────────────────────────

---

## AC2 — Checkout Information Entry

TC-AC2-01
───────────────────────────────────────────────
Test Title       : Complete checkout info form with valid data and proceed to overview
Test Objective   : Verify that entering valid First Name, Last Name, and Zip/Postal Code and clicking Continue navigates to the order overview page.
Testing Scope    : Cart page, Checkout Step One page
Pre-conditions   : User logged in; at least one item in cart; on cart page
Test Steps       :
  1. Click "Checkout" button on cart  →  Expected: Redirect to /checkout-step-one.html
  2. Verify First Name, Last Name, Zip/Postal Code fields and Continue / Cancel buttons are visible  →  Expected: All form elements present
  3. Fill First Name = "John"  →  Expected: Input accepted
  4. Fill Last Name = "Doe"  →  Expected: Input accepted
  5. Fill Zip/Postal Code = "90210"  →  Expected: Input accepted
  6. Click "Continue"  →  Expected: Redirect to /checkout-step-two.html (order overview)
Test Data        : firstName=John, lastName=Doe, zip=90210
Acceptance Criteria Met : AC2, AC3
Pass Criteria    : No error messages; user lands on overview page
Fail Criteria    : Error message shown with valid data; navigation does not proceed
───────────────────────────────────────────────

TC-AC2-02
───────────────────────────────────────────────
Test Title       : Checkout form validation — all fields empty
Test Objective   : Verify that submitting the checkout form with all fields empty displays an appropriate error message and prevents navigation.
Testing Scope    : Checkout Step One page
Pre-conditions   : User logged in; at least one item in cart; on checkout-step-one page
Test Steps       :
  1. Leave First Name, Last Name, Zip fields empty
  2. Click "Continue"  →  Expected: Error message appears (e.g., "Error: First Name is required")
  3. Verify the user remains on /checkout-step-one.html  →  Expected: URL unchanged
Test Data        : firstName=, lastName=, zip=
Acceptance Criteria Met : AC2, AC5
Pass Criteria    : Error message visible; URL stays at step one
Fail Criteria    : No error shown; user navigated forward with empty fields
───────────────────────────────────────────────

TC-AC2-03
───────────────────────────────────────────────
Test Title       : Checkout form validation — First Name empty only
Test Objective   : Verify that leaving only First Name empty while other fields are valid produces a specific error for First Name.
Testing Scope    : Checkout Step One page
Pre-conditions   : User logged in; at least one item in cart; on checkout-step-one page
Test Steps       :
  1. Leave First Name empty; fill Last Name = "Doe"; fill Zip = "90210"
  2. Click "Continue"  →  Expected: Error "Error: First Name is required" displayed
  3. Verify user stays on /checkout-step-one.html
Test Data        : firstName=, lastName=Doe, zip=90210
Acceptance Criteria Met : AC2, AC5
Pass Criteria    : First Name specific error shown; no forward navigation
Fail Criteria    : Generic or no error; navigation proceeds
───────────────────────────────────────────────

TC-AC2-04
───────────────────────────────────────────────
Test Title       : Checkout form validation — Last Name empty only
Test Objective   : Verify that leaving only Last Name empty while other fields are valid produces a specific error for Last Name.
Testing Scope    : Checkout Step One page
Pre-conditions   : User logged in; at least one item in cart; on checkout-step-one page
Test Steps       :
  1. Fill First Name = "John"; leave Last Name empty; fill Zip = "90210"
  2. Click "Continue"  →  Expected: Error "Error: Last Name is required" displayed
  3. Verify user stays on /checkout-step-one.html
Test Data        : firstName=John, lastName=, zip=90210
Acceptance Criteria Met : AC2, AC5
Pass Criteria    : Last Name specific error shown; no forward navigation
Fail Criteria    : Wrong or no error; navigation proceeds
───────────────────────────────────────────────

TC-AC2-05
───────────────────────────────────────────────
Test Title       : Checkout form validation — Zip/Postal Code empty only
Test Objective   : Verify that leaving only Zip/Postal Code empty while other fields are valid produces a specific error for Zip.
Testing Scope    : Checkout Step One page
Pre-conditions   : User logged in; at least one item in cart; on checkout-step-one page
Test Steps       :
  1. Fill First Name = "John"; fill Last Name = "Doe"; leave Zip empty
  2. Click "Continue"  →  Expected: Error "Error: Postal Code is required" displayed
  3. Verify user stays on /checkout-step-one.html
Test Data        : firstName=John, lastName=Doe, zip=
Acceptance Criteria Met : AC2, AC5
Pass Criteria    : Zip-specific error shown; no forward navigation
Fail Criteria    : Wrong or no error; navigation proceeds
───────────────────────────────────────────────

TC-AC2-06
───────────────────────────────────────────────
Test Title       : Checkout form — special characters in all fields
Test Objective   : Verify behaviour when special characters are entered in all checkout fields; the app should either reject them with an error or accept and proceed (documenting actual behaviour).
Testing Scope    : Checkout Step One page
Pre-conditions   : User logged in; at least one item in cart; on checkout-step-one page
Test Steps       :
  1. Fill First Name = "!@#$%"; Last Name = "^&*()"; Zip = "<>?/{}"
  2. Click "Continue"  →  Expected: Either error message shown, or navigation proceeds without crash
  3. If navigation proceeds, verify overview page renders correctly without script injection
Test Data        : firstName=!@#$%, lastName=^&*(), zip=<>?/{}
Acceptance Criteria Met : AC2, AC5
Pass Criteria    : No JavaScript execution from input; app handles input gracefully (error or safe display)
Fail Criteria    : JavaScript executes; application crashes or throws unhandled exception
───────────────────────────────────────────────

TC-AC2-07
───────────────────────────────────────────────
Test Title       : Checkout form — excessively long strings (> 100 chars) in all fields
Test Objective   : Verify that entering strings longer than 100 characters does not crash the app or cause layout issues.
Testing Scope    : Checkout Step One page
Pre-conditions   : User logged in; at least one item in cart; on checkout-step-one page
Test Steps       :
  1. Fill First Name, Last Name, Zip each with a 150-character string
  2. Click "Continue"  →  Expected: App handles gracefully — either trims, errors, or proceeds
  3. Verify no layout overflow or JS error
Test Data        : firstName=Aaaa…(150 chars), lastName=Bbbb…(150 chars), zip=12345…(150 chars)
Acceptance Criteria Met : AC2, AC5
Pass Criteria    : No crash; no horizontal overflow; UI remains usable
Fail Criteria    : Page crash; JavaScript error thrown; layout broken
───────────────────────────────────────────────

TC-AC2-08
───────────────────────────────────────────────
Test Title       : Checkout form edge case — single-character values in all fields
Test Objective   : Verify that the minimum accepted input (1 character per field) is processed correctly.
Testing Scope    : Checkout Step One page
Pre-conditions   : User logged in; at least one item in cart; on checkout-step-one page
Test Steps       :
  1. Fill First Name = "A"; Last Name = "B"; Zip = "1"
  2. Click "Continue"  →  Expected: Redirect to /checkout-step-two.html
  3. Verify overview renders with the single-char values displayed
Test Data        : firstName=A, lastName=B, zip=1
Acceptance Criteria Met : AC2, AC3
Pass Criteria    : Navigation to step two succeeds; values displayed on overview
Fail Criteria    : Error on single-char inputs; navigation blocked
───────────────────────────────────────────────

TC-AC2-09
───────────────────────────────────────────────
Test Title       : Checkout form edge case — numeric-only First and Last Name
Test Objective   : Verify that numeric strings in name fields are accepted and processed without error.
Testing Scope    : Checkout Step One page
Pre-conditions   : User logged in; at least one item in cart; on checkout-step-one page
Test Steps       :
  1. Fill First Name = "12345"; Last Name = "67890"; Zip = "99999"
  2. Click "Continue"  →  Expected: Redirect to /checkout-step-two.html
  3. Verify values appear on overview page
Test Data        : firstName=12345, lastName=67890, zip=99999
Acceptance Criteria Met : AC2
Pass Criteria    : Navigation succeeds; numeric values displayed
Fail Criteria    : Validation rejects numeric names
───────────────────────────────────────────────

---

## AC3 — Order Overview

TC-AC3-01
───────────────────────────────────────────────
Test Title       : Order overview displays all items, payment info, shipping info, and totals
Test Objective   : Verify the checkout overview page shows all purchased items, payment/shipping details, subtotal, tax, and total, and provides Cancel and Finish buttons.
Testing Scope    : Checkout Step Two page
Pre-conditions   : User logged in; two items in cart (Backpack $29.99, Bike Light $9.99); valid checkout info entered; on /checkout-step-two.html
Test Steps       :
  1. Verify all ordered items are listed with name and price  →  Expected: Both items visible
  2. Verify payment information section is visible  →  Expected: Payment info block present
  3. Verify shipping information section is visible  →  Expected: Shipping info block present
  4. Verify "Item total" shows sum of item prices  →  Expected: $39.98
  5. Verify "Tax" line is visible  →  Expected: Tax amount shown
  6. Verify "Total" line is visible and equals Item total + Tax  →  Expected: Arithmetically correct
  7. Verify "Cancel" and "Finish" buttons are visible  →  Expected: Both buttons present
Test Data        : items=[Sauce Labs Backpack $29.99, Sauce Labs Bike Light $9.99], expectedItemTotal=$39.98
Acceptance Criteria Met : AC3
Pass Criteria    : All items, info sections, and price lines visible; Cancel and Finish buttons present; total = subtotal + tax
Fail Criteria    : Item missing; price missing; total calculation incorrect; buttons missing
───────────────────────────────────────────────

---

## AC4 — Order Completion

TC-AC4-01
───────────────────────────────────────────────
Test Title       : Complete order end-to-end and verify confirmation page
Test Objective   : Verify that clicking Finish on the overview page redirects to the confirmation page with a success message and Back Home button.
Testing Scope    : Checkout Step Two page, Checkout Complete page
Pre-conditions   : User on /checkout-step-two.html with valid order
Test Steps       :
  1. Click "Finish" button  →  Expected: Redirect to /checkout-complete.html
  2. Verify success heading is visible (e.g., "Thank you for your order!")  →  Expected: Heading text present
  3. Verify success body text is visible  →  Expected: Order dispatched message visible
  4. Verify pony express image is visible  →  Expected: Image rendered without broken icon
  5. Verify "Back Home" button is visible  →  Expected: Button labelled "Back Home"
Test Data        : (no additional input — uses state from prior steps)
Acceptance Criteria Met : AC4
Pass Criteria    : Confirmation page loads; success heading, body text, image, and Back Home button all visible
Fail Criteria    : Not redirected to complete page; success message missing; button absent
───────────────────────────────────────────────

TC-AC4-02
───────────────────────────────────────────────
Test Title       : Back Home after order confirmation returns to products with empty cart
Test Objective   : Verify that clicking Back Home from the confirmation page navigates to the products page and the cart badge is cleared.
Testing Scope    : Checkout Complete page, Inventory page
Pre-conditions   : User on /checkout-complete.html after a completed order
Test Steps       :
  1. Click "Back Home"  →  Expected: Redirect to /inventory.html
  2. Verify cart badge is not displayed (or shows 0)  →  Expected: Cart reset after order
  3. Verify inventory page content is visible  →  Expected: Product list rendered
Test Data        : (state carried from completed order)
Acceptance Criteria Met : AC4
Pass Criteria    : Products page shown; cart is empty
Fail Criteria    : Redirect fails; cart badge still shows previous count
───────────────────────────────────────────────

---

## AC5 — Error Handling

TC-AC5-01
───────────────────────────────────────────────
Test Title       : Verify error banner appears and is dismissible on checkout form validation failures
Test Objective   : Confirm that validation errors are shown as a visible banner/message and that the error can be dismissed so the user can correct input.
Testing Scope    : Checkout Step One page — error message component
Pre-conditions   : User logged in; at least one item in cart; on /checkout-step-one.html
Test Steps       :
  1. Leave all fields empty and click Continue  →  Expected: Red error banner appears
  2. Verify error message text is descriptive (not a generic code)  →  Expected: Human-readable message
  3. Click the error close/dismiss button (X icon)  →  Expected: Error banner disappears
  4. Verify form fields are still visible and editable  →  Expected: User can correct input
Test Data        : firstName=, lastName=, zip=
Acceptance Criteria Met : AC5
Pass Criteria    : Error shown; error is dismissible; form remains usable
Fail Criteria    : No error shown; error cannot be dismissed; page becomes unusable
───────────────────────────────────────────────

---

## Navigation Flow

TC-NAV-01
───────────────────────────────────────────────
Test Title       : Cancel on checkout-step-one returns to cart with items intact
Test Objective   : Verify that clicking Cancel on the checkout info page returns the user to the cart page and all previously added items are still in the cart.
Testing Scope    : Checkout Step One page, Cart page
Pre-conditions   : User logged in; two items in cart; on /checkout-step-one.html
Test Steps       :
  1. Click "Cancel" button  →  Expected: Redirect to /cart.html
  2. Verify both items are still listed in the cart  →  Expected: Item count unchanged
  3. Verify cart badge still shows correct count  →  Expected: Badge count preserved
Test Data        : (state from previous cart additions)
Acceptance Criteria Met : AC2 (cancel flow per Business Rule 5)
Pass Criteria    : Cart page shown; items intact; badge count correct
Fail Criteria    : Items lost; wrong page shown
───────────────────────────────────────────────

TC-NAV-02
───────────────────────────────────────────────
Test Title       : Cancel on checkout-step-two returns to products page
Test Objective   : Verify that clicking Cancel on the order overview page navigates the user back to the products/inventory page.
Testing Scope    : Checkout Step Two page, Inventory page
Pre-conditions   : User on /checkout-step-two.html
Test Steps       :
  1. Click "Cancel" button  →  Expected: Redirect to /inventory.html
  2. Verify products page content is visible  →  Expected: Product list shown
Test Data        : (state from prior steps)
Acceptance Criteria Met : AC3
Pass Criteria    : Inventory page shown after Cancel
Fail Criteria    : Wrong page shown; error occurs
───────────────────────────────────────────────

TC-NAV-03
───────────────────────────────────────────────
Test Title       : Continue Shopping on cart page returns to products page
Test Objective   : Verify the Continue Shopping button on the cart page navigates back to the inventory/products page without clearing the cart.
Testing Scope    : Cart page, Inventory page
Pre-conditions   : User logged in; one or more items in cart; on /cart.html
Test Steps       :
  1. Click "Continue Shopping"  →  Expected: Redirect to /inventory.html
  2. Verify products list is visible  →  Expected: Inventory page rendered
  3. Navigate back to cart  →  Expected: Items still in cart
Test Data        : (state from prior cart additions)
Acceptance Criteria Met : AC1
Pass Criteria    : Inventory page shown; items still in cart upon return
Fail Criteria    : Cart cleared; wrong page shown
───────────────────────────────────────────────

TC-NAV-04
───────────────────────────────────────────────
Test Title       : Back Home after order confirmation — products page, cart cleared
Test Objective   : Validate that navigating home after order completion resets cart state per Business Rule 4.
Testing Scope    : Checkout Complete page, Inventory page
Pre-conditions   : User on /checkout-complete.html; order placed
Test Steps       :
  1. Click "Back Home"  →  Expected: /inventory.html
  2. Verify cart badge is absent or shows 0  →  Expected: Cart cleared
Test Data        : (state from completed order)
Acceptance Criteria Met : AC4
Pass Criteria    : Inventory page; empty cart
Fail Criteria    : Cart not cleared; wrong page
───────────────────────────────────────────────

---

## UI Element Validation

TC-UI-01
───────────────────────────────────────────────
Test Title       : Cart page — verify item name, description, price, quantity labels are visible
Test Objective   : Validate that all expected UI labels and data fields render correctly on the cart page.
Testing Scope    : Cart page UI
Pre-conditions   : User logged in; Sauce Labs Backpack in cart; on /cart.html
Test Steps       :
  1. Verify "Your Cart" heading is visible  →  Expected: Heading present
  2. Verify "QTY" and "DESCRIPTION" column labels are visible  →  Expected: Both column headers present
  3. Verify item row shows: item name, item description text, unit price, quantity  →  Expected: All four visible
  4. Verify "Continue Shopping" and "Checkout" button labels are correct  →  Expected: Exact text matches
Test Data        : item=Sauce Labs Backpack
Acceptance Criteria Met : AC1
Pass Criteria    : All labels, headings, and data fields visible with correct text
Fail Criteria    : Any label missing or displaying wrong text
───────────────────────────────────────────────

TC-UI-02
───────────────────────────────────────────────
Test Title       : Checkout step one — verify field labels, placeholders, and button labels
Test Objective   : Confirm that the checkout info form has correctly labelled inputs with expected placeholders and that both action buttons have correct labels.
Testing Scope    : Checkout Step One page UI
Pre-conditions   : User logged in; at least one item in cart; on /checkout-step-one.html
Test Steps       :
  1. Verify First Name field has placeholder "First Name"  →  Expected: Placeholder text visible
  2. Verify Last Name field has placeholder "Last Name"  →  Expected: Placeholder text visible
  3. Verify Zip/Postal Code field has placeholder "Zip/Postal Code"  →  Expected: Placeholder text visible
  4. Verify "Cancel" button text  →  Expected: Label "Cancel"
  5. Verify "Continue" button text  →  Expected: Label "Continue"
Test Data        : (no input — UI inspection only)
Acceptance Criteria Met : AC2
Pass Criteria    : All placeholders and button labels match expected text
Fail Criteria    : Any label wrong or missing
───────────────────────────────────────────────

TC-UI-03
───────────────────────────────────────────────
Test Title       : Checkout step two — verify payment info, shipping info, subtotal, tax, total sections
Test Objective   : Validate that the order overview page renders all expected information sections with their labels.
Testing Scope    : Checkout Step Two page UI
Pre-conditions   : User logged in; one item in cart; valid info entered; on /checkout-step-two.html
Test Steps       :
  1. Verify "Payment Information" section heading/label is visible  →  Expected: Label present
  2. Verify "Shipping Information" section heading/label is visible  →  Expected: Label present
  3. Verify "Price Total" / "Item total" line is visible  →  Expected: Subtotal line shown
  4. Verify "Tax" line is visible  →  Expected: Tax line shown
  5. Verify "Total" line is visible  →  Expected: Grand total shown
  6. Verify "Cancel" and "Finish" button labels  →  Expected: Exact text matches
Test Data        : (any valid order reaching step two)
Acceptance Criteria Met : AC3
Pass Criteria    : All section labels and price lines visible; buttons correctly labelled
Fail Criteria    : Any label or price section missing
───────────────────────────────────────────────

TC-UI-04
───────────────────────────────────────────────
Test Title       : Order confirmation — verify success heading, body text, and Back Home button
Test Objective   : Confirm the confirmation page renders the expected success heading, descriptive body text, and the Back Home button.
Testing Scope    : Checkout Complete page UI
Pre-conditions   : User on /checkout-complete.html after completed order
Test Steps       :
  1. Verify "Thank you for your order!" heading (or equivalent) is visible  →  Expected: Success heading present
  2. Verify body text (dispatch/courier message) is visible  →  Expected: Descriptive text shown
  3. Verify pony express image is visible and not broken  →  Expected: Image loaded
  4. Verify "Back Home" button is visible with correct label  →  Expected: Button labelled "Back Home"
Test Data        : (state from completed order)
Acceptance Criteria Met : AC4
Pass Criteria    : Heading, body text, image, and button all present and correct
Fail Criteria    : Any element missing or showing wrong text
───────────────────────────────────────────────
