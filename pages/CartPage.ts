import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
  }

  async expectItemCount(count: number){
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectProduct(productName: string){
    await expect(this.cartItems.filter({ hasText: productName })).toBeVisible();
  }

  async expectProductPrice(productName: string, price: string){
    const item = this.cartItems.filter({ hasText: productName });
    await expect(item.locator('.inventory_item_price')).toHaveText(price);
  }

  async removeProduct(productName: string){
    const item = this.cartItems.filter({ hasText: productName });
    await item.getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
