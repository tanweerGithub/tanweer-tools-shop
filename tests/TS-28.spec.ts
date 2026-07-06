// Xray: TS-28 — Product Listing: search with no results
// Story/Epic: TS-7 (Product listing with category filter)
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test('Product Listing: search with no results', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await home.search('Cordless Drill');

  await expect(home.productCards).toHaveCount(0);
  await expect(home.emptyState).toBeVisible();
  expect(errors).toEqual([]);
});
