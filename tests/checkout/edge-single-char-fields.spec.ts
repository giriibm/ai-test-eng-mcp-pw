// spec: specs/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('Edge Cases', () => {
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

  test('EC-01 Checkout info with single-character values', async ({ page }) => {
    const stepOnePage = new CheckoutStepOnePage(page);

    // Fill all fields with single characters
    await stepOnePage.fillInfo('A', 'B', '1');
    await stepOnePage.continue();

    // Expect step two to load
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await page.screenshot({ path: 'specs/screenshots/ec-01-single-char-fields-pass.png' });
  });
});
