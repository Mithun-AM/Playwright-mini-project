# SauceDemo Playwright Mini Project

A UI automation testing project for [SauceDemo](https://www.saucedemo.com/) using Playwright with TypeScript, Page Object Model (POM), and Excel-based Data-Driven Testing (DDT).

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Page Object Model (POM)
- Excel (`xlsx`) for test data

## Features

- Login and Logout testing
- Add and Remove products from cart
- Cart validation
- Checkout process validation
- Excel-based Data-Driven Testing
- Reusable Page Object Model structure

## Project Structure

```text
SauceDemo/
│
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
│
├── tests/
│   ├── login.spec.ts
│   ├── logout.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
│
├── test-data/
│   └── SauceDemo.xlsx
│
├── utils/
│   └── excelReader.ts
│
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Test Data

Test data is maintained in `test-data/SauceDemo.xlsx`.

The workbook contains four worksheets:

- **Login** – Login scenarios and credentials
- **Logout** – Logout scenarios
- **Cart** – Product addition, removal, and cart validation
- **Checkout** – Customer information and checkout scenarios

The `run` column in Excel controls whether a test case should execute or be skipped.

## Application Under Test

Website: https://www.saucedemo.com/

Test credentials:

- Username: `standard_user`
- Password: `secret_sauce`
