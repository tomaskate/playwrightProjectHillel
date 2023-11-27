import { expect, Locator, Page } from "@playwright/test";

export class Assortment {
  readonly page: Page;
  readonly addCategoryBtn: Locator;
  readonly categoryNameField: Locator;
  readonly downloadImageButton: Locator;
  readonly saveBtn: Locator;
  readonly deleteBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addCategoryBtn = page.getByText("Додати категорію");
    this.categoryNameField = page.locator("#name");
    this.downloadImageButton = page.getByText("Завантажити зображення");
    this.saveBtn = page.getByText("Зберегти зміни");
    this.deleteBtn = page.getByRole("button").filter({ hasText: "delete" });
  }

  async clickOnAddBtn() {
    await this.addCategoryBtn.click();
  }

  async fillCategoryForm(name:string) {
    await this.categoryNameField.fill(name);
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.downloadImageButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles("image.jpg");
  }

  async saveCategory() {
    await this.saveBtn.click();
  }

  async selectCategory(name:string) {
    await this.page
      .locator(".collection-item")
      .filter({ hasText: name })
      .click();
    await this.page.waitForLoadState("networkidle");
  }
  async deleteSelectedCategory() {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.deleteBtn.click();
    //await page.waitForTimeout(5000);
    // await page.waitForLoadState("networkidle");
  }
}
