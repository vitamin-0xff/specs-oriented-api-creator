import z from "zod";
import { dtoSchema, featureSchema } from "./specs-validators.ts";
import { validateEntityFields } from "./field-validator.ts";
import { validateDtos } from "./dto-validation.ts";
import { validateOperations } from "./operation-validator.ts";

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
