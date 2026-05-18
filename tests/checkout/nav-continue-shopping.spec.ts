// spec: specs/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('Navigation Flow', () => {
  test('NF-03 Continue Shopping returns to inventory without clearing cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.addBackpack();
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);

    await cartPage.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();

    // Return to cart and verify item is still there
    await inventoryPage.goToCart();
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');

    await page.screenshot({ path: 'specs/screenshots/nf-03-continue-shopping-pass.png' });
  });
});
