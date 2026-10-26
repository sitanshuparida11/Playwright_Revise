import { Locator, Page } from '@playwright/test';

export class CheckoutInformationPage {
    readonly page: Page;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly postalCode: Locator;
    readonly errorMessage: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.getByTestId('firstName');
        this.lastName = page.getByTestId('lastName');
        this.postalCode = page.getByTestId('postalCode');
        this.errorMessage = page.getByTestId('error');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async enterCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
    }

    async continueCheckout(): Promise<void> {
        await this.continueButton.click();
    }

    async cancelCheckout(): Promise<void> {
        await this.cancelButton.click();
    }
}
