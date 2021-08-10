export enum ToastType {
  Success,
  Warning,
  Error,
}

export type ToastProps = {
  type: ToastType;
  content: string;
  timeout?: number;
  link?: { title: string; href: string };
};
