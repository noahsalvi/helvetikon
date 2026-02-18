import { expect, test } from "@playwright/test";

test("seeded word detail page is reachable with seeded interpretation", async ({
  page,
}) => {
  await page.goto("/bern/Gruezi");

  await expect(page.getByRole("heading", { name: "Gruezi" })).toBeVisible();
  await expect(page.getByText("Typische Begruessig")).toBeVisible();
  await expect(page.getByText("Hörbeispiel hinzufügen")).toHaveCount(0);
});

test("seeded word is reported as unavailable", async ({ request }) => {
  const response = await request.get("/api/words/available/BERN/Gruezi");

  expect(response.status()).toBe(409);
});
