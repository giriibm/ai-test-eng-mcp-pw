// spec: util/manual-tests/ecom-checkout-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { STANDARD_USER } from '../helpers/TestDataHelper';

test.describe('Navigation Flow', () => {
  test('NF-02 Cancel on step two returns to inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const stepOnePage = new CheckoutStepOnePage(page);

    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await inventoryPage.addBackpack();
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await stepOnePage.fillInfo('John', 'Doe', '90210');
    await stepOnePage.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();

    await page.screenshot({ path: 'reports/screenshots/nf-02-cancel-step-two-pass.png' });
  });
});
