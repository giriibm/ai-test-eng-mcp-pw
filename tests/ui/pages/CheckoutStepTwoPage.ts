import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  private readonly finishButton = this.page.locator('[data-test="finish"]');
  private readonly cancelButton = this.page.locator('[data-test="cancel"]');
  private readonly subtotalLabel = this.page.locator('[data-test="subtotal-label"]');
  private readonly taxLabel = this.page.locator('[data-test="tax-label"]');
  private readonly totalLabel = this.page.locator('[data-test="total-label"]');
  private readonly paymentInfoValue = this.page.locator('[data-test="payment-info-value"]');
  private readonly shippingInfoValue = this.page.locator('[data-test="shipping-info-value"]');

  constructor(page: Page) {
    super(page);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getItemTotal(): Promise<string> {
    return (await this.subtotalLabel.textContent()) ?? '';
  }

  async getTax(): Promise<string> {
    return (await this.taxLabel.textContent()) ?? '';
  }

  async getTotal(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? '';
  }

  async getPaymentInfo(): Promise<string> {
    return (await this.paymentInfoValue.textContent()) ?? '';
  }

  async getShippingInfo(): Promise<string> {
    return (await this.shippingInfoValue.textContent()) ?? '';
  }
}
