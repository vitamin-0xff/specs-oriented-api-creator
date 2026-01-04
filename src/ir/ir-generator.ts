import { ApplicationSpec } from "../spec/index.ts";
import {
  ApplicationIR,
  FeatureIR,
  RepositoryOperationIR,
  ServiceMethodIR,
  EndpointIR,
  EntityIR,
} from "./index.ts";

export function generateIR(spec: ApplicationSpec): ApplicationIR {
  const features: FeatureIR[] = spec.features.map((feature) => {
    // Entity IR
    const entity: EntityIR = {
      name: feature.entity.name,
      tableName: feature.entity.tableName ?? feature.entity.name.toLowerCase(),
      fields: feature.entity.fields.map((f) => ({
        name: f.name,
        type: f.type,
        nullable: f.nullable ?? false,
        unique: f.unique ?? false,
        length: f.length,
      })),
    };

    // Repository operations IR
    const repoOps: RepositoryOperationIR[] =
      feature.repository?.operations.map((op) => ({
        name: op.name,
        type: op.type,
        returnType: op.returnType ?? "entity",
        criteria: (op.criteria ?? []).map((c) => ({
          field: entity.fields.find((f) => f.name === c.field)!,
          operator: c.operator,
        })),
      })) ?? [];

    // Service Methods IR
    const serviceMethods: ServiceMethodIR[] =
      feature.service?.methods.map((m) => ({
        name: m.name,
        repositoryOperation:
          repoOps.find((op) => op.name === m.repositoryOperation)!,
        transactional: m.transactional ?? false,
      })) ?? [];

    // Endpoints IR
    const endpoints: EndpointIR[] =
      feature.controller?.endpoints.map((e) => ({
        name: e.name,
        method: e.method,
        path: e.path,
        serviceMethod:
          serviceMethods.find((m) => m.name === e.serviceMethod)!,
        requestBody: e.requestBody ?? false,
      })) ?? [];

    return {
      name: feature.name,
      entity,
      repositoryOperations: repoOps,
      serviceMethods,
      endpoints,
      defaultRoles: feature.security?.defaultRoles ?? [],
      securityRules: feature.security?.rules ?? [],
    };
  });

  return {
    projectName: spec.project.name,
    basePackage: spec.project.basePackage,
    language: spec.project.language,
    features,
  };
}
