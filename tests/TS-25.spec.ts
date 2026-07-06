// Xray: TS-25 — Product Listing: filter by category with no matches
// Story/Epic: TS-7 (Product listing with category filter)
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test('Product Listing: filter by category with no matches', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await home.selectCategory('Novelty');

  await expect(home.productCards).toHaveCount(1);
  await expect(home.cardByName('Thor Hammer')).toHaveCount(1);

  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await home.setPriceSlider(50);

  await expect(home.productCards).toHaveCount(0);
  await expect(home.emptyState).toBeVisible();
  expect(errors).toEqual([]);
});
