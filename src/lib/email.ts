import TestEmail from "./emails/TestEmail.svelte";
import { juiceResources, Options as JuiceOptions } from "juice";

export async function getEmailHTML() {
  return await renderMail(TestEmail as any, {
    data: {
      link: "https://helvetikon.org",
      user: { username: "noahsalvi" },
    },
  });
}

interface SvelteSSRComponent {
  render(data: {}): { html: string; css: { code: string }; head: string };
}

export async function renderMail(
  Component: SvelteSSRComponent,
  { data = {}, ...options }: { data?: {} } & JuiceOptions = {}
) {
  const { html: rawHtml, css, head } = Component.render(data);

  if (head) {
    // eslint-disable-next-line no-console
    console.error("Rendering a document head is not supported");
  }

  const html: string = await new Promise((resolve, reject) => {
    juiceResources(
      `${css.code ? `<style>${css.code}</style>` : ""}${rawHtml}`,
      options,
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });

  return {
    html,
  };
}
