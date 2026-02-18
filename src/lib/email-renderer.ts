import juicePkg from "juice";
import { render as renderSvelte } from "svelte/server";

const { juiceResources } = juicePkg;
type JuiceOptions = juicePkg.Options;

export async function renderMail(
  Component: any,
  { data = {}, ...options }: { data?: {} } & JuiceOptions = {}
) {
  const rendered = renderSvelte(Component, { props: data });
  const rawHtml = rendered.body;
  const head = rendered.head || "";
  const cssCode = "";

  const html: string = await new Promise((resolve, reject) => {
    juiceResources(
      `${head}${cssCode ? `<style>${cssCode}</style>` : ""}${rawHtml}`,
      options,
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });

  return html;
}
