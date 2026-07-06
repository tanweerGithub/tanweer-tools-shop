// Xray: TS-30 — Product Listing: combined category filter + search intersection
// Story/Epic: TS-7 (Product listing with category filter)
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test('Product Listing: combined category filter + search intersection', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await home.selectCategory('Hand Tools');
  await home.search('Pliers');

  await expect(home.productCards).toHaveCount(2);
  await expect(home.cardByName('Combination Pliers')).toHaveCount(1);
  await expect(home.cardByName('Slip Joint Pliers')).toHaveCount(1);

  await expect(home.cardByName('Bolt Cutters')).toHaveCount(0);
  await expect(home.cardByName('Claw Hammer')).toHaveCount(0);
});
