import { Locator, Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly pageHeading: Locator;
    readonly items: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;
    readonly itemQuantities: Locator;
    readonly cartBadge: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.pageHeading = page.getByText('Your Cart', { exact: true });
        this.items = page.locator('.cart_item');
        this.itemNames = page.getByTestId('inventory-item-name');
        this.itemPrices = page.getByTestId('inventory-item-price');
        this.itemQuantities = page.getByTestId('item-quantity');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }

    async removeProduct(name: string): Promise<void> {
        await this.items.filter({ hasText: name }).getByRole('button', { name: 'Remove' }).click();
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async beginCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }
}
