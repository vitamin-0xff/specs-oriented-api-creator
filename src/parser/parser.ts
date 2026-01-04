import { ApplicationSpec } from "../spec/index.ts";

export async function loadSpecFromFile(
  path: string,
): Promise<ApplicationSpec> {
  const content = await Deno.readTextFile(path);

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    throw new Error("Invalid JSON: unable to parse specification file");
  }

  return json as ApplicationSpec;
}
