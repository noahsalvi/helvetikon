import { expect, test } from "@playwright/test";

test("unauthenticated API create-word request is rejected", async ({
  request,
}) => {
  const response = await request.post("/api/words", {
    data: {
      swissGerman: "Gruezi",
      german: "Hallo",
      spellings: ["Gruezi"],
      dialect: "ZUERICH",
    },
  });

  expect(response.status()).toBe(401);
  expect(await response.text()).toContain("Authorization failed");
});
