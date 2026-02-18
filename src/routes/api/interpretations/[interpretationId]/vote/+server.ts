import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

type VoteUser = {
  upvotedInterpretations: { id: number }[];
  downvotedInterpretations: { id: number }[];
};

type VoteSummary = {
  upvotes: { username: string }[];
  downvotes: { username: string }[];
};

export const PUT: RequestHandler = async ({ params, locals, request }) => {
  const interpretationId = parseInt(params.interpretationId);
  let userId: number;
  try {
    userId = authorize(locals).id;
  } catch (e: any) {
    if (e && typeof e === "object" && "status" in e) {
      return new Response(e.body, { status: e.status });
    }
    throw e;
  }

  const data: { upvote: boolean; downvote: boolean } = await request.json();

  if (data.upvote && data.downvote) {
    return new Response("Upvote and Downvote can't both be true", {
      status: 409,
    });
  }

  const user = (await prisma.user.findUnique({
    where: { id: userId },
    select: {
      upvotedInterpretations: { select: { id: true } },
      downvotedInterpretations: { select: { id: true } },
    },
  })) as VoteUser | null;

  if (!user) return new Response("User not found", { status: 404 });

  const interpretation = { id: interpretationId };

  if (data.upvote) {
    user.upvotedInterpretations.find((item) => item.id === interpretationId) ||
      user.upvotedInterpretations.push(interpretation);
  } else {
    user.upvotedInterpretations = user.upvotedInterpretations.filter(
      (item) => item.id !== interpretationId
    );
  }

  if (data.downvote) {
    user.downvotedInterpretations.find((item) => item.id === interpretationId) ||
      user.downvotedInterpretations.push(interpretation);
  } else {
    user.downvotedInterpretations = user.downvotedInterpretations.filter(
      (item) => item.id !== interpretationId
    );
  }

  await prisma.user.update({
    where: { id: userId },
    include: { downvotedInterpretations: true, upvotedInterpretations: true },
    data: {
      upvotedInterpretations: { set: user.upvotedInterpretations },
      downvotedInterpretations: { set: user.downvotedInterpretations },
    },
  });

  const updatedInterpretation = (await prisma.interpretation.findUnique({
    where: { id: interpretationId },
    select: {
      upvotes: { select: { username: true } },
      downvotes: { select: { username: true } },
    },
  })) as VoteSummary | null;

  if (!updatedInterpretation) {
    return new Response("Interpretation not found", { status: 404 });
  }

  return json({
    upvotes: updatedInterpretation.upvotes,
    downvotes: updatedInterpretation.downvotes,
  });
};
