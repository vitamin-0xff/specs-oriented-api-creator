// src/generators/dto.generator.ts

import { DtoIR } from "../ir/java-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateField,
} from "../utils/template.ts";

/**
 * Generates the Java code for a DTO class.
 */
export function generateDto(dtoIr: DtoIR): string {
  const packageName = generatePackage(dtoIr.packageName);
  const imports = generateImports(dtoIr.imports);
  const classAnnotations = generateAnnotations(dtoIr.annotations);

  const fields = dtoIr.fields.map((field) => generateField(field)).join("");

  return `${packageName}${imports}${classAnnotations}${dtoIr.accessModifier} ${dtoIr.type} ${dtoIr.className} {
${fields}
}
`;
}
