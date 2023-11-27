import { test, expect, Page } from "@playwright/test";
import { ApiHelper } from "../helpers/apiHelper";
import { DbHelper } from "../helpers/dbHelper";

let token: string;
let page: Page;
let categoryId: string;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  token = await ApiHelper.getToken({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  });
});

test.beforeEach(async () => {
  page.addInitScript((value) => {
    window.localStorage.setItem("auth-token", value);
  }, token);
  await page.goto("/overview");
  await page.context().storageState({ path: "auth.json" });
});

test("Create category with positions", async () => {
  const categoriesMenuItem = page
    .getByRole("listitem")
    .filter({ hasText: "Асортимент" });
  const categoriesListElements = page
    .locator("app-categories-page")
    .getByRole("link");
  const addCategoryBtn = page.getByText("Додати категорію");//pom
  const categoryName = page.locator("#name");//pom
  await categoriesMenuItem.click();
  await page.waitForLoadState("networkidle", { timeout: 7000 });
  const allCategoryNames = await categoriesListElements.allTextContents();
  const allCategoryNamesTrimmed = allCategoryNames.map((el) => el.trim());
  const categories = await ApiHelper.getCategories(token);
  const categoryNamesFromApi = categories.map((el: any) => el.name);
  expect(allCategoryNamesTrimmed).toEqual(categoryNamesFromApi);
  await addCategoryBtn.click();
  await categoryName.fill("Ket Test category");
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByText("Завантажити зображення").click();//pom
  const fileChooser = await fileChooserPromise;
  //expect(fileChooser.isMultiple()).toBeFalsy;
  await fileChooser.setFiles("image.jpg");
  // Interception
  const responsePromise = page.waitForResponse("/api/category");
  await page.getByText("Зберегти зміни").click();//pom
  const response = await responsePromise;
  const parsed = await response.json();
  categoryId = parsed._id;
});
