import { expect, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { DashboardPage } from '../pages/DashboardPage';
import { loginAsStandardUser, products } from './testData';

test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
});

test('shows an empty cart without a badge', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);

    await dashboardPage.openCart();

    await expect(cartPage.pageHeading).toBeVisible();
    await expect(cartPage.items).toHaveCount(0);
    await expect(cartPage.cartBadge).toHaveCount(0);

    await cartPage.beginCheckout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await expect(page.getByText('Checkout: Your Information')).toBeVisible();
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
});

test('shows the selected product name, price, quantity, and cart badge', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);

    await dashboardPage.addProductToCart(products.backpack);
    await dashboardPage.openCart();

    await expect(cartPage.itemNames).toHaveText([products.backpack]);
    await expect(cartPage.itemPrices).toHaveText(['$29.99']);
    await expect(cartPage.itemQuantities).toHaveText(['1']);
    await expect(cartPage.cartBadge).toHaveText('1');
});

test('shows multiple products and can remove one while keeping the others', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);

    await dashboardPage.addProductToCart(products.backpack);
    await dashboardPage.addProductToCart(products.bikeLight);
    await dashboardPage.addProductToCart(products.onesie);
    await dashboardPage.openCart();
    await cartPage.removeProduct(products.bikeLight);

    await expect(cartPage.itemNames).toHaveText([products.backpack, products.onesie]);
    await expect(cartPage.itemPrices).toHaveText(['$29.99', '$7.99']);
    await expect(cartPage.itemQuantities).toHaveText(['1', '1']);
    await expect(cartPage.cartBadge).toHaveText('2');
});

test('removes the last item and hides the empty cart badge', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);

    await dashboardPage.addProductToCart(products.backpack);
    await dashboardPage.openCart();
    await cartPage.removeProduct(products.backpack);

    await expect(cartPage.items).toHaveCount(0);
    await expect(cartPage.cartBadge).toHaveCount(0);
});

test('continues shopping from the cart to the inventory', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);

    await dashboardPage.openCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(dashboardPage.pageHeading).toBeVisible();
    await expect(dashboardPage.products).toHaveCount(6);
});

test('adds every available product to the cart', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const cartPage = new CartPage(page);
    const productNames = await dashboardPage.productNames.allTextContents();

    for (const name of productNames) {
        await dashboardPage.addProductToCart(name);
    }
    await dashboardPage.openCart();

    await expect(cartPage.items).toHaveCount(6);
    await expect(cartPage.cartBadge).toHaveText('6');
    await expect(cartPage.itemNames).toHaveText(productNames);
});
