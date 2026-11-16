
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { readExcel } from '../utils/excelReader';

const loginData = readExcel('./test-data/SauceDemo.xlsx', 'Login');

test.describe('Login - Excel Data Driven', () => {

    for (const data of loginData) {

        test(data.testCase, async ({ page }) => {

            test.skip(
                String(data.run).toLowerCase() !== 'true',
                'Test case disabled in Excel'
            );

            const loginPage = new LoginPage(page);

            await loginPage.goto();

            await loginPage.login(
                String(data.username ?? ''),
                String(data.password ?? '')
            );

            if (data.expected === 'success') {

                await loginPage.expectLoggedIn();
                await expect(page.locator('.title')).toHaveText('Products');

            } else if (data.expected === 'error') {

                await loginPage.expectLoginError(
                    String(data.expectedMessage)
                );

            } else {
                throw new Error(`Invalid expected value: ${data.expected}`);
            }

        });
    }

});
