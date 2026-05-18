Feature: E-commerce Checkout Smoke Tests
  As a customer
  I want to complete a purchase
  So that I can order products from the store

  Background:
    Given the user navigates to SauceDemo application

  Scenario: Complete checkout with single product
    Given the user is logged in as "standard_user" with password "secret_sauce"
    When the user adds "Sauce Labs Backpack" to cart
    And the user navigates to cart page
    And the user proceeds to checkout
    And the user enters shipping information with firstName "John", lastName "Doe", zipCode "12345"
    And the user continues to order review
    And the user completes the order
    Then the order confirmation message should contain "Thank you for your order!"
    And the user should be on the checkout complete page

  Scenario: View cart and continue shopping
    Given the user is logged in as "standard_user" with password "secret_sauce"
    When the user adds "Sauce Labs Bike Light" to cart
    And the user navigates to cart page
    Then the cart badge should show "1"
    And the cart should contain product "Sauce Labs Bike Light"
    When the user clicks "Continue Shopping" button
    Then the user should be on the inventory page
    And the cart badge should still show "1"
