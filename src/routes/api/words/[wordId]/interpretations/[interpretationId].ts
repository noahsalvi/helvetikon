import prisma from "$lib/prisma";
import type { WordInterpretation } from "@prisma/client";

// Update an interpretation
export async function put({ params, body }) {
  const interpretationId = parseInt(params.interpretationId);
  const newInterpretation: WordInterpretation = JSON.parse(body);

  const interpretation = await prisma.wordInterpretation.update({
    where: { id: interpretationId },
    data: {
      examples: newInterpretation.examples,
      meaning: newInterpretation.meaning,
    },
  });

  return {
    body: interpretation,
  };
}
