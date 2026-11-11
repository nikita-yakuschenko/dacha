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
    await expect(page.locator(".project-grid > li")).toHaveCount(12);
    const trigger = page.getByRole("button", { name: /^Просто дача\s24$/ });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator(".project-title h2")).toHaveText(/^Просто дача\s24$/);
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
  for (const name of ["Просто дача\u00a010", "Просто дача\u00a024", "Просто дача\u00a050"]) {
    await page.getByRole("button", { name, exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.locator(".project-title h2")).toHaveText(name);
    await expect(dialog.getByRole("button", { name: "Следующий проект" })).toHaveCount(0);
    await dialog.getByRole("button", { name: "Закрыть проект" }).click();
  }
  await page.getByRole("button", { name: /^Просто дача\s24$/ }).click();
  await expect(page.getByRole("dialog").locator(".project-title h2")).toHaveText(/^Просто дача\s24$/);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /^20–25 м²/ }).click();
  await expect(page.locator(".project-grid > li")).toHaveCount(2);
  await page.getByRole("button", { name: /^Просто дача\s24$/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("switch", { name: /Добавить сборку/ }).check();
  await expect(dialog.locator('.lead-receipt li[data-on="true"]')).toHaveText([/^Домокомплект/, /^Сборка/]);
  await dialog.getByLabel("Имя", { exact: true }).fill("Тестер");
  await dialog.getByRole("button", { name: "Получить расчёт", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Нужно 10 цифр");
  await dialog.getByLabel("Телефон", { exact: true }).fill("89991234567");
  await expect(dialog.getByLabel("Телефон", { exact: true })).toHaveValue("+7 (999) 123-45-67");
  await dialog.getByRole("checkbox", { name: /Соглашаюсь/ }).check();
  await page.route("**/api/lead", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ accepted: true, id: "1" }) }));
  await dialog.getByRole("button", { name: "Получить расчёт", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("Спасибо, Тестер");
  const stored = await page.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([key]) => !key.startsWith("_ym")))));
  expect(stored).not.toContain("Тестер"); expect(stored).not.toContain("999");
});

test("Popup addon switches by keyboard and WCAG AA", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: /^Просто дача\s10$/ }).click();
  const dialog = page.getByRole("dialog");
  const assembly = dialog.getByRole("switch", { name: /Добавить сборку/ });
  await expect(assembly).not.toBeChecked();
  const kitPrice = await dialog.locator(".lead-price").textContent();
  await assembly.focus();
  await page.keyboard.press("Space");
  await expect(assembly).toBeChecked();
  await expect(dialog.locator(".lead-price")).not.toHaveText(kitPrice!);
  await expect(dialog.locator(".lead-price")).toHaveText(/^[\d\s]+$/);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
});

test("Calculate buttons open lead dialog in place", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#calculation input")).toHaveCount(3);
  const trigger = page.locator(".site-header").getByRole("button", { name: "Получить расчёт" });
  const scrollBefore = await page.evaluate(() => scrollY);
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Заявка на расчёт" });
  await expect(dialog).toBeFocused();
  await expect(dialog.locator("input")).toHaveCount(3);
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  expect((await new AxeBuilder({ page }).include(".lead-dialog").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  const heightBefore = await dialog.evaluate(el => el.getBoundingClientRect().height);
  await dialog.getByRole("button", { name: "Получить расчёт", exact: true }).click();
  await expect(dialog.getByRole("alert")).toHaveText(["Укажите имя", /^Нужно 10\s?цифр/]);
  expect(await dialog.evaluate(el => el.getBoundingClientRect().height)).toBe(heightBefore);
  await dialog.getByLabel("Имя", { exact: true }).fill("Тестер");
  await dialog.getByLabel("Телефон", { exact: true }).fill("9991234567");
  await dialog.getByRole("checkbox", { name: /Соглашаюсь/ }).check();
  await page.route("**/api/lead", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ accepted: true, id: "1" }) }));
  await dialog.getByRole("button", { name: "Получить расчёт", exact: true }).click();
  await expect(dialog.getByRole("status")).toContainText("Спасибо");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("Section navigation scrolls via JS without hash links", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href*="#"]')).toHaveCount(0);
  await page.locator(".site-header nav").getByRole("button", { name: "Комплектация" }).click();
  await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById("specification")!.getBoundingClientRect().top) < 140)).toBe(true);
  expect(page.url()).not.toContain("#");
  await page.goto("/contacts");
  await expect(page.locator('a[href*="#"]')).toHaveCount(0);
  await page.locator(".site-header nav").getByRole("button", { name: "Проекты" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById("projects")?.getBoundingClientRect().top ?? 9999) < 140)).toBe(true);
});
