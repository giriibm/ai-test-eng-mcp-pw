// spec: specs/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('Navigation Flows', () => {
  test('NF-01 Cancel on step one returns to cart with items intact', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const stepOnePage = new CheckoutStepOnePage(page);

    // Login and add Backpack + Bike Light
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.addBackpack();
    await inventoryPage.addBikeLight();
    await inventoryPage.goToCart();

    // Proceed to checkout step one
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Cancel and expect to be back on cart page
    await stepOnePage.cancel();
    await expect(page).toHaveURL(/cart\.html/);

    // Both items should still be in cart
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');

    // Cart badge should show 2
    expect(await inventoryPage.getCartBadgeCount()).toBe('2');

    await page.screenshot({ path: 'specs/screenshots/nf-01-cancel-step-one-pass.png' });
  });
});
