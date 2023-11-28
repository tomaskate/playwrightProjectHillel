import { test, expect, Page } from "@playwright/test";
import { ApiHelper } from "../helpers/apiHelper";
import { NavigationMenu } from "../pom/components/navigationMenu";
import { Assortment } from "../pom/assortment";
import { OrderCreation } from "../pom/orderCreation";
import { History } from "../pom/history";
import { faker } from "@faker-js/faker";

test.describe("Categories tests", () => {
  let token: string;
  let categoryId: string;
  let orderNumber: string;
  const categoryName = faker.lorem.word();
  const numberPositions = faker.number.int({ min: 2, max: 4 });

  test.beforeAll(async () => {
    token = await ApiHelper.getToken({
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    });
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript((value) => {
      window.localStorage.setItem("auth-token", value);
    }, token);
    await page.goto("/overview");
    await page.context().storageState({ path: "auth.json" });
  });

  test("Create a category", async ({ page }) => {
    let navigationMenu = new NavigationMenu(page);
    let assortment = new Assortment(page);
    await navigationMenu.navigate("Асортимент");
    await page.waitForLoadState("networkidle");
    await assortment.clickOnAddBtn();
    await assortment.fillCategoryForm(categoryName);
    const responsePromise = page.waitForResponse("/api/category");
    await assortment.saveCategory();
    await assortment.assertPresenceOfAddPositionBtn();
    const response = await responsePromise;
    const parsed = await response.json();
    categoryId = parsed._id;
    //console.log(categoryId);
  });

  test("Add positions", async () => {
    for (let i = 0; i < numberPositions; i++) {
      const positionName = faker.lorem.word();
      const costNumber = faker.number.int({ max: 100 });
      await ApiHelper.createPosition(
        token,
        positionName,
        costNumber,
        categoryId
      );
    }
  });

  test("Create order", async ({ page }) => {
    let navigationMenu = new NavigationMenu(page);
    let orderCreation = new OrderCreation(page);
    await navigationMenu.navigate("Додати замовлення");
    await orderCreation.selectCategory(categoryName);
    await orderCreation.fill(numberPositions);
    await orderCreation.finishOrdering();
    await orderCreation.submitOrder();
    const orderResponsePromise = page.waitForResponse("/api/order");
    const orderResponse = await orderResponsePromise;
    const parsedOrder = await orderResponse.json();
    orderNumber = parsedOrder.order.toString();
  });

  test("Filter the order", async ({ page }) => {
    let navigationMenu = new NavigationMenu(page);
    let history = new History(page);
    await navigationMenu.navigate("Історія");
    await history.clickOnFilterIcon();
    await history.enterOrderNumber(orderNumber);
    await page.pause();
    await history.applyFilter();
    await history.assertCorrectOrderInTable(orderNumber);
  });

  test("Delete category and validate in DB", async ({ page }) => {
    let navigationMenu = new NavigationMenu(page);
    let assortment = new Assortment(page);
    await navigationMenu.navigate("Асортимент");
    await assortment.selectCategory(categoryName);
    await assortment.deleteSelectedCategory();
    await assortment.assertAbsenceByName(categoryName);
  });
});
