import { PrismaClient, WordInterpretation } from "@prisma/client";
const prisma = new PrismaClient();

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
