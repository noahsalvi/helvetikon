import { expect, test } from "@playwright/test";

test("unauthenticated users are redirected to login for protected add-word page", async ({
  page,
}) => {
  await page.goto("/wort-hinzufügen");

  await expect(page).toHaveURL(/\/auth\/anmelden$/);
  await expect(page.getByRole("heading", { name: "Willkommen Zurück 👋" })).toBeVisible();
});
