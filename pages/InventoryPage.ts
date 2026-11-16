import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async expectLoaded(){
    await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  private productCard(productName: string): Locator {
    return this.inventoryItems.filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  async addProduct(productName: string){
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProduct(productName: string) {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async expectCartCount(count: number){
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  async openCart(){
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL(/\/$/);
  }
}
