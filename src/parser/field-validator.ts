import { unique } from "../utils/unique.ts";
import { FeatureIR } from "./specs-validators.ts";

export function validateEntityFields(feature: FeatureIR) {
  const fieldNames = feature.fields.map(f => f.name);

  if (!unique(fieldNames)) {
    throw new Error(`Duplicate field names in feature ${feature.name}`);
  }

  const idFields = feature.fields.filter(f => f.type === "Id");
  if (idFields.length !== 1) {
    throw new Error(`Feature ${feature.name} must have exactly one Id field`);
  }

  feature.fields.forEach(f => {
    if (f.type === "Enum" && (!("values" in f) || f.values.length === 0)) {
      throw new Error(`Enum field ${f.name} must define values`);
    }
  });
}
