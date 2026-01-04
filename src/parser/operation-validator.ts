import z from "zod";
import { dtoSchema, FeatureIR } from "./specs-validators.ts";

export function validateOperations(
  feature: FeatureIR,
  dtos: z.infer<typeof dtoSchema>[]
) {
  const dtoNames = new Set(dtos.map(d => d.name));

  feature.operations.forEach(op => {
    if ("input" in op && op.input && !dtoNames.has(op.input)) {
      throw new Error(
        `Operation ${op.name} references unknown input DTO ${op.input}`
      );
    }

    if ("output" in op && op.output && !dtoNames.has(op.output)) {
      throw new Error(
        `Operation ${op.name} references unknown output DTO ${op.output}`
      );
    }

    if (op.method === "GET" && "input" in op && op.input) {
      throw new Error(
        `GET operation ${op.name} must not define input DTO`
      );
    }
  });
}
