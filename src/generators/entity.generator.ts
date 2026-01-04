// src/generators/entity.generator.ts

import { EntityIR } from "../ir/java-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateField,
} from "../utils/template.ts";

/**
 * Generates the Java code for a Spring JPA Entity.
 */
export function generateEntity(entityIr: EntityIR): string {
  const packageName = generatePackage(entityIr.packageName);
  const imports = generateImports(entityIr.imports);
  const classAnnotations = generateAnnotations(entityIr.annotations);

  const fields = entityIr.fields.map((field) => generateField(field)).join("");

  // TODO: Add methods if any are defined in the IR

  return `${packageName}${imports}${classAnnotations}${entityIr.accessModifier} ${entityIr.type} ${entityIr.className} {
${fields}
}
`;
}
