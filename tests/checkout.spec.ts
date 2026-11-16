
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { readExcel } from '../utils/excelReader';

const checkoutData = readExcel(
    './test-data/SauceDemo.xlsx',
    'Checkout'
);

test.describe('Checkout - Excel Data Driven', () => {

    for (const data of checkoutData) {

        test(data.testCase, async ({ page }) => {

            test.skip(
                String(data.run).toLowerCase() !== 'true',
                'Test case disabled in Excel'
            );

            const loginPage = new LoginPage(page);
            const inventoryPage = new InventoryPage(page);
            const cartPage = new CartPage(page);
            const checkoutPage = new CheckoutPage(page);

            // Login
            await loginPage.goto();
            await loginPage.login('standard_user', 'secret_sauce');
            await loginPage.expectLoggedIn();

            // Add product and navigate to checkout
            await inventoryPage.addProduct(String(data.product));
            await inventoryPage.openCart();
            await cartPage.checkout();

            // Fill customer information
            await checkoutPage.fillCustomerInformation(
                String(data.firstName ?? ''),
                String(data.lastName ?? ''),
                String(data.postalCode ?? '')
            );

            await checkoutPage.continueToOverview();

            if (data.expected === 'error') {

                await checkoutPage.expectInformationError(
                    String(data.expectedMessage)
                );

            } else if (data.expected === 'success') {

                await checkoutPage.expectOverviewLoaded();
                await checkoutPage.expectSummaryTotal();

                await checkoutPage.finishOrder();
                await checkoutPage.expectOrderComplete();

            } else {

                throw new Error(
                    `Invalid expected value: ${data.expected}`
                );

            }

        });
    }
});
