// spec: util/manual-tests/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('UI Element Validation', () => {
  test('UI-01 Cart page — verify all UI elements visible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.addBackpack();
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);

    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.getByText('QTY')).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();

    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    await expect(page.getByText('$29.99')).toBeVisible();

    await expect(page.getByRole('button', { name: /Continue Shopping/i })).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();

    await page.screenshot({ path: 'reports/screenshots/ui-01-cart-page-pass.png' });
  });
});
