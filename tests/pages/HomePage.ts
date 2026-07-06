import type { Page, Locator } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  productCards: Locator = this.page.getByTestId('product-card');
  // data-test sits on the MUI TextField wrapper, not the rendered <input> — drill in.
  searchQuery: Locator = this.page.getByTestId('search-query').locator('input');
  sort: Locator = this.page.getByTestId('sort');
  priceSlider: Locator = this.page.getByTestId('price-slider');
  // No data-test on the empty state — matched by its literal copy.
  emptyState: Locator = this.page.getByText('No products found matching your filters.');

  async goto() {
    await this.page.goto('/');
  }

  categoryCheckbox(category: string): Locator {
    const slug = category.toLowerCase().replace(/\s/g, '-');
    return this.page.getByTestId(`category-${slug}`);
  }

  // product-price is repeated once per card (not id-suffixed), so scope to a single card.
  cardByName(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  priceOf(card: Locator): Locator {
    return card.getByTestId('product-price');
  }

  async search(query: string) {
    await this.searchQuery.fill(query);
  }

  async selectCategory(category: string) {
    await this.categoryCheckbox(category).click();
  }

  // MUI Slider's thumb wraps a visually-hidden native <input type="range"> — Home + N
  // ArrowRight presses (step is 1) lands on an exact value without pixel-based dragging.
  async setPriceSlider(value: number) {
    const thumb = this.priceSlider.locator('input[type="range"]');
    await thumb.focus();
    await this.page.keyboard.press('Home');
    for (let i = 0; i < value; i++) {
      await this.page.keyboard.press('ArrowRight');
    }
  }

  // MUI Select renders a custom listbox in a portal, not a native <select> — open then pick.
  async selectSort(label: string) {
    await this.sort.click();
    await this.page.getByRole('option', { name: label }).click();
  }
}
