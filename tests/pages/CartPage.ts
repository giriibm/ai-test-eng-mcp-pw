import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  private readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
  private readonly cartItems = this.page.locator('[data-test="inventory-item-name"]');

  constructor(page: Page) {
    super(page);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async getItemNames(): Promise<string[]> {
    return await this.cartItems.allTextContents();
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
}
