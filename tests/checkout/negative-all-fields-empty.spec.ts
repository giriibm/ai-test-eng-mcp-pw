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

  test('NE-01 Checkout info submitted with all fields empty', async ({ page }) => {
    const stepOnePage = new CheckoutStepOnePage(page);

    // Click Continue without filling any fields
    await stepOnePage.continue();

    // Verify error message and URL stays on step one
    expect(await stepOnePage.getErrorMessage()).toBe('Error: First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await page.screenshot({ path: 'specs/screenshots/ne-01-all-fields-empty-pass.png' });
  });
});
