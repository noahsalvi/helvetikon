import { getEmailHTML } from "$lib/email";
export async function get() {
  return {
    body: (await getEmailHTML()).html,
  };
}
