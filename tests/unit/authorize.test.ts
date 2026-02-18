import { describe, expect, it } from "vitest";
import authorize from "../../src/lib/api/middlewares/authorize";

describe("authorize middleware", () => {
  it("returns the user when locals.user exists", () => {
    const user = { id: 7, email: "test@example.com" } as any;
    const result = authorize({ user } as any);

    expect(result).toBe(user);
  });

  it("throws a 401 error object when user is missing", () => {
    try {
      authorize({} as any);
      throw new Error("Expected authorize to throw");
    } catch (error: any) {
      expect(error).toEqual({
      status: 401,
      body: "Authorization failed",
      });
    }
  });
});
