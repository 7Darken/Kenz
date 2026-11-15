/** Remplace les `{variables}` d'un texte : `format("Essayer {app}", { app: "Oshii" })`. */
export function format(template: string, values: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.hasOwn(values, name) ? String(values[name]) : match,
  );
}
