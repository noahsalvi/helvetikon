import { ToastProps, ToastType } from "./toastProps";
import toasts from "./toasts";

export const toast = (toast: ToastProps, showNextVisit?: boolean) => {
  if (!showNextVisit) return toasts.update((toasts) => [toast, ...toasts]);

  sessionStorage.setItem("toast-next-visit", JSON.stringify(toast));
};

export function success(content: string, timeout?) {
  toast({ content, type: ToastType.Success, timeout });
}

export function successNextVisit(content: string, timeout?) {
  toast({ content, type: ToastType.Success, timeout }, true);
}

export function warn(content: string, timeout?) {
  toast({ content, type: ToastType.Warning, timeout });
}

export function warnNextVisit(content: string, timeout?) {
  toast({ content, type: ToastType.Warning, timeout }, true);
}

export function error(
  content?: string,
  timeout?,
  link?: { title: string; href: string }
) {
  toast({
    content: content || "Etwas ist schief gelaufen 😣",
    type: ToastType.Error,
    link,
    timeout,
  });
}
