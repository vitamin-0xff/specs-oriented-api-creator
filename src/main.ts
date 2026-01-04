import { generateIR } from "./ir/ir-generator.ts";
import { parseAndValidateSpec } from "./parser/index.ts";
import { transformApplication } from "./transformers/pipleline.ts";
import { generateRepository } from "./generators/repository.generator.ts";
import { generateEntity } from "./generators/entity.generator.ts";

const specPath = Deno.args[0];
const outputPath = Deno.args[1] ?? "./generated";


if (!specPath) {
  console.error("Usage: deno run --allow-write --allow-read src/main.ts <spec.json> [outputPath]");
  Deno.exit(1);
}

try {
  const spec = await parseAndValidateSpec(specPath);
  console.log("Specification loaded successfully");
  console.log(`Features: ${spec.features.length}`);

  const ir = generateIR(spec);
  console.log(ir);
  console.log(`Generated IR for ${ir.features.length} feature(s)`);

  const transformedFeatures = transformApplication(ir.features);

  console.log("Applied Spring-aware transformers successfully");
  console.log(`Transformed ${transformedFeatures.length} feature(s)`);
  console.log(transformedFeatures);

  // Generate Entities
  for (const feature of transformedFeatures) {
    await generateEntity(feature, outputPath, ir.basePackage);
    await generateRepository(feature, outputPath, ir.basePackage);
  }


} catch (err: unknown) {
  console.error(err?.message ?? "An unknown error occurred");
  Deno.exit(1);
}

