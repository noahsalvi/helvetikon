/** ## in text gets replaced by the value */
export function metaContent(text: string, value: any, replacement = "") {
  if (!value) return replacement;

  return text.replace("##", value);
}
