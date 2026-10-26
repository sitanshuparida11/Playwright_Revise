import { Locator, Page } from '@playwright/test';

export class CheckoutCompletePage {
    readonly page: Page;
    readonly confirmationMessage: Locator;
    readonly backToProductsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.confirmationMessage = page.getByRole('heading', { name: 'Thank you for your order!' });
        this.backToProductsButton = page.getByTestId('back-to-products');
    }

    async returnToProducts(): Promise<void> {
        await this.backToProductsButton.click();
    }
}
