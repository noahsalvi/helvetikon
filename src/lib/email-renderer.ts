import juicePkg from "juice";

const { juiceResources } = juicePkg;
type JuiceOptions = juicePkg.Options;

export async function renderMail(
  Component: any,
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

  return html;
}
