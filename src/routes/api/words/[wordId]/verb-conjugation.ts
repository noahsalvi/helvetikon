import authorize from "$lib/api/middlewares/authorize";
import { VerbConjucation } from ".prisma/client";

export async function post({ params, body, locals }) {
  authorize(locals);

  const {
    present,
    conditionalI,
    conditionalII,
  }: {
    present?: VerbConjucation;
    conditionalI?: VerbConjucation;
    conditionalII?: VerbConjucation;
  } = body;

  if (!present && !conditionalI && !conditionalII)
    return {
      status: 400,
      body: "present, conditionalI and conditionalII empty",
    };
}
