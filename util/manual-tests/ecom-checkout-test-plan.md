# E-commerce Checkout Test Plan — SCRUM-101

## Application Overview

SauceDemo e-commerce checkout application at https://www.saucedemo.com. Users log in with standard_user / secret_sauce, add products to cart, then complete a 3-page checkout: (1) checkout-step-one (info form: firstName, lastName, postalCode), (2) checkout-step-two (order overview with payment SauceCard #31337 and shipping Free Pony Express Delivery), (3) checkout-complete (Thank you for your order!). Selectors confirmed via live inspection: [data-test="username"], [data-test="password"], [data-test="login-button"], [data-test="add-to-cart-sauce-labs-backpack"], [data-test="add-to-cart-sauce-labs-bike-light"], [data-test="checkout"], [data-test="firstName"], [data-test="lastName"], [data-test="postalCode"], [data-test="continue"], [data-test="finish"], [data-test="back-to-products"], [data-test="cart-badge"], [data-test="error"]. Error message on empty form: 'Error: First Name is required' shown as h3 heading with a dismiss X button.

## Test Scenarios

### 1. Happy Path

**Seed:** `tests/seed.spec.ts`

#### 1.1. HP-01 Complete checkout end-to-end happy path

**File:** `tests/checkout/happy-path-complete-checkout.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com
    - expect: Login page is visible with username and password fields and Login button
  2. Fill [data-test="username"] with 'standard_user' and [data-test="password"] with 'secret_sauce', then click [data-test="login-button"]
    - expect: URL is https://www.saucedemo.com/inventory.html
    - expect: Products page heading 'Products' is visible
  3. Click [data-test="add-to-cart-sauce-labs-backpack"]
    - expect: Cart badge shows '1'
  4. Click [data-test="add-to-cart-sauce-labs-bike-light"]
    - expect: Cart badge shows '2'
  5. Click the cart icon to navigate to cart page
    - expect: URL is https://www.saucedemo.com/cart.html
    - expect: 'Your Cart' heading visible
    - expect: Sauce Labs Backpack item visible with price $29.99
    - expect: Sauce Labs Bike Light item visible with price $9.99
  6. Click [data-test="checkout"]
    - expect: URL is https://www.saucedemo.com/checkout-step-one.html
    - expect: 'Checkout: Your Information' heading visible
    - expect: First Name, Last Name, Zip/Postal Code fields visible
  7. Fill [data-test="firstName"] with 'John', [data-test="lastName"] with 'Doe', [data-test="postalCode"] with '90210'
    - expect: All three fields contain the entered values
  8. Click [data-test="continue"]
    - expect: URL is https://www.saucedemo.com/checkout-step-two.html
    - expect: 'Checkout: Overview' heading visible
    - expect: Both items listed
    - expect: Payment Information: SauceCard #31337 visible
    - expect: Shipping Information: Free Pony Express Delivery! visible
    - expect: Item total: $39.98 visible
    - expect: Tax: $3.20 visible
    - expect: Total: $43.18 visible
  9. Click [data-test="finish"]
    - expect: URL is https://www.saucedemo.com/checkout-complete.html
    - expect: Heading 'Thank you for your order!' visible
    - expect: Body text 'Your order has been dispatched...' visible
    - expect: Pony Express image visible
    - expect: Back Home button visible
  10. Click the Back Home button
    - expect: URL is https://www.saucedemo.com/inventory.html
    - expect: Cart badge is not visible (cart cleared)

### 2. Negative — Validation Errors

**Seed:** `tests/seed.spec.ts`

#### 2.1. NE-01 Checkout info submitted with all fields empty

**File:** `tests/checkout/negative-all-fields-empty.spec.ts`

**Steps:**
  1. Login, add one item to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout: Your Information page is visible
  2. Leave First Name, Last Name, and Zip/Postal Code all empty, then click [data-test="continue"]
    - expect: Error message 'Error: First Name is required' is displayed as an h3 heading
    - expect: URL remains https://www.saucedemo.com/checkout-step-one.html
    - expect: User does not advance to step two

#### 2.2. NE-02 Checkout info submitted with First Name empty only

**File:** `tests/checkout/negative-first-name-empty.spec.ts`

**Steps:**
  1. Login, add one item to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout: Your Information page is visible
  2. Leave First Name empty; fill Last Name with 'Doe'; fill Zip/Postal Code with '90210'; click [data-test="continue"]
    - expect: Error message 'Error: First Name is required' is displayed
    - expect: URL remains at /checkout-step-one.html

#### 2.3. NE-03 Checkout info submitted with Last Name empty only

**File:** `tests/checkout/negative-last-name-empty.spec.ts`

**Steps:**
  1. Login, add one item to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout: Your Information page is visible
  2. Fill First Name with 'John'; leave Last Name empty; fill Zip/Postal Code with '90210'; click [data-test="continue"]
    - expect: Error message 'Error: Last Name is required' is displayed
    - expect: URL remains at /checkout-step-one.html

#### 2.4. NE-04 Checkout info submitted with Zip/Postal Code empty only

**File:** `tests/checkout/negative-zip-empty.spec.ts`

**Steps:**
  1. Login, add one item to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout: Your Information page is visible
  2. Fill First Name with 'John'; fill Last Name with 'Doe'; leave Zip/Postal Code empty; click [data-test="continue"]
    - expect: Error message 'Error: Postal Code is required' is displayed
    - expect: URL remains at /checkout-step-one.html

#### 2.5. NE-05 Checkout info submitted with special characters in all fields

**File:** `tests/checkout/negative-special-chars.spec.ts`

**Steps:**
  1. Login, add one item to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout: Your Information page is visible
  2. Fill First Name with '!@#$%', Last Name with '^&*()', Zip/Postal Code with '<>?/{}'; click [data-test="continue"]
    - expect: Application handles the input gracefully — either shows an error or navigates forward without JavaScript execution or crash
    - expect: No unhandled exception or page error occurs

#### 2.6. NE-06 Checkout info submitted with excessively long strings (> 100 chars)

**File:** `tests/checkout/negative-long-strings.spec.ts`

**Steps:**
  1. Login, add one item to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout: Your Information page is visible
  2. Fill First Name, Last Name, and Zip with 150-character strings; click [data-test="continue"]
    - expect: Application handles gracefully — no crash, no layout overflow, no JavaScript error

### 3. Edge Cases — Boundary Conditions

**Seed:** `tests/seed.spec.ts`

#### 3.1. EC-01 Checkout info with single-character values in all fields

**File:** `tests/checkout/edge-single-char-fields.spec.ts`

**Steps:**
  1. Login, add one item to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout: Your Information page is visible
  2. Fill First Name with 'A', Last Name with 'B', Zip/Postal Code with '1'; click [data-test="continue"]
    - expect: URL changes to https://www.saucedemo.com/checkout-step-two.html
    - expect: Order overview page is visible with items listed

#### 3.2. EC-02 Checkout info with numeric-only First and Last Name

**File:** `tests/checkout/edge-numeric-names.spec.ts`

**Steps:**
  1. Login, add one item to cart, click Checkout to reach /checkout-step-one.html
    - expect: Checkout: Your Information page is visible
  2. Fill First Name with '12345', Last Name with '67890', Zip/Postal Code with '99999'; click [data-test="continue"]
    - expect: URL changes to https://www.saucedemo.com/checkout-step-two.html
    - expect: Overview page is visible

#### 3.3. EC-03 Checkout with exactly one product in cart

**File:** `tests/checkout/edge-single-product-checkout.spec.ts`

**Steps:**
  1. Login; add only Sauce Labs Backpack to the cart; navigate to cart; verify only one item is listed; click Checkout
    - expect: Cart shows exactly 1 item; badge shows '1'
    - expect: /checkout-step-one.html loads
  2. Fill checkout info (John / Doe / 90210) and click Continue, then click Finish
    - expect: /checkout-step-two.html shows only Sauce Labs Backpack
    - expect: /checkout-complete.html shows 'Thank you for your order!'

#### 3.4. EC-04 Verify cart badge count reflects exact number of items added

**File:** `tests/checkout/edge-cart-badge-count.spec.ts`

**Steps:**
  1. Login; add Sauce Labs Backpack to cart
    - expect: Cart badge shows '1'
  2. Add Sauce Labs Bike Light to cart
    - expect: Cart badge shows '2'
  3. Add Sauce Labs Bolt T-Shirt to cart
    - expect: Cart badge shows '3'
  4. Navigate to cart and count item rows
    - expect: Cart page shows exactly 3 item rows matching the items added

### 4. Navigation Flow

**Seed:** `tests/seed.spec.ts`

#### 4.1. NF-01 Cancel on checkout-step-one returns to cart with items intact

**File:** `tests/checkout/nav-cancel-step-one.spec.ts`

**Steps:**
  1. Login; add Sauce Labs Backpack and Sauce Labs Bike Light to cart; click cart icon; click Checkout to reach /checkout-step-one.html
    - expect: /checkout-step-one.html is visible
  2. Click the Cancel button without filling any fields
    - expect: URL returns to https://www.saucedemo.com/cart.html
    - expect: Both Sauce Labs Backpack and Sauce Labs Bike Light items are still listed in the cart
    - expect: Cart badge still shows '2'

#### 4.2. NF-02 Cancel on checkout-step-two returns to products page

**File:** `tests/checkout/nav-cancel-step-two.spec.ts`

**Steps:**
  1. Login; add one item; navigate through cart → checkout-step-one (fill valid info) → reach /checkout-step-two.html
    - expect: /checkout-step-two.html overview page is visible
  2. Click the Cancel button on the overview page
    - expect: URL changes to https://www.saucedemo.com/inventory.html
    - expect: Products page content is visible

#### 4.3. NF-03 Continue Shopping on cart page returns to products page

**File:** `tests/checkout/nav-continue-shopping.spec.ts`

**Steps:**
  1. Login; add Sauce Labs Backpack to cart; navigate to /cart.html
    - expect: /cart.html is visible with one item in cart
  2. Click the 'Continue Shopping' button
    - expect: URL changes to https://www.saucedemo.com/inventory.html
    - expect: Products page is visible
  3. Click the cart icon to return to cart
    - expect: Sauce Labs Backpack is still in the cart (cart not cleared by Continue Shopping)

#### 4.4. NF-04 Back Home after order confirmation returns to products page with empty cart

**File:** `tests/checkout/nav-back-home.spec.ts`

**Steps:**
  1. Login; add one item; complete full checkout (cart → step one → step two → finish); reach /checkout-complete.html
    - expect: 'Thank you for your order!' heading is visible
  2. Click the 'Back Home' button
    - expect: URL is https://www.saucedemo.com/inventory.html
    - expect: Cart badge is not visible (order cleared the cart)

### 5. UI Element Validation

**Seed:** `tests/seed.spec.ts`

#### 5.1. UI-01 Cart page — verify item name, description, price, quantity labels are visible

**File:** `tests/checkout/ui-cart-page.spec.ts`

**Steps:**
  1. Login; add Sauce Labs Backpack to cart; navigate to /cart.html
    - expect: 'Your Cart' heading is visible
    - expect: 'QTY' column label is visible
    - expect: 'Description' column label is visible
    - expect: Item row shows: name 'Sauce Labs Backpack', description text, price '$29.99', quantity '1'
    - expect: 'Continue Shopping' button is visible with correct label
    - expect: 'Checkout' button is visible with correct label

#### 5.2. UI-02 Checkout step one — verify field labels, placeholders, and button labels

**File:** `tests/checkout/ui-checkout-step-one.spec.ts`

**Steps:**
  1. Login; add one item to cart; click Checkout to reach /checkout-step-one.html
    - expect: 'Checkout: Your Information' heading is visible
  2. Inspect the form without filling it
    - expect: First Name field placeholder text is 'First Name'
    - expect: Last Name field placeholder text is 'Last Name'
    - expect: Zip/Postal Code field placeholder text is 'Zip/Postal Code'
    - expect: 'Cancel' button is visible with label 'Cancel'
    - expect: 'Continue' button is visible with label 'Continue'

#### 5.3. UI-03 Checkout step two — verify payment info, shipping info, subtotal, tax, total sections

**File:** `tests/checkout/ui-checkout-step-two.spec.ts`

**Steps:**
  1. Login; add Sauce Labs Backpack and Sauce Labs Bike Light to cart; complete checkout-step-one with John / Doe / 90210 to reach /checkout-step-two.html
    - expect: 'Checkout: Overview' heading is visible
  2. Inspect all sections on the overview page
    - expect: 'Payment Information:' label is visible and shows 'SauceCard #31337'
    - expect: 'Shipping Information:' label is visible and shows 'Free Pony Express Delivery!'
    - expect: 'Item total: $39.98' line is visible
    - expect: 'Tax: $3.20' line is visible
    - expect: 'Total: $43.18' line is visible
    - expect: 'Cancel' button is visible
    - expect: 'Finish' button is visible

#### 5.4. UI-04 Order confirmation — verify success heading, body text, and Back Home button

**File:** `tests/checkout/ui-confirmation.spec.ts`

**Steps:**
  1. Login; add one item; complete full checkout; reach /checkout-complete.html
    - expect: 'Checkout: Complete!' heading is visible
  2. Inspect the confirmation page
    - expect: 'Thank you for your order!' heading (h2) is visible
    - expect: Body text 'Your order has been dispatched, and will arrive just as fast as the pony can get there!' is visible
    - expect: Pony Express image is visible and not broken
    - expect: 'Back Home' button is visible with label 'Back Home'
