import type { Page, Locator } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  productCards: Locator = this.page.getByTestId('product-card');
  // data-test sits on the MUI TextField wrapper, not the rendered <input> — drill in.
  searchQuery: Locator = this.page.getByTestId('search-query').locator('input');
  sort: Locator = this.page.getByTestId('sort');
  priceSlider: Locator = this.page.getByTestId('price-slider');

  async goto() {
    await this.page.goto('/');
  }

  categoryCheckbox(category: string): Locator {
    const slug = category.toLowerCase().replace(/\s/g, '-');
    return this.page.getByTestId(`category-${slug}`);
  }
}
