// spec: util/manual-tests/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('Navigation Flow', () => {
  test('NF-04 Back Home after order returns to inventory with empty cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const stepOnePage = new CheckoutStepOnePage(page);
    const stepTwoPage = new CheckoutStepTwoPage(page);
    const completePage = new CheckoutCompletePage(page);

    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.addBackpack();
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await stepOnePage.fillInfo('John', 'Doe', '90210');
    await stepOnePage.continue();
    await stepTwoPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();

    await completePage.backHome();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();

    await page.screenshot({ path: 'reports/screenshots/nf-04-back-home-pass.png' });
  });
});
