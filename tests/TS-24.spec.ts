// Xray: TS-24 — Product Listing: filter by single category
// Story/Epic: TS-7 (Product listing with category filter)
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test('Product Listing: filter by single category', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await home.selectCategory('Hand Tools');

  await expect(home.productCards).toHaveCount(4);
  await expect(home.cardByName('Combination Pliers')).toHaveCount(1);
  await expect(home.cardByName('Bolt Cutters')).toHaveCount(1);
  await expect(home.cardByName('Claw Hammer')).toHaveCount(1);
  await expect(home.cardByName('Slip Joint Pliers')).toHaveCount(1);

  await expect(home.cardByName('Thor Hammer')).toHaveCount(0);
  await expect(home.cardByName('Safety Goggles')).toHaveCount(0);
  await expect(home.cardByName('Sledgehammer')).toHaveCount(0);
  await expect(home.cardByName('Tape Measure')).toHaveCount(0);
});
