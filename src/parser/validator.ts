import { ApplicationSpec } from "../spec/index.ts";
import { ValidationError } from "./validation-error.ts";

export function validateSpec(
  spec: ApplicationSpec,
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Project validation
  if (!spec.project.name) {
    errors.push({
      path: "project.name",
      message: "Project name is required",
    });
  }

  if (!spec.project.basePackage) {
    errors.push({
      path: "project.basePackage",
      message: "Base package is required",
    });
  }

  // Feature validation
  const featureNames = new Set<string>();

  for (const feature of spec.features) {
    if (featureNames.has(feature.name)) {
      errors.push({
        path: `features.${feature.name}`,
        message: "Duplicate feature name",
      });
    }
    featureNames.add(feature.name);

    // Entity validation
    const entity = feature.entity;
    if (!entity.fields || entity.fields.length === 0) {
      errors.push({
        path: `features.${feature.name}.entity.fields`,
        message: "Entity must have at least one field",
      });
    }

    const fieldNames = new Set<string>();
    for (const field of entity.fields) {
      if (fieldNames.has(field.name)) {
        errors.push({
          path: `features.${feature.name}.entity.fields.${field.name}`,
          message: "Duplicate field name",
        });
      }
      fieldNames.add(field.name);
    }

    // Repository → Service linkage
    if (feature.service?.enabled) {
      const repoOps =
        feature.repository?.operations.map((o) => o.name) ?? [];

      for (const method of feature.service.methods) {
        if (!repoOps.includes(method.repositoryOperation)) {
          errors.push({
            path:
              `features.${feature.name}.service.methods.${method.name}`,
            message:
              `Repository operation '${method.repositoryOperation}' not found`,
          });
        }
      }
    }

    // Service → Controller linkage
    if (feature.controller) {
      const serviceMethods =
        feature.service?.methods.map((m) => m.name) ?? [];

      for (const endpoint of feature.controller.endpoints) {
        if (!serviceMethods.includes(endpoint.serviceMethod)) {
          errors.push({
            path:
              `features.${feature.name}.controller.endpoints.${endpoint.name}`,
            message:
              `Service method '${endpoint.serviceMethod}' not found`,
          });
        }
      }
    }
  }

  return errors;
}
