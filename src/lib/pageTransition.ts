import { crossfade } from "svelte/transition";

const [send, receive] = crossfade({});
export { receive, send };
