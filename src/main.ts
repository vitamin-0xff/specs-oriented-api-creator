import { parseAndValidateSpec } from "./parser/index.ts";

const specPath = Deno.args[0];

if (!specPath) {
  console.error("Usage: deno run src/main.ts <spec.json>");
  Deno.exit(1);
}

try {
  const spec = await parseAndValidateSpec(specPath);
  console.log("Specification loaded successfully");
  console.log(`Features: ${spec.features.length}`);
} catch (err) {
  console.error(err.message);
  Deno.exit(1);
}

