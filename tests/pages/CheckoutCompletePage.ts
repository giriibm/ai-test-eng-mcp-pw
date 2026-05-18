import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  private readonly confirmationHeading = this.page.getByRole('heading', { name: 'Thank you for your order!' });
  private readonly backHomeButton = this.page.locator('[data-test="back-to-products"]');

  constructor(page: Page) {
    super(page);
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  async getConfirmationHeading(): Promise<string> {
    return (await this.confirmationHeading.textContent()) ?? '';
  }
}
