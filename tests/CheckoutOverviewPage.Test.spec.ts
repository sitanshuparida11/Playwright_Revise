import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { DashboardPage } from '../pages/DashboardPage';
import { loginAsStandardUser, products } from './testData';

async function openOverview(page: import('@playwright/test').Page, names: string[]): Promise<void> {
    await loginAsStandardUser(page);
    const dashboardPage = new DashboardPage(page);
    for (const name of names) {
        await dashboardPage.addProductToCart(name);
    }
    await dashboardPage.openCart();
    await new CartPage(page).beginCheckout();
    const informationPage = new CheckoutInformationPage(page);
    await informationPage.enterCustomerInformation('Taylor', 'Tester', '12345');
    await informationPage.continueCheckout();
}

test('shows the selected product name, price, and quantity on overview', async ({ page }) => {
    const overviewPage = new CheckoutOverviewPage(page);
    await openOverview(page, [products.backpack]);

    await expect(overviewPage.itemNames).toHaveText([products.backpack]);
    await expect(overviewPage.itemPrices).toHaveText(['$29.99']);
    await expect(overviewPage.itemQuantities).toHaveText(['1']);
});

test('calculates the item subtotal and total including tax', async ({ page }) => {
    const overviewPage = new CheckoutOverviewPage(page);
    await openOverview(page, [products.backpack, products.bikeLight]);

    await expect(overviewPage.itemNames).toHaveText([products.backpack, products.bikeLight]);
    const subtotal = Number((await overviewPage.itemSubtotal.innerText()).replace(/[^\d.]/g, ''));
    const tax = Number((await overviewPage.tax.innerText()).replace(/[^\d.]/g, ''));
    const total = Number((await overviewPage.total.innerText()).replace(/[^\d.]/g, ''));
    const displayedItemPrices = (await overviewPage.itemPrices.allTextContents())
        .map((price) => Number(price.replace('$', '')));

    expect(subtotal).toBeCloseTo(displayedItemPrices.reduce((sum, price) => sum + price, 0), 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
});

test('cancels overview and returns to inventory', async ({ page }) => {
    const overviewPage = new CheckoutOverviewPage(page);
    await openOverview(page, [products.backpack]);

    await overviewPage.cancelCheckout();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(new DashboardPage(page).pageHeading).toBeVisible();
});
