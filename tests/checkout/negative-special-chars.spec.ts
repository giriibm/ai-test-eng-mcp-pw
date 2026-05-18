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

  test('NE-05 Checkout info submitted with special characters', async ({ page }) => {
    const stepOnePage = new CheckoutStepOnePage(page);

    // Fill all fields with special characters
    await stepOnePage.fillInfo('!@#$%', '^&*()', '<>?/{}');
    await stepOnePage.continue();

    // Verify no crash — either an error is shown or step two loads
    const currentUrl = page.url();
    expect(
      currentUrl.includes('/checkout-step-one.html') || currentUrl.includes('/checkout-step-two.html')
    ).toBe(true);

    await page.screenshot({ path: 'specs/screenshots/ne-05-special-chars-pass.png' });
  });
});
