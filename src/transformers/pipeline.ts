import { FeatureIR, DtoSpecIR } from "../parser/specs-validators.ts"; // Assuming DtoSpec export
import { SpringFeatureIR } from "../ir/java-spring-ir.ts";
import { transformEntity } from "./entity.transformer.ts";
import { transformRepository } from "./repository.transformer.ts";
import { transformDtos } from "./dto.transformer.ts";
import { transformMapper } from "./mapper.transformer.ts";
import { transformService } from "./service.transformer.ts";
import { transformController } from "./controller.transformer.ts";

/**
 * The main transformation pipeline.
 * It orchestrates the entire process of converting the generic spec
 * into the Java/Spring-specific Intermediate Representation.
 *
 * @param featureSpec The parsed feature specification.
 * @param dtosSpec The parsed DTO specifications.
 * @param basePackage The base package for the generated code (e.g., "com.example.app").
 * @returns The fully assembled SpringFeatureIR.
 */
export function createSpringFeatureIR(
  featureSpec: FeatureIR,
  dtosSpec: DtoSpecIR[], // Assuming DtoSpec[] is the type for the dtos file content
  basePackage: string
): SpringFeatureIR {
  // 1. Transform the core entity
  const entityIr = transformEntity(featureSpec, basePackage);

  // 2. Transform the repository, which depends on the entity
  const repositoryIr = transformRepository(entityIr, basePackage);

  // 3. Transform the DTOs
  const dtosIr = transformDtos(dtosSpec, entityIr, basePackage);

  // 4. Transform the mapper, which depends on the entity and DTOs
  const mapperIr = transformMapper(entityIr, dtosIr, basePackage);

  // 5. Transform the service, which depends on almost everything
  const serviceIr = transformService(
    featureSpec,
    entityIr,
    repositoryIr,
    dtosIr,
    mapperIr,
    basePackage
  );

  // 6. Transform the controller, which depends on the service and DTOs
  const controllerIr = transformController(
    featureSpec,
    serviceIr,
    dtosIr,
    basePackage
  );

  // 7. Assemble the final IR object
  const springFeatureIr: SpringFeatureIR = {
    featureName: featureSpec.name,
    basePackage,
    entity: entityIr,
    repository: repositoryIr,
    dtos: dtosIr,
    mapper: mapperIr,
    service: serviceIr,
    controller: controllerIr,
  };

  return springFeatureIr;
}
