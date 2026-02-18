import { describe, expect, it, vi } from "vitest";
import validate from "../../src/lib/api/middlewares/validate";

describe("validate middleware", () => {
  it("returns malformed response when any validator is false", () => {
    const result = validate([true, false, true], vi.fn());

    expect(result).toEqual({
      status: 400,
      body: "The request body is malformed",
    });
  });

  it("calls callback when all validators pass", () => {
    const callback = vi.fn(() => ({ ok: true }));
    const result = validate([true, true], callback);

    expect(callback).toHaveBeenCalledOnce();
    expect(result).toEqual({ ok: true });
  });
});
