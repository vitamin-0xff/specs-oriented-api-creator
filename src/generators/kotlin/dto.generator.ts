// src/generators/kotlin/dto.generator.ts

import { DtoIR } from "../../ir/kotlin-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateField,
} from "../../utils/template.kt.ts";

export function generateKotlinDto(dtoIr: DtoIR): string {
  const packageName = generatePackage(dtoIr.packageName);
  const imports = generateImports(dtoIr.imports);
  const classAnnotations = generateAnnotations(dtoIr.annotations);

  const fields = dtoIr.fields.map(generateField).join("\n");

  return `${packageName}${imports}${classAnnotations}${dtoIr.type} ${dtoIr.className}(
${fields}
)`;
}
