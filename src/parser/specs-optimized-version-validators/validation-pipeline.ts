export function parseFeature(
  rawFeature: unknown,
  rawDtos: unknown
) {
  const feature = featureSchema.parse(rawFeature);
  const dtos = z.array(dtoSchema).parse(rawDtos);

  validateEntityFields(feature);
  validateDtos(dtos, feature);
  validateOperations(feature, dtos);

  return {
    feature,
    dtos
  };
}
