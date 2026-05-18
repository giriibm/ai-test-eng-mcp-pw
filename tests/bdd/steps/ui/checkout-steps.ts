/**
 * UI Step Definitions for E-commerce Checkout Smoke Tests
 * Reuses existing Page Object Models from tests/ui/pages/
 */
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../../../ui/pages/LoginPage';
import { InventoryPage } from '../../../ui/pages/InventoryPage';
import { CartPage } from '../../../ui/pages/CartPage';
import { CheckoutStepOnePage } from '../../../ui/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../../ui/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../../ui/pages/CheckoutCompletePage';

const { Given, When, Then } = createBdd();

// ====================
// Given Steps
// ====================

Given('the user navigates to SauceDemo application', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
});

Given('the user is logged in as {string} with password {string}', async ({ page }, username: string, password: string) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);
  
  // Wait for inventory page to load
  await page.waitForSelector('[data-test="inventory-list"]');
});

// ====================
// When Steps
// ====================

When('the user adds {string} to cart', async ({ page }, productName: string) => {
  const inventoryPage = new InventoryPage(page);
  
  // Map product names to methods
  switch (productName) {
    case 'Sauce Labs Backpack':
      await inventoryPage.addBackpack();
      break;
    case 'Sauce Labs Bike Light':
      await inventoryPage.addBikeLight();
      break;
    case 'Sauce Labs Bolt T-Shirt':
      await inventoryPage.addBoltTShirt();
      break;
    default:
      // Generic add button by product name
      await page.locator(`button[data-test*="add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-')}"]`).click();
  }
});

When('the user navigates to cart page', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goToCart();
  
  // Wait for cart page to load
  await page.waitForSelector('[data-test="cart-list"]');
});

When('the user proceeds to checkout', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.checkout();
  
  // Wait for checkout page to load
  await page.waitForSelector('[data-test="checkout-info-container"]');
});

When('the user enters shipping information with firstName {string}, lastName {string}, zipCode {string}', 
  async ({ page }, firstName: string, lastName: string, zipCode: string) => {
  const checkoutPage = new CheckoutStepOnePage(page);
  await checkoutPage.fillInfo(firstName, lastName, zipCode);
});

When('the user continues to order review', async ({ page }) => {
  const checkoutPage = new CheckoutStepOnePage(page);
  await checkoutPage.continue();
  
  // Wait for review page to load
  await page.waitForSelector('[data-test="checkout-summary-container"]');
});

When('the user completes the order', async ({ page }) => {
  const reviewPage = new CheckoutStepTwoPage(page);
  await reviewPage.finish();
  
  // Wait for confirmation page to load
  await page.waitForSelector('[data-test="checkout-complete-container"]');
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
