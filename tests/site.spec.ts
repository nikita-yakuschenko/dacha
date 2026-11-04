import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const widths = [320,360,375,390,430,768,1024,1440,1920];

test("Project popups fit required widths and keep landing URL", async ({ page }) => {
  test.setTimeout(180000);
  for (const width of widths) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator(".quick-projects")).toHaveCount(0);
    const trigger = page.locator(".project-card").nth(1).getByRole("button", { name: "Подробнее", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator(".project-title h2")).toHaveText("Дача 24");
    expect(new URL(page.url()).pathname).toBe("/");
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    if (width === 390 || width === 1440) await page.screenshot({ path: `.impeccable/review/project-popup-${width}.png` });
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

test("Correct model, popup navigation, persisted options and demo form", async ({ page }) => {
  await page.goto("/");
  for (let i = 0; i < 3; i++) {
    await page.locator(".project-card").nth(i).getByRole("button", { name: "Подробнее", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator(".project-title h2")).toHaveText(["Дача 20","Дача 24","Дача 30"][i]);
    await dialog.getByRole("button", { name: "Следующий проект" }).click();
    await expect(dialog.locator(".project-title h2")).toHaveText(["Дача 24","Дача 30","Дача 20"][i]);
    await dialog.getByRole("button", { name: "Закрыть проект" }).click();
  }
  await page.locator(".project-card").first().getByRole("button", { name: "Подробнее", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Дом с монтажом", exact: true }).click();
  await dialog.getByLabel("Рассчитать террасу отдельно").check();
  await dialog.getByLabel("Населённый пункт", { exact: true }).fill("Арзамас");
  await dialog.getByLabel("Telegram", { exact: true }).check();
  await dialog.getByLabel("Имя пользователя Telegram").fill("@dacha_test");
  await expect(dialog.getByRole("checkbox", { name: /Согласен на обработку/ })).not.toBeChecked();
  await dialog.getByRole("checkbox", { name: /Согласен на обработку/ }).check();
  await dialog.getByRole("button", { name: "Проверить форму", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("заявка не отправлена");
  const stored = await page.evaluate(() => JSON.stringify(localStorage));
  expect(stored).not.toContain("dacha_test"); expect(stored).not.toContain("Арзамас");
});

test("Popup keyboard tabs and WCAG AA", async ({ page }) => {
  await page.goto("/");
  await page.locator(".project-card").first().getByRole("button", { name: "Подробнее", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("tab", { name: "Характеристики", exact: true }).click();
  await expect(dialog.getByRole("tabpanel")).toContainText("Толщина стен");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("tab", { name: "Контур и размеры" })).toBeFocused();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
});
