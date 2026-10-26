import { Locator, Page } from '@playwright/test';

export class CheckoutOverviewPage {
    readonly page: Page;
    readonly items: Locator;
    readonly itemNames: Locator;
    readonly itemPrices: Locator;
    readonly itemQuantities: Locator;
    readonly itemSubtotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.items = page.locator('.cart_item');
        this.itemNames = page.getByTestId('inventory-item-name');
        this.itemPrices = page.getByTestId('inventory-item-price');
        this.itemQuantities = page.getByTestId('item-quantity');
        this.itemSubtotal = page.getByTestId('subtotal-label');
        this.tax = page.getByTestId('tax-label');
        this.total = page.getByTestId('total-label');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }

    async cancelCheckout(): Promise<void> {
        await this.cancelButton.click();
    }
}
