import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { DashboardPage } from '../pages/DashboardPage';
import { loginAsStandardUser, products } from './testData';

test('completes a purchase, returns to products, and isolates order state', async ({ page, browser }) => {
    await loginAsStandardUser(page);
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.addProductToCart(products.backpack);
    await dashboardPage.openCart();
    await new CartPage(page).beginCheckout();

    const informationPage = new CheckoutInformationPage(page);
    await informationPage.enterCustomerInformation('Taylor', 'Tester', '12345');
    await informationPage.continueCheckout();
    await new CheckoutOverviewPage(page).finishCheckout();

    const completePage = new CheckoutCompletePage(page);
    await expect(completePage.confirmationMessage).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
    await completePage.returnToProducts();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(dashboardPage.pageHeading).toBeVisible();

    const freshContext = await browser.newContext({ baseURL: new URL('/', page.url()).toString() });
    try {
        const freshPage = await freshContext.newPage();
        await loginAsStandardUser(freshPage);
        await new DashboardPage(freshPage).openCart();

        await expect(new CartPage(freshPage).items).toHaveCount(0);
        await expect(freshPage.getByTestId('shopping-cart-badge')).toHaveCount(0);
    } finally {
        await freshContext.close();
    }
});
