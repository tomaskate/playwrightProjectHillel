import { expect, Locator, Page } from "@playwright/test";

export class History {
  readonly page: Page;
  readonly filterIcon: Locator;
  readonly orderNumberField: Locator;
  readonly submitButton: Locator;
  readonly firstTableRow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filterIcon = page.getByRole("button", { name: "filter_list" });
    this.orderNumberField = page.locator("#number"); /// getByText('Номер замовлення')
    this.submitButton = page.locator("button:has-text('Применить фильтр')");
    this.firstTableRow = page.locator("tbody > tr > :nth-child(1)");
    }
    
    async clickOnFilterIcon() {
        await this.filterIcon.click();
        await this.page.waitForLoadState("networkidle");
    }
    
    async enterOrderNumber(order) {
        await this.orderNumberField.fill(order);
    }

    async applyFilter() {
        await this.submitButton.click();
    }

    async assertCorrectOrderInTable(value) {
        await expect(this.firstTableRow).toHaveText(value);
    }
}
