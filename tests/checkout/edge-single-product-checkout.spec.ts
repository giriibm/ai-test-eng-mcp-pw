// spec: specs/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('Edge Cases', () => {
  test('EC-03 Checkout with exactly one product in cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const stepOnePage = new CheckoutStepOnePage(page);
    const stepTwoPage = new CheckoutStepTwoPage(page);
    const completePage = new CheckoutCompletePage(page);

    // Login and add only Backpack
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.addBackpack();
    await inventoryPage.goToCart();
    await cartPage.checkout();

    // Fill checkout info and complete
    await stepOnePage.fillInfo('John', 'Doe', '90210');
    await stepOnePage.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await stepTwoPage.finish();

    // Verify order confirmation
    await expect(page).toHaveURL(/checkout-complete\.html/);
    expect(await completePage.getConfirmationHeading()).toBe('Thank you for your order!');

    await page.screenshot({ path: 'specs/screenshots/ec-03-single-product-checkout-pass.png' });
  });
});
