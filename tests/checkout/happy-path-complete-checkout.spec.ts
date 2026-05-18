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

test.describe('Happy Path', () => {
  test('HP-01 Complete checkout end-to-end happy path', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const stepOnePage = new CheckoutStepOnePage(page);
    const stepTwoPage = new CheckoutStepTwoPage(page);
    const completePage = new CheckoutCompletePage(page);

    // 1. Login as standard_user
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // 2. Add Backpack and Bike Light to cart
    await inventoryPage.addBackpack();
    await inventoryPage.addBikeLight();

    // 3. Go to cart and verify both items are present
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain('Sauce Labs Backpack');
    expect(itemNames).toContain('Sauce Labs Bike Light');

    // 4. Proceed to checkout step one and fill in customer info
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await stepOnePage.fillInfo('John', 'Doe', '90210');
    await stepOnePage.continue();

    // 5. Verify checkout step two details
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    expect(await stepTwoPage.getPaymentInfo()).toBe('SauceCard #31337');
    expect(await stepTwoPage.getShippingInfo()).toBe('Free Pony Express Delivery!');
    expect(await stepTwoPage.getItemTotal()).toBe('Item total: $39.98');
    expect(await stepTwoPage.getTax()).toBe('Tax: $3.20');
    expect(await stepTwoPage.getTotal()).toBe('Total: $43.18');

    // 6. Finish the order
    await stepTwoPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // 7. Verify confirmation heading
    expect(await completePage.getConfirmationHeading()).toBe('Thank you for your order!');

    // 8. Go back home and verify inventory URL and cart badge gone
    await completePage.backHome();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();

    await page.screenshot({ path: 'specs/screenshots/hp-01-complete-checkout-pass.png' });
  });
});
