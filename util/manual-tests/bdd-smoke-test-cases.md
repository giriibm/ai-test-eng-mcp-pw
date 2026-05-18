# BDD Smoke Test Cases - Gherkin Format

**Project**: AI QA Agent - Playwright Test Automation Suite  
**Test Type**: BDD Smoke Tests  
**Framework**: Gherkin/Cucumber with playwright-bdd  
**Total Test Cases**: 3 (2 UI + 1 API)  
**Purpose**: Quick validation of critical functionality for demo and CI/CD  
**Last Updated**: May 18, 2026

---

## Table of Contents
1. [UI Smoke Tests](#ui-smoke-tests) (2 tests)
2. [API Smoke Tests](#api-smoke-tests) (1 test)
3. [Test Data](#test-data)
4. [Prerequisites](#prerequisites)

---

## UI Smoke Tests

### Test Suite: E-commerce Checkout Critical Paths
**Application**: https://www.saucedemo.com  
**Feature**: Checkout flow validation

---

### TC-BDD-UI-001: Complete Checkout with Single Product

**Priority**: Critical  
**Category**: Happy Path / Smoke Test  
**Estimated Execution Time**: 8-10 seconds

```gherkin
Feature: E-commerce Checkout Smoke Tests
  As a customer
  I want to complete a purchase
  So that I can order products from the store

  Background:
    Given the application is accessible at "https://www.saucedemo.com"
    And the user has valid credentials

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
    And the confirmation message should include "Your order has been dispatched"
    And the cart badge should be empty
```

**Expected Results:**
- ✅ User successfully logs in
- ✅ Product added to cart
- ✅ Cart page displays correct product
- ✅ Checkout form accepts shipping information
- ✅ Order review page shows correct details
- ✅ Order confirmation page displays success message
- ✅ Cart is cleared after order completion

**Test Data:**
- **Username**: standard_user
- **Password**: secret_sauce
- **Product**: Sauce Labs Backpack
- **Shipping Info**: John Doe, 12345

---

### TC-BDD-UI-002: View Cart and Continue Shopping

**Priority**: Critical  
**Category**: Navigation / Smoke Test  
**Estimated Execution Time**: 3-5 seconds

```gherkin
  Scenario: User can view cart and return to shopping
    Given the user is logged in as "standard_user"
    When the user adds "Sauce Labs Bike Light" to cart
    And the user navigates to cart page
    Then the cart badge should show "1"
    And the cart should contain "Sauce Labs Bike Light"
    When the user clicks "Continue Shopping"
    Then the user should be on the inventory page
    And the cart badge should still show "1"
    And the user should see all available products
```

**Expected Results:**
- ✅ User successfully logs in
- ✅ Product added to cart
- ✅ Cart badge updates to show "1"
- ✅ Cart page displays added product
- ✅ "Continue Shopping" button navigates back to inventory
- ✅ Cart badge persists after navigation
- ✅ All products still visible on inventory page

**Test Data:**
- **Username**: standard_user
- **Password**: secret_sauce
- **Product**: Sauce Labs Bike Light

---

## API Smoke Tests

### Test Suite: Booking API Critical Operations
**API**: https://restful-booker.herokuapp.com  
**Feature**: Complete booking lifecycle validation

---

### TC-BDD-API-001: Complete Booking Lifecycle

**Priority**: Critical  
**Category**: End-to-End / Smoke Test  
**Estimated Execution Time**: 5-7 seconds

```gherkin
Feature: Booking API Smoke Tests
  As an API consumer
  I want to perform complete booking operations
  So that I can manage hotel reservations

  Background:
    Given the Restful-Booker API is accessible at "https://restful-booker.herokuapp.com"
    And valid authentication credentials are available

  Scenario: Complete booking lifecycle - Create, Retrieve, Update, Delete
    Given authentication token is obtained with credentials:
      | username | password    |
      | admin    | password123 |
    And the auth token should be valid
    When a new booking is created with:
      | firstname | lastname | totalprice | depositpaid | checkin    | checkout   |
      | John      | Doe      | 200        | true        | 2026-06-01 | 2026-06-05 |
    Then the booking should be created successfully with status code 200
    And the response should contain a booking ID
    And the booking should be retrievable by ID
    And the retrieved booking should match the created data
    When the booking is updated with new dates:
      | checkin    | checkout   |
      | 2026-07-01 | 2026-07-10 |
    Then the update should be successful with status code 200
    And the booking should reflect the updated dates
    And firstname should still be "John"
    And lastname should still be "Doe"
    When the booking is deleted with authentication
    Then the deletion should be successful with status code 201
    And the booking should no longer exist
    And retrieving the deleted booking should return status code 404
```

**Expected Results:**
- ✅ Authentication token generated successfully
- ✅ Booking created with valid data (HTTP 200)
- ✅ Booking ID returned in response
- ✅ Booking retrievable via GET request
- ✅ Retrieved data matches created data
- ✅ Booking updated successfully (HTTP 200)
- ✅ Updated dates reflected in GET request
- ✅ Other fields remain unchanged
- ✅ Booking deleted successfully (HTTP 201)
- ✅ Deleted booking returns HTTP 404

**Test Data:**
- **Auth Username**: admin
- **Auth Password**: password123
- **Initial Booking**:
  - First Name: John
  - Last Name: Doe
  - Total Price: 200
  - Deposit Paid: true
  - Check-in: 2026-06-01
  - Check-out: 2026-06-05
- **Updated Booking**:
  - Check-in: 2026-07-01
  - Check-out: 2026-07-10

---

## Test Data

### UI Test Data

#### User Credentials
```yaml
standard_user:
  username: standard_user
  password: secret_sauce
```

#### Test Products
```yaml
products:
  - name: Sauce Labs Backpack
    price: $29.99
    
  - name: Sauce Labs Bike Light
    price: $9.99
```

#### Shipping Information
```yaml
shipping:
  firstName: John
  lastName: Doe
  zipCode: 12345
```

### API Test Data

#### Authentication
```yaml
api_credentials:
  username: admin
  password: password123
```

#### Booking Data
```yaml
initial_booking:
  firstname: John
  lastname: Doe
  totalprice: 200
  depositpaid: true
  bookingdates:
    checkin: 2026-06-01
    checkout: 2026-06-05
  additionalneeds: Breakfast

updated_booking:
  bookingdates:
    checkin: 2026-07-01
    checkout: 2026-07-10
```

---

## Prerequisites

### Environment Setup
1. **Node.js**: Version 18 or higher
2. **npm**: Latest version
3. **Playwright**: Installed via `npx playwright install`
4. **playwright-bdd**: Installed via `npm install -D playwright-bdd`

### Application Availability
- ✅ SauceDemo application accessible at https://www.saucedemo.com
- ✅ Restful-Booker API accessible at https://restful-booker.herokuapp.com
- ✅ Internet connection stable

### Test Account Access
- ✅ SauceDemo credentials: `standard_user` / `secret_sauce`
- ✅ Restful-Booker credentials: `admin` / `password123`

---

## Execution Instructions

### Manual Execution
1. Navigate to the application/API
2. Follow each scenario step sequentially
3. Verify expected results at each step
4. Record actual results
5. Mark test as PASS/FAIL

### Automated Execution
```bash
# Run all BDD smoke tests (3 tests)
npm run test:bdd

# Run UI smoke tests only (2 tests)
npm run test:bdd:ui

# Run API smoke test only (1 test)
npm run test:bdd:api

# Run with HTML report
npm run test:bdd -- --reporter=html

# Run in UI mode (interactive)
npx playwright test tests/bdd/features --ui
```

---

## Test Execution Log

### Expected Results Summary

| Test Case ID | Test Name | Priority | Expected Duration | Status |
|--------------|-----------|----------|-------------------|--------|
| TC-BDD-UI-001 | Complete Checkout | Critical | 8-10s | ⏳ Not Run |
| TC-BDD-UI-002 | View Cart and Continue Shopping | Critical | 3-5s | ⏳ Not Run |
| TC-BDD-API-001 | Complete Booking Lifecycle | Critical | 5-7s | ⏳ Not Run |

**Total Expected Duration**: 16-22 seconds

---

## Gherkin Best Practices Applied

### 1. Clear Feature Descriptions
```gherkin
Feature: E-commerce Checkout Smoke Tests
  As a customer
  I want to complete a purchase
  So that I can order products from the store
```

### 2. Reusable Background Steps
```gherkin
Background:
  Given the application is accessible at "https://www.saucedemo.com"
  And the user has valid credentials
```

### 3. Data Tables for Complex Input
```gherkin
When the user enters shipping information:
  | firstName | lastName | zipCode |
  | John      | Doe      | 12345   |
```

### 4. Descriptive Scenario Names
- ✅ "User can complete checkout with single product" (descriptive)
- ❌ "Test checkout" (too vague)

### 5. Business-Readable Language
- ✅ Uses "user", "customer", "booking" (domain language)
- ✅ Avoids technical jargon
- ✅ Focuses on behavior, not implementation

---

## Success Criteria

- ✅ All 3 scenarios defined in valid Gherkin syntax
- ✅ Each scenario follows Given-When-Then structure
- ✅ Test data clearly documented
- ✅ Expected results explicitly stated
- ✅ Total execution time < 30 seconds
- ✅ Tests cover critical user journeys
- ✅ Business stakeholders can understand scenarios without technical knowledge

---

## Maintenance Notes

### When to Update
- Product names change in SauceDemo
- API endpoints change in Restful-Booker
- Authentication mechanism changes
- Business requirements evolve

### Review Frequency
- Review quarterly or after major application changes
- Update test data if credentials change
- Verify scenarios still align with business priorities

---

**Document Version**: 1.0  
**Created By**: AI QA Agent  
**Review Status**: Ready for Automation  
**Next Step**: Implement automated tests using playwright-bdd

---

**End of BDD Smoke Test Cases**
