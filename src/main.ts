import { generateIR } from "./ir/ir-generator.ts";
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

  const ir = generateIR(spec);
  console.log(JSON.stringify(ir));
  console.log(`Generated IR for ${ir.features.length} feature(s)`);

} catch (err: unknown) {
  console.error(err?.message ?? "An unknown error occurred");
  Deno.exit(1);
}

