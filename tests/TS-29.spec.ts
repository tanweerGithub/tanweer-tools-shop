// Xray: TS-29 — Product Listing: sort by price ascending
// Story/Epic: TS-7 (Product listing with category filter)
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test('Product Listing: sort by price ascending', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await home.selectSort('Price (Low - High)');

  await expect(home.productCards).toHaveCount(8);

  const firstThree = ['Safety Goggles', 'Tape Measure', 'Slip Joint Pliers'];
  const expectedPrices = ['$5.50', '$8.25', '$9.17'];

  for (let i = 0; i < firstThree.length; i++) {
    const card = home.productCards.nth(i);
    await expect(card).toContainText(firstThree[i]);
    await expect(home.priceOf(card)).toHaveText(expectedPrices[i]);
  }
});
