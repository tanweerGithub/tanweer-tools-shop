// Xray: TS-23 — Product Listing: default listing loads all products
// Story/Epic: TS-7 (Product Listing with category filter)
import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test('Product Listing: default listing loads all products', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await expect(home.productCards).toHaveCount(8);

  await expect(home.searchQuery).toHaveValue('');
  await expect(home.categoryCheckbox('All')).toBeChecked();
  await expect(home.sort).toContainText('Name (A-Z)');
});
