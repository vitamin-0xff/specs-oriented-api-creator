// src/transformers/kotlin/repository.transformer.ts

import {
  EntityIR,
  RepositoryIR,
} from "../../ir/kotlin-spring-ir.ts";

export function transformKotlinRepository(
  entityIr: EntityIR,
  basePackage: string
): RepositoryIR {
  const entityName = entityIr.className;
  const repositoryName = `${entityName}Repository`;
  const imports = new Set<string>();

  imports.add("org.springframework.data.jpa.repository.JpaRepository");
  imports.add("org.springframework.stereotype.Repository");
  imports.add(`${entityIr.packageName}.${entityIr.className}`);

  const idType = entityIr.idField.type;
  if (idType === "UUID") {
    imports.add("java.util.UUID");
  }

  return {
    packageName: `${basePackage}.repository`,
    className: repositoryName,
    imports,
    annotations: [{ name: "Repository" }],
    type: "interface",
    extends: `JpaRepository<${entityName}, ${idType}>`,
    fields: [],
    functions: [],
    entity: entityIr,
  };
}
