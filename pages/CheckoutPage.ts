import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly summaryItems: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('#first-name');
    this.lastName = page.locator('#last-name');
    this.postalCode = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.finishButton = page.locator('#finish');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryItems = page.locator('.cart_item');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillCustomerInformation(first: string, last: string, postal: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(postal);
  }

  async continueToOverview(){
    await this.continueButton.click();
  }

  async expectInformationError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectOverviewLoaded(){
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(this.summaryItems.first()).toBeVisible();
  }

  async expectSummaryTotal(){
    const itemTotalText = await this.itemTotal.innerText();
    const taxText = await this.tax.innerText();
    const totalText = await this.total.innerText();

    const itemTotal = Number(itemTotalText.replace(/[^\d.]/g, ''));
    const tax = Number(taxText.replace(/[^\d.]/g, ''));
    const total = Number(totalText.replace(/[^\d.]/g, ''));

    expect(total).toBeCloseTo(itemTotal + tax, 2);
  }

  async finishOrder(){
    await this.finishButton.click();
  }

  async expectOrderComplete(){
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
