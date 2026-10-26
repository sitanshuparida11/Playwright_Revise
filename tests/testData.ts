import { expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export const credentials = {
    standardUser: 'standard_user',
    password: 'secret_sauce',
};

export const products = {
    backpack: 'Sauce Labs Backpack',
    bikeLight: 'Sauce Labs Bike Light',
    boltTShirt: 'Sauce Labs Bolt T-Shirt',
    fleeceJacket: 'Sauce Labs Fleece Jacket',
    onesie: 'Sauce Labs Onesie',
    redTShirt: 'Test.allTheThings() T-Shirt (Red)',
};

export async function loginAsStandardUser(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication(credentials.standardUser, credentials.password);
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
}
