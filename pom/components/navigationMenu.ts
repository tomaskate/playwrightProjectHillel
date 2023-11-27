import { Page, Locator } from "@playwright/test";

export class NavigationMenu {
  readonly page: Page;
  readonly categoriesMenuItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.categoriesMenuItems = page.getByRole("listitem");
  }

  async navigate(
    menuNames:"Огляд"
      | "Аналітика"
      | "Історія"
      | "Додати замовлення"
      | "Асортимент"
  ) {
    const menuItem = this.categoriesMenuItems.filter({
      hasText: `${menuNames}`,
    });
    await menuItem.click();
    //await this.page.waitForLoadState("networkidle");
  }
}
