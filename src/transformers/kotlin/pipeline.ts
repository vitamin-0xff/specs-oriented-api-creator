// src/transformers/kotlin/pipeline.ts

import { FeatureIR, DtoSpecIR } from "../../parser/specs-validators.ts";
import { SpringKotlinFeatureIR } from "../../ir/kotlin-spring-ir.ts";
import { transformKotlinEntity } from "./entity.transformer.ts";
import { transformKotlinRepository } from "./repository.transformer.ts";
import { transformKotlinDtos } from "./dto.transformer.ts";
import { transformKotlinMapper } from "./mapper.transformer.ts";
import { transformKotlinService } from "./service.transformer.ts";
import { transformKotlinController } from "./controller.transformer.ts";

export function createSpringKotlinFeatureIR(
  featureSpec: FeatureIR,
  dtosSpec: DtoSpecIR[],
  basePackage: string
): SpringKotlinFeatureIR {
  const entityIr = transformKotlinEntity(featureSpec, basePackage);
  const repositoryIr = transformKotlinRepository(entityIr, basePackage);
  const dtosIr = transformKotlinDtos(dtosSpec, entityIr, basePackage);
  const mapperIr = transformKotlinMapper(entityIr, dtosIr, basePackage);
  const serviceIr = transformKotlinService(
    featureSpec,
    entityIr,
    repositoryIr,
    dtosIr,
    mapperIr,
    basePackage
  );
  const controllerIr = transformKotlinController(
    featureSpec,
    serviceIr,
    dtosIr,
    basePackage
  );

  return {
    featureName: featureSpec.name,
    basePackage,
    entity: entityIr,
    repository: repositoryIr,
    dtos: dtosIr,
    mapper: mapperIr,
    service: serviceIr,
    controller: controllerIr,
  };
}
