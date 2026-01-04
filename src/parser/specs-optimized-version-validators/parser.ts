// ---------------------------
// Parser function
// ---------------------------
export function parseFeatureSpec(raw: unknown): FeatureIR {
  const result = featureSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      "Invalid feature spec: " + JSON.stringify(result.error.format(), null, 2)
    );
  }
  return result.data;
}