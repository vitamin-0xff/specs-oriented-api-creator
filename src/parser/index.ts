import { loadSpecFromFile } from "./parser.ts";
import { validateSpec } from "./validator.ts";

export async function parseAndValidateSpec(path: string) {
  const spec = await loadSpecFromFile(path);
  const errors = validateSpec(spec);

  if (errors.length > 0) {
    const message = errors
      .map((e) => `${e.path}: ${e.message}`)
      .join("\n");

    throw new Error(`Specification validation failed:\n${message}`);
  }

  return spec;
}
