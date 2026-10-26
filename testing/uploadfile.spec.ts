import { test, expect } from '@playwright/test';

test('Upload a file using Playwright', async ({ page }) => {
  // Navigate to the page with the file upload form
  await page.goto('https://bakkappan.github.io/Testers-Talk-Practice-Site/');
  await page.getByPlaceholder('username').fill('TestersTalk');
  await page.getByPlaceholder('password').fill('TestersTalk');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Welcome to Testers Talk!')).toBeVisible();
  await page.locator('#fileInput').setInputFiles('E:/Resume/Atul Deotale Testing.pdf');
  await expect(page.getByText('Selected: Atul Deotale Testing.pdf')).toBeVisible();
});