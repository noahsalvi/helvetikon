/** ## in text gets replaced by the value */
export function metaContent(text: string, value: any, replacement = "") {
  if (!value) return replacement;

  return text.replace("##", value);
}

/** Windi scanner does not detect using dynamic classes (class:bg-green-300={bool}), this is a replacement */
export function r(className: string, show: boolean, replacement = "") {
  if (!show) return replacement;

  return className;
}
