import { expect, Locator, Page } from "@playwright/test";
import { Assortment } from "./assortment";

export class OrderCreation {
  readonly assortment: Assortment;
  readonly page: Page;
    readonly categoryItems: Locator;
    readonly amount: Locator;
    readonly addBtn: Locator;
    readonly finishBtn: Locator;
    readonly submitBtn: Locator;


  constructor(page: Page) {
    this.page = page;
      this.assortment = new Assortment(page);
      this.categoryItems = page
          .locator(".m0");
      this.amount = page.locator("input[type='number']");
      this.addBtn = page.locator("button").filter({ hasText: "Додати" });
      this.finishBtn = page.locator("button").filter({ hasText: "Завершити" });
      this.submitBtn = page.getByText("Підтвердити");
    }
    
    async selectCategory(name:string) {
        const categoryItem = this.categoryItems.filter({ hasText: `${name}` })
        await categoryItem.click();
    }

    async fill(number:number) {
      for (let i = 0; i < number; i++) {
        const randomNumber = Math.round(Math.random() * 100);
        await this.amount.nth(i).clear();
        await this.amount.nth(i).fill(String(randomNumber));
        await this.addBtn.nth(i).click();
        }
    }

    async finishOrdering() {
        await this.finishBtn.click();
    }

    async submitOrder() {
        await this.submitBtn.click();
    }

 
  }
