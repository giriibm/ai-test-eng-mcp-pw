/**
 * UI Step Definitions for E-commerce Checkout Smoke Tests
 * Reuses existing Page Object Models from tests/ui/pages/
 */
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../../../fixtures/bdd-fixtures';
import { LoginPage } from '../../../ui/pages/LoginPage';
import { InventoryPage } from '../../../ui/pages/InventoryPage';
import { CartPage } from '../../../ui/pages/CartPage';
import { CheckoutStepOnePage } from '../../../ui/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../../ui/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../../ui/pages/CheckoutCompletePage';

const { Given, When, Then } = createBdd(test);

// ====================
// Given Steps
// ====================

Given('the user navigates to SauceDemo application', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
});

Given('the user is logged in as {string} with password {string}', async ({ page }, username: string, password: string) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);
  await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
});

// ====================
// When Steps
// ====================

When('the user adds {string} to cart', async ({ page }, productName: string) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addItemToCart(productName);
});

When('the user navigates to cart page', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goToCart();
  await expect(page.locator('[data-test="cart-list"]')).toBeVisible();
});

When('the user proceeds to checkout', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.checkout();
  await expect(page.locator('[data-test="checkout-info-container"]')).toBeVisible();
});

When('the user enters shipping information with firstName {string}, lastName {string}, zipCode {string}', 
  async ({ page }, firstName: string, lastName: string, zipCode: string) => {
  const checkoutPage = new CheckoutStepOnePage(page);
  await checkoutPage.fillInfo(firstName, lastName, zipCode);
});

When('the user continues to order review', async ({ page }) => {
  const checkoutPage = new CheckoutStepOnePage(page);
  await checkoutPage.continue();
  await expect(page.locator('[data-test="checkout-summary-container"]')).toBeVisible();
});

When('the user completes the order', async ({ page }) => {
  const reviewPage = new CheckoutStepTwoPage(page);
  await reviewPage.finish();
  await expect(page.locator('[data-test="checkout-complete-container"]')).toBeVisible();
});

When('the user clicks {string} button', async ({ page }, buttonText: string) => {
  const cartPage = new CartPage(page);
  
  if (buttonText === 'Continue Shopping') {
    await cartPage.continueShopping();
  } else {
    // Generic button handling
    await page.getByText(buttonText).click();
  }
});

// ====================
// Then Steps
// ====================

Then('the order confirmation message should contain {string}', async ({ page }, expectedText: string) => {
  const completePage = new CheckoutCompletePage(page);
  const confirmationText = await completePage.getConfirmationHeading();
  
  expect(confirmationText).toContain(expectedText);
});

Then('the confirmation header should contain {string}', async ({ page }, expectedText: string) => {
  const headerLocator = page.locator('.complete-header');
  await expect(headerLocator).toContainText(expectedText);
});

Then('the user should be on the checkout complete page', async ({ page }) => {
  // Verify we're on the complete page
  await expect(page).toHaveURL(/checkout-complete/);
  
  // Verify the complete container is visible
  await expect(page.locator('[data-test="checkout-complete-container"]')).toBeVisible();
});

Then('the cart badge should show {string}', async ({ page }, expectedCount: string) => {
  const inventoryPage = new InventoryPage(page);
  const badgeCount = await inventoryPage.getCartBadgeCount();
  
  expect(badgeCount).toBe(expectedCount);
});

Then('the cart should contain product {string}', async ({ page }, productName: string) => {
  const cartPage = new CartPage(page);
  const itemNames = await cartPage.getItemNames();
  
  expect(itemNames).toContain(productName);
});

Then('the user should be on the inventory page', async ({ page }) => {
  // Verify URL contains inventory
  await expect(page).toHaveURL(/inventory/);
  
  // Verify inventory list is visible
  await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
});

Then('the cart badge should still show {string}', async ({ page }, expectedCount: string) => {
  const inventoryPage = new InventoryPage(page);
  const badgeCount = await inventoryPage.getCartBadgeCount();
  
  expect(badgeCount).toBe(expectedCount);
});
