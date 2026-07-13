const VARIABLE_REGEX = /\{\{(\w+)\}\}/g;

export function extractVariables(text: string): string[] {
  const vars = new Set<string>();
  let match;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars);
}

export function replaceVariables(
  text: string,
  values: Record<string, string>,
): string {
  return text.replace(VARIABLE_REGEX, (_, name: string) => {
    return values[name] ?? `{{${name}}}`;
  });
}

export function hasVariables(text: string): boolean {
  return VARIABLE_REGEX.test(text);
}
