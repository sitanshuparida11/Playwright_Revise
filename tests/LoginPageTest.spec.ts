import {test ,expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const username = 'standard_user';
const password = 'secret_sauce';
const incorrectPassword = 'incorrect_password';


test('Login Page Test', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication(username, password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(loginPage.homePageHeader).toBeVisible();
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);

})

test('InvalidLogin Page Test', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication(username, incorrectPassword);
    await expect(loginPage.errMsg).toHaveText('Epic sadface: Username and password do not match any user in this service');
    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.homePageHeader).toHaveCount(0);

})

test('Rejects an invalid username', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication('invalid_user', password);

    await expect(loginPage.errMsg).toHaveText('Epic sadface: Username and password do not match any user in this service');
    await expect(loginPage.homePageHeader).toHaveCount(0);
});

test('Rejects invalid username and password together', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication('invalid_user', incorrectPassword);

    await expect(loginPage.errMsg).toHaveText('Epic sadface: Username and password do not match any user in this service');
    await expect(loginPage.homePageHeader).toHaveCount(0);
});

test('Requires a username when the username field is empty', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication('', password);

    await expect(loginPage.errMsg).toHaveText('Epic sadface: Username is required');
});

test('Requires a password when the password field is empty', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication(username, '');

    await expect(loginPage.errMsg).toHaveText('Epic sadface: Password is required');
});

test('Requires a username when both login fields are empty', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication('', '');

    await expect(loginPage.errMsg).toHaveText('Epic sadface: Username is required');
});

test('Rejects a locked-out user', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.launchUrl('/');
    await loginPage.loginIntoApplication('locked_out_user', password);

    await expect(loginPage.errMsg).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(loginPage.homePageHeader).toHaveCount(0);
});

test('Recovers from a rejected login after dismissing the error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.launchUrl('/');
    await expect(loginPage.loginButton).toBeVisible();

    await loginPage.loginIntoApplication('invalid_user', incorrectPassword);
    await expect(loginPage.errMsg).toHaveText(
        'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).toHaveURL(/\/$/);
    await expect(loginPage.homePageHeader).toHaveCount(0);

    await page.getByRole('button', { name: 'Dismiss error' }).click();
    await expect(loginPage.errMsg).toBeHidden();

    await loginPage.loginIntoApplication(username, password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(loginPage.homePageHeader).toBeVisible();
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
});