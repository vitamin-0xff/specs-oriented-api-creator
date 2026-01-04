import z from "zod";
import { dtoSchema, FeatureIR } from "./specs-validators.ts";

export function validateDtos(
  dtos: z.infer<typeof dtoSchema>[],
  feature: FeatureIR
) {
  const entityFieldNames = new Set(
    feature.fields.map(f => f.name)
  );

  const relationNames = new Set(
    feature.relations?.map(r => r.name) ?? []
  );

  const dtoMap = new Map(dtos.map(d => [d.name, d]));

  dtos.forEach(dto => {
    if (dto.sourceEntity !== feature.name) {
      throw new Error(
        `DTO ${dto.name} references unknown entity ${dto.sourceEntity}`
      );
    }

    dto.include?.forEach(field => {
      if (!entityFieldNames.has(field)) {
        throw new Error(
          `DTO ${dto.name} includes unknown field ${field}`
        );
      }
    });

    dto.exclude?.forEach(field => {
      if (!entityFieldNames.has(field)) {
        throw new Error(
          `DTO ${dto.name} excludes unknown field ${field}`
        );
      }
    });

    dto.relations?.forEach(rel => {
      if (!relationNames.has(rel.field)) {
        throw new Error(
          `DTO ${dto.name} references unknown relation ${rel.field}`
        );
      }

      if (rel.mode === "EMBEDDED" && rel.dtoRef) {
        if (!dtoMap.has(rel.dtoRef)) {
          throw new Error(
            `DTO ${dto.name} embeds unknown DTO ${rel.dtoRef}`
          );
        }
      }
    });
  });
}
