// spec: util/manual-tests/ecom-checkout-test-plan.md
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

  test('NE-02 Checkout info submitted with First Name empty only', async ({ page }) => {
    const stepOnePage = new CheckoutStepOnePage(page);

    // Fill Last Name and Zip, leave First Name empty
    await stepOnePage.fillInfo('', 'Doe', '90210');
    await stepOnePage.continue();

    // Verify first name required error
    expect(await stepOnePage.getErrorMessage()).toBe('Error: First Name is required');

    await page.screenshot({ path: 'reports/screenshots/ne-02-first-name-empty-pass.png' });
  });
});
