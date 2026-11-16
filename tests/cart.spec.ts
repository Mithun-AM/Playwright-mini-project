
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { readExcel } from '../utils/excelReader';

const cartData = readExcel('./test-data/SauceDemo.xlsx', 'Cart');

test.describe('Shopping Cart - Excel Data Driven', () => {

    for (const data of cartData) {

        test(data.testCase, async ({ page }) => {

            test.skip(
                String(data.run).toLowerCase() !== 'true',
                'Test case disabled in Excel'
            );

            const loginPage = new LoginPage(page);
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);

            await loginPage.goto();
            await loginPage.login('standard_user', 'secret_sauce');
            await loginPage.expectLoggedIn();

            const products = String(data.products)
                .split(';')
                .map((product: string) => product.trim())
                .filter(Boolean);

            for (const product of products) {
                await inventoryPage.addProduct(product);
            }

            if (data.action === 'remove') {

                if (data.removeFrom === 'inventory') {

                    await inventoryPage.removeProduct(
                        String(data.removeProduct)
                    );

                }

                await inventoryPage.openCart();

                if (data.removeFrom === 'cart') {

                    await cartPage.removeProduct(
                        String(data.removeProduct)
                    );

                }

            } else {

                await inventoryPage.openCart();

            }

            await cartPage.expectItemCount(
                Number(data.expectedCount)
            );

            if (data.removeFrom === 'inventory') {

                const remainingProducts = products.filter(
                    (product: string) => product !== String(data.removeProduct)
                );

                for (const product of remainingProducts) {
                    await cartPage.expectProduct(product);
                }

                await expect(cartPage.cartItems).not.toContainText(
                    String(data.removeProduct)
                );

            } else if (data.removeFrom === 'cart') {

                if (Number(data.expectedCount) === 0) {

                    await expect(cartPage.cartItems).toHaveCount(0);

                } else {

                    await expect(cartPage.cartItems).not.toContainText(
                        String(data.removeProduct)
                    );

                }

            } else {

                for (const product of products) {
                    await cartPage.expectProduct(product);
                }

            }

        });
    }
});
