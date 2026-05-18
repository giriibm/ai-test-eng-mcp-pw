// spec: specs/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('UI Element Validation', () => {
  test('UI-02 Checkout step one — verify all UI elements visible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.addBackpack();
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await expect(page.getByText('Checkout: Your Information')).toBeVisible();
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.locator('[data-test="continue"]')).toBeVisible();

    await page.screenshot({ path: 'specs/screenshots/ui-02-checkout-step-one-pass.png' });
  });
});
