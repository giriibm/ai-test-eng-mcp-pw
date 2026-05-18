// spec: util/manual-tests/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('Edge Cases', () => {
  test('EC-04 Verify cart badge count reflects items added', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Login
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);

    // Add Backpack — badge should be '1'
    await inventoryPage.addBackpack();
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');

    // Add Bike Light — badge should be '2'
    await inventoryPage.addBikeLight();
    expect(await inventoryPage.getCartBadgeCount()).toBe('2');

    // Add Bolt T-Shirt — badge should be '3'
    await inventoryPage.addBoltTShirt();
    expect(await inventoryPage.getCartBadgeCount()).toBe('3');

    // Go to cart and verify 3 item rows
    await inventoryPage.goToCart();
    expect(await cartPage.getItemCount()).toBe(3);

    await page.screenshot({ path: 'reports/screenshots/ec-04-cart-badge-count-pass.png' });
  });
});
