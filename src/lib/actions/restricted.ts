import { session } from "$app/stores";
import { error } from "$lib/components/Toaster/toast";
import { get } from "svelte/store";

export default function restriction(node: HTMLAnchorElement) {
  const { user } = get(session);
  if (user) return;

  node.onclick = (event) => {
    error("Du bist nich angemeldet!", 3000, {
      title: "Anmelden",
      href: "/auth",
    });
    event.preventDefault();
  };

  return {
    destroy() {
      node.onclick = null;
    },
  };
}
