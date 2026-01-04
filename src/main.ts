import { parseFeature } from './parser/validation-pipeline.ts';
import { readContentFromFile } from './utils/load-content-file.ts'

const specPath = Deno.args[0];
const dtoSpec = Deno.args[1]

if (!specPath || !dtoSpec) {
  console.error("Usage: deno run src/main.ts <spec.json> <dtospecs.json>");
  Deno.exit(1);
}

try {
  const content = await readContentFromFile(specPath);
  const jsonContent = JSON.parse(content);
  const dtos = await readContentFromFile(dtoSpec);
  const parsedDtos = JSON.parse(dtos);

  const returnType = parseFeature(jsonContent, parsedDtos);
  console.log(returnType);

} catch (err: unknown) {
  // @ts-ignore
  console.error(err?.message ?? "An unknown error occurred");
  console.log((err as Error).stack);
  Deno.exit(1);
}

