import { page } from "$app/stores";

export default function active(node: HTMLAnchorElement) {
  page.subscribe((page) => {
    if (node.href.includes(page.url.pathname)) {
      node.classList.add("active");
    } else {
      node.classList.remove("active");
    }
  });
}
