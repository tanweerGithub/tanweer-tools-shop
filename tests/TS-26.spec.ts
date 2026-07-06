// Xray: TS-26 — Product Listing: search by exact product name
// Story/Epic: TS-7 (Product listing with category filter)
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test('Product Listing: search by exact product name', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await home.search('Claw Hammer');

  await expect(home.productCards).toHaveCount(1);
  await expect(home.cardByName('Claw Hammer')).toHaveCount(1);
});
