import { closeE2EFixtures, expect, seededOwnerUser, test } from "./fixtures";

test.describe("Critical user journeys", () => {
  test.describe.configure({ mode: "serial" });

  test.afterAll(async () => {
    await closeE2EFixtures();
  });

  test("register -> verify -> login and owner happy-path journeys", async ({
    page,
    e2e,
  }) => {
    const user = e2e.uniqueUser("journey");

    await e2e.submitRegistration(page, user);
    await e2e.verifyUserInBrowser(page, user.email);
    await expect(page.getByRole("button", { name: "Abmelden" })).toBeVisible();

    await e2e.logoutViaUi(page);
    await e2e.loginViaUi(page, user.email, user.password);

    const word = `Wort${Date.now().toString().slice(-6)}`;
    const wordPath = `/bern/${word}`;
    await e2e.addWordViaUi(page, {
      swissGerman: word,
      german: "Brot",
    });
    await expect(page).toHaveURL(new RegExp(`${wordPath}$`));

    const wordId = await e2e.findWordIdBySwissGerman(word);
    const explanation = `Erklaerung ${Date.now().toString().slice(-6)}`;
    await e2e.addInterpretationViaUi(page, wordId, wordPath, {
      explanation,
      example: "Das isch es Bispiel.",
    });
    const interpretationId = await e2e.findInterpretationIdByMeaning(explanation);

    await page.goto(wordPath);
    await expect(page.getByText(explanation)).toBeVisible();
    const updatedExplanation = `${explanation} owner-edit`;
    const ownerUpdate = await page.request.put(
      `/api/interpretations/${interpretationId}`,
      {
        data: [{ explanation: updatedExplanation, examples: ["Das isch es Bispiel."] }],
      }
    );
    expect(ownerUpdate.status()).toBe(200);

    await page.goto(wordPath);
    await expect(page.getByText(updatedExplanation)).toBeVisible();
  });

  test("non-owner interpretation edit is blocked and logout redirects protected route", async ({
    page,
    request,
    e2e,
  }) => {
    await e2e.loginViaUi(page, seededOwnerUser.email, seededOwnerUser.password);

    const word = `Perm${Date.now().toString().slice(-6)}`;
    const wordPath = `/bern/${word}`;
    await e2e.addWordViaUi(page, {
      swissGerman: word,
      german: "Test",
    });

    const wordId = await e2e.findWordIdBySwissGerman(word);
    const ownerExplanation = `Owner text ${Date.now().toString().slice(-6)}`;
    await e2e.addInterpretationViaUi(page, wordId, wordPath, {
      explanation: ownerExplanation,
      example: "Owner example",
    });

    const interpretationId = await e2e.findInterpretationIdByMeaning(ownerExplanation);

    await e2e.logoutViaUi(page);

    const nonOwner = e2e.uniqueUser("nonowner");
    await e2e.registerAndVerifyViaApi(request, nonOwner);
    await e2e.loginViaUi(page, nonOwner.email, nonOwner.password);

    const blockedText = `${ownerExplanation} blocked-attempt`;
    const nonOwnerUpdate = await page.request.put(
      `/api/interpretations/${interpretationId}`,
      {
        data: [{ explanation: blockedText, examples: ["Owner example"] }],
      }
    );
    expect(nonOwnerUpdate.status()).toBe(403);

    await page.goto(wordPath);
    await expect(page.getByText(ownerExplanation)).toBeVisible();
    await expect(page.getByText(blockedText)).toHaveCount(0);

    await e2e.logoutViaUi(page);
    await page.goto("/wort-hinzufügen");
    await expect(page).toHaveURL(/\/auth\/anmelden$/);
    await expect(page.getByRole("heading", { name: "Willkommen Zurück 👋" })).toBeVisible();
  });
});
