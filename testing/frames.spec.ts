import { test, expect } from '@playwright/test';

test('Interact with elements inside an iframe', async ({ page }) => {
  await page.goto('https://flipkart.com');

  // 1. Locate the iframe using a CSS selector
  const myFrame = page.frameLocator('iframe#payment-form');

  // 2. Interact with elements inside the iframe directly
  await myFrame.locator('#card-number').fill('4111 1111 1111 1111');
  await myFrame.getByRole('button', { name: 'Submit' }).click();

  // 3. Perform assertions inside the iframe
  await expect(myFrame.locator('.success-message')).toBeVisible();

  // 4. Simply continue on the main page (no manual switch back needed!)
  await page.locator('#main-page-logout').click();
});
