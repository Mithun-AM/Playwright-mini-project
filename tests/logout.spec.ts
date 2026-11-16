
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { readExcel } from '../utils/excelReader';

const logoutData = readExcel('./test-data/SauceDemo.xlsx', 'Logout');

test.describe('Logout - Excel Data Driven', () => {

    for (const data of logoutData) {

        test(data.testCase, async ({ page }) => {

            test.skip(
                String(data.run).toLowerCase() !== 'true',
                'Test case disabled in Excel'
            );

            const loginPage = new LoginPage(page);
            const inventoryPage = new InventoryPage(page);

            await loginPage.goto();

            await loginPage.login(String(data.username ?? ''), String(data.password ?? ''));

            await loginPage.expectLoggedIn();

            await inventoryPage.logout();

            await expect(page.locator('#login-button')).toBeVisible();
        });
    }
});
