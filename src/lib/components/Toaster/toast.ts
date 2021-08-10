import { ToastProps, ToastType } from "./toastProps";
import toasts from "./toasts";

const toast = (toast: ToastProps) => {
  toasts.update((toasts) => [toast, ...toasts]);
};

export const success = (content: string, timeout?) =>
  toast({ content, type: ToastType.Success, timeout });

export const warn = (content: string, timeout?) =>
  toast({ content, type: ToastType.Warning, timeout });

export const error = (content: string, timeout?) =>
  toast({ content, type: ToastType.Error, timeout });
