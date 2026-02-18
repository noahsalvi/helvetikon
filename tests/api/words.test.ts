import { describe, expect, it } from "vitest";
import { post } from "../../src/routes/api/words/index";

describe("POST /api/words", () => {
  it("throws 401 auth failure when called without authenticated user", async () => {
    try {
      await post({
        body: {
          swissGerman: "Gruezi",
          german: "Hallo",
          spellings: ["Gruezi"],
          dialect: "ZUERICH",
        },
        locals: {},
      } as any);
      throw new Error("Expected call to throw");
    } catch (error: any) {
      expect(error).toEqual({
        status: 401,
        body: "Authorization failed",
      });
    }
  });
});
