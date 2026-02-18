import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirst, compare } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  compare: vi.fn(),
}));

vi.mock("$lib/prisma", () => ({
  default: {
    user: {
      findFirst,
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    compare,
  },
}));

import { post } from "../../src/routes/api/auth/login";

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when password is wrong", async () => {
    findFirst.mockResolvedValue({ password: "hashed", verified: true });
    compare.mockResolvedValue(false);

    const result = await post({
      body: { email: "hello@example.com", password: "wrong" },
      locals: {},
    } as any);

    expect(result).toEqual({
      status: 401,
      body: "Authentication failed",
    });
  });

  it("returns 401 with verified reason when account is not verified", async () => {
    findFirst.mockResolvedValue({ password: "hashed", verified: false });
    compare.mockResolvedValue(true);

    const result = await post({
      body: { email: "hello@example.com", password: "correct" },
      locals: {},
    } as any);

    expect(result).toEqual({
      status: 401,
      body: "Account ist not verified",
      headers: { reason: "verified" },
    });
  });
});
