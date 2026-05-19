// spec: util/manual-tests/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('Negative — Validation Errors (NE-06)', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.addBackpack();
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('NE-06 Checkout info submitted with excessively long strings', async ({ page }) => {
    const stepOnePage = new CheckoutStepOnePage(page);
    const longString = 'A'.repeat(150);

    // Fill all fields with 150-character strings
    await stepOnePage.fillInfo(longString, longString, longString);
    await stepOnePage.continue();

    // SauceDemo accepts long strings and advances — assert step two rendered correctly
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="checkout-summary-container"]')).toBeVisible();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();
  });
});
