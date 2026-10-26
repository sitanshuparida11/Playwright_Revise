import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { DashboardPage } from '../pages/DashboardPage';
import { loginAsStandardUser, products } from './testData';

test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.addProductToCart(products.backpack);
    await dashboardPage.openCart();
    await new CartPage(page).beginCheckout();
});

test('continues checkout with valid customer information', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);

    await informationPage.enterCustomerInformation('Taylor', 'Tester', '12345');
    await informationPage.continueCheckout();

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.getByText('Checkout: Overview')).toBeVisible();
});

test('requires the first name when all checkout information is empty', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);

    await informationPage.continueCheckout();

    await expect(informationPage.errorMessage).toHaveText('Error: First Name is required');
});

test('requires the first name when it is empty', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);
    await informationPage.enterCustomerInformation('', 'Tester', '12345');

    await informationPage.continueCheckout();

    await expect(informationPage.errorMessage).toHaveText('Error: First Name is required');
});

test('requires the last name when it is empty', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);
    await informationPage.enterCustomerInformation('Taylor', '', '12345');

    await informationPage.continueCheckout();

    await expect(informationPage.errorMessage).toHaveText('Error: Last Name is required');
});

test('requires a postal code when it is empty', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);
    await informationPage.enterCustomerInformation('Taylor', 'Tester', '');

    await informationPage.continueCheckout();

    await expect(informationPage.errorMessage).toHaveText('Error: Postal Code is required');
});

test('cancels checkout information and returns to the cart', async ({ page }) => {
    const informationPage = new CheckoutInformationPage(page);

    await informationPage.cancelCheckout();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(new CartPage(page).pageHeading).toBeVisible();
});
