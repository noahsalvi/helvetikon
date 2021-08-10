import { Writable, writable } from "svelte/store";
import type { ToastProps } from "./toastProps";

const toasts: Writable<ToastProps[]> = writable([]);
export default toasts;
