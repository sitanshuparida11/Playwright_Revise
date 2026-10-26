//handle multiple browser contexts in a single browser instance

import {test , chromium} from '@playwright/test';

test('Browser Context', async () => {

  const browser=await chromium.launch();

  const context1=await browser.newContext();
  const context2=await browser.newContext();

  const page1=await context1.newPage();
  const page2=await context2.newPage();

  await page1.goto('https://www.google.com/');
  await page2.goto('https://www.facebook.com/');
  await context1.close();
  await context2.close();
  await browser.close();  

});