// spec: specs/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('Negative — Validation Errors', () => {
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

  test('NE-03 Checkout info submitted with Last Name empty only', async ({ page }) => {
    const stepOnePage = new CheckoutStepOnePage(page);

    // Fill First Name and Zip, leave Last Name empty
    await stepOnePage.fillInfo('John', '', '90210');
    await stepOnePage.continue();

    // Verify last name required error
    expect(await stepOnePage.getErrorMessage()).toBe('Error: Last Name is required');

    await page.screenshot({ path: 'specs/screenshots/ne-03-last-name-empty-pass.png' });
  });
});
