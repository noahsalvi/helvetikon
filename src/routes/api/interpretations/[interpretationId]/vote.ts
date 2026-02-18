import authorize from "$lib/api/middlewares/authorize";
import prisma from "$lib/prisma";

type VoteUser = {
  upvotedInterpretations: { id: number }[];
  downvotedInterpretations: { id: number }[];
};

type VoteSummary = {
  upvotes: { username: string }[];
  downvotes: { username: string }[];
};

export async function put({ params, locals, body }) {
  const interpretationId = parseInt(params.interpretationId);
  const { id: userId } = authorize(locals);
  const data: { upvote: boolean; downvote: boolean } = body;

  if (data.upvote && data.downvote)
    return { status: 409, body: "Upvote and Downvote can't both be true" };

  const user = (await prisma.user.findUnique({
    where: { id: userId },
    select: {
      upvotedInterpretations: { select: { id: true } },
      downvotedInterpretations: { select: { id: true } },
    },
  })) as VoteUser | null;

  if (!user) return { status: 404, body: "User not found" };

  const interpretation = { id: interpretationId };

  if (data.upvote) {
    user.upvotedInterpretations.find(
      (interpretation) => interpretation.id === interpretationId
    ) || user.upvotedInterpretations.push(interpretation);
  } else {
    user.upvotedInterpretations = user.upvotedInterpretations.filter(
      (interpretation) => interpretation.id !== interpretationId
    );
  }

  if (data.downvote) {
    user.downvotedInterpretations.find(
      (interpretation) => interpretation.id === interpretationId
    ) || user.downvotedInterpretations.push(interpretation);
  } else {
    user.downvotedInterpretations = user.downvotedInterpretations.filter(
      (interpretation) => interpretation.id !== interpretationId
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

  if (!updatedInterpretation)
    return { status: 404, body: "Interpretation not found" };

  return {
    body: {
      upvotes: updatedInterpretation.upvotes,
      downvotes: updatedInterpretation.downvotes,
    },
  };
}
