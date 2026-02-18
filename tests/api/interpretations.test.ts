import { beforeEach, describe, expect, it, vi } from "vitest";

const { authorize, findUnique } = vi.hoisted(() => ({
  authorize: vi.fn(),
  findUnique: vi.fn(),
}));

vi.mock("$lib/api/middlewares/authorize", () => ({
  default: authorize,
}));

vi.mock("$lib/prisma", () => ({
  default: {
    interpretation: {
      findUnique,
    },
  },
}));

import { put as putInterpretation } from "../../src/routes/api/interpretations/[interpretationId]/index";
import { put as putVote } from "../../src/routes/api/interpretations/[interpretationId]/vote";

describe("Interpretation API negative paths", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("forbids editing interpretation owned by another user", async () => {
    authorize.mockReturnValue({ id: 1 });
    findUnique.mockResolvedValue({ id: 9, createdByUserId: 2 });

    const result = await putInterpretation({
      params: { interpretationId: "9" },
      locals: {},
      body: [{ explanation: "x", examples: [] }],
    } as any);

    expect(result).toEqual({
      status: 403,
      body: "You're not allowed to edit this interpretation",
    });
  });

  it("rejects payload where upvote and downvote are both true", async () => {
    authorize.mockReturnValue({ id: 1 });

    const result = await putVote({
      params: { interpretationId: "9" },
      locals: {},
      body: { upvote: true, downvote: true },
    } as any);

    expect(result).toEqual({
      status: 409,
      body: "Upvote and Downvote can't both be true",
    });
  });
});
