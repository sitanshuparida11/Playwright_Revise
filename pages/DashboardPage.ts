import { Locator, Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly pageHeading: Locator;
    readonly products: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly sortControl: Locator;
    readonly cartLink: Locator;
    readonly menuButton: Locator;
    readonly logoutButton: Locator;
    readonly productDetailName: Locator;
    readonly productDetailPrice: Locator;
    readonly backToProductsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeading = page.getByText('Products', { exact: true });
        this.products = page.getByTestId('inventory-item');
        this.productNames = page.getByTestId('inventory-item-name');
        this.productPrices = page.getByTestId('inventory-item-price');
        this.sortControl = page.getByRole('combobox', { name: 'Sort products' });
        this.cartLink = page.getByTestId('shopping-cart-link');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.productDetailName = page.getByTestId('inventory-item-name');
        this.productDetailPrice = page.getByTestId('inventory-item-price');
        this.backToProductsButton = page.getByTestId('back-to-products');
    }

    async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
        await this.sortControl.selectOption(option);
    }

    async addProductToCart(name: string): Promise<void> {
        await this.productCard(name).getByRole('button', { name: 'Add to cart' }).click();
    }

    async removeProductFromInventory(name: string): Promise<void> {
        await this.productCard(name).getByRole('button', { name: 'Remove' }).click();
    }

    async openProductDetails(name: string): Promise<void> {
        await this.page.getByRole('button', { name: `View details for ${name}` }).first().click();
    }

    async openCart(): Promise<void> {
        await this.cartLink.click();
    }

    async openMenu(): Promise<void> {
        await this.menuButton.click();
    }

    async logout(): Promise<void> {
        await this.openMenu();
        await this.logoutButton.click();
    }

    private productCard(name: string): Locator {
        return this.products.filter({ hasText: name });
    }
}
