import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { credentials, loginAsStandardUser, products } from './testData';

test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
});

test('shows all inventory products with names and prices', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await expect(dashboardPage.pageHeading).toBeVisible();
    await expect(dashboardPage.products).toHaveCount(6);
    await expect(dashboardPage.productNames).toHaveText([
        products.backpack,
        products.bikeLight,
        products.boltTShirt,
        products.fleeceJacket,
        products.onesie,
        products.redTShirt,
    ]);
    await expect(dashboardPage.productPrices).toHaveText([
        '$29.99',
        '$9.99',
        '$15.99',
        '$49.99',
        '$7.99',
        '$15.99',
    ]);
});

test('sorts products by name ascending', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const initialNames = await dashboardPage.productNames.allTextContents();
    const expectedNames = [...initialNames].sort((first, second) => first.localeCompare(second));

    await dashboardPage.sortProducts('az');

    await expect(dashboardPage.productNames).toHaveText(expectedNames);
});

test('sorts products by name descending', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const initialNames = await dashboardPage.productNames.allTextContents();
    const expectedNames = [...initialNames].sort((first, second) => second.localeCompare(first));

    await dashboardPage.sortProducts('za');

    await expect(dashboardPage.productNames).toHaveText(expectedNames);
});

test('sorts products by price from low to high', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const initialPrices = (await dashboardPage.productPrices.allTextContents())
        .map((price) => Number(price.replace('$', '')))
        .sort((first, second) => first - second);

    await dashboardPage.sortProducts('lohi');

    const displayedPrices = (await dashboardPage.productPrices.allTextContents())
        .map((price) => Number(price.replace('$', '')));
    expect(displayedPrices).toEqual(initialPrices);
});

test('sorts products by price from high to low', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const initialPrices = (await dashboardPage.productPrices.allTextContents())
        .map((price) => Number(price.replace('$', '')))
        .sort((first, second) => second - first);

    await dashboardPage.sortProducts('hilo');

    const displayedPrices = (await dashboardPage.productPrices.allTextContents())
        .map((price) => Number(price.replace('$', '')));
    expect(displayedPrices).toEqual(initialPrices);
});

test('adds and removes a product from inventory with the cart badge updated', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const badge = page.getByTestId('shopping-cart-badge');
    const backpackCard = page.getByTestId('inventory-item').filter({ hasText: products.backpack });

    await dashboardPage.addProductToCart(products.backpack);
    await expect(badge).toHaveText('1');
    await expect(backpackCard.getByRole('button', { name: 'Remove' })).toBeVisible();

    await dashboardPage.removeProductFromInventory(products.backpack);
    await expect(badge).toHaveCount(0);
    await expect(backpackCard.getByRole('button', { name: 'Add to cart' })).toBeVisible();
});

test('removes one of several inventory products and retains the others', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const badge = page.getByTestId('shopping-cart-badge');

    await dashboardPage.addProductToCart(products.backpack);
    await dashboardPage.addProductToCart(products.bikeLight);
    await dashboardPage.addProductToCart(products.onesie);
    await dashboardPage.removeProductFromInventory(products.bikeLight);

    await expect(badge).toHaveText('2');
    await dashboardPage.openCart();
    await expect(page.getByTestId('inventory-item-name')).toHaveText([products.backpack, products.onesie]);
});

test('opens product details and returns to inventory', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.openProductDetails(products.backpack);
    await expect(dashboardPage.productDetailName).toHaveText(products.backpack);
    await expect(dashboardPage.productDetailPrice).toHaveText('$29.99');
    await dashboardPage.backToProductsButton.click();

    await expect(dashboardPage.pageHeading).toBeVisible();
    await expect(dashboardPage.products).toHaveCount(6);
});

test('logs out through the application menu', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.logout();

    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(new LoginPage(page).loginButton).toBeVisible();
});

test('retains cart contents when the inventory page is refreshed', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.addProductToCart(products.backpack);
    await page.reload();

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    await dashboardPage.openCart();
    await expect(page.getByTestId('inventory-item-name')).toHaveText([products.backpack]);
});

test('blocks direct inventory access without authentication', async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
    await page.goto('/inventory.html');

    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByTestId('error')).toHaveText(
        "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
});

test('supports browser back and forward navigation between product and inventory', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.openProductDetails(products.backpack);
    await expect(dashboardPage.productDetailName).toHaveText(products.backpack);
    await page.goBack();
    await expect(dashboardPage.pageHeading).toBeVisible();
    await page.goForward();
    await expect(dashboardPage.productDetailName).toHaveText(products.backpack);
});

test('allows repeated add and remove actions for the same product', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const badge = page.getByTestId('shopping-cart-badge');

    await dashboardPage.addProductToCart(products.backpack);
    await dashboardPage.removeProductFromInventory(products.backpack);
    await expect(badge).toHaveCount(0);
    await dashboardPage.addProductToCart(products.backpack);
    await expect(badge).toHaveText('1');
    await dashboardPage.removeProductFromInventory(products.backpack);
    await expect(badge).toHaveCount(0);
});

test('supports the performance glitch user login without fixed waits', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication('performance_glitch_user', credentials.password);

    await expect(loginPage.homePageHeader).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
});
