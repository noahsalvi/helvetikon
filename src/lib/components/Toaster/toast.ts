import { ToastProps, ToastType } from "./toastProps";
import toasts from "./toasts";

const toast = (toast: ToastProps) => {
  toasts.update((toasts) => [toast, ...toasts]);
};

export function success(content: string, timeout?) {
  toast({ content, type: ToastType.Success, timeout });
}

export function warn(content: string, timeout?) {
  toast({ content, type: ToastType.Warning, timeout });
}

export function error(content?: string, timeout?) {
  toast({
    content: content || "Etwas ist schief gelaufen 😣",
    type: ToastType.Error,
    timeout,
  });
}
