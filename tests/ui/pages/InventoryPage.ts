import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly addBackpackButton = this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  private readonly addBikeLightButton = this.page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
  private readonly addBoltTShirtButton = this.page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
  private readonly cartLink = this.page.locator('[data-test="shopping-cart-link"]');
  private readonly cartBadge = this.page.locator('[data-test="shopping-cart-badge"]');

  constructor(page: Page) {
    super(page);
  }

  async addBackpack(): Promise<void> {
    await this.addBackpackButton.click();
  }

  async addBikeLight(): Promise<void> {
    await this.addBikeLightButton.click();
  }

  async addBoltTShirt(): Promise<void> {
    await this.addBoltTShirtButton.click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartBadgeCount(): Promise<string> {
    return (await this.cartBadge.textContent()) ?? '0';
  }
}
