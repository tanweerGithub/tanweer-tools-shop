// Xray: TS-27 — Product Listing: search by partial keyword
// Story/Epic: TS-7 (Product listing with category filter)
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test('Product Listing: search by partial keyword', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await home.search('Hammer');

  // Substring match on product name — "Sledgehammer" legitimately contains "hammer" too,
  // so the real catalog returns 3 matches. The Xray case text (TS-27) only lists 2; see
  // the flag raised alongside this automation run.
  await expect(home.productCards).toHaveCount(3);
  await expect(home.cardByName('Claw Hammer')).toHaveCount(1);
  await expect(home.cardByName('Sledgehammer')).toHaveCount(1);
  await expect(home.cardByName('Thor Hammer')).toHaveCount(1);
});
