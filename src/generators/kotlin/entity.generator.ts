// src/generators/kotlin/entity.generator.ts

import { EntityIR } from "../../ir/kotlin-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateField,
} from "../../utils/template.kt.ts";

export function generateKotlinEntity(entityIr: EntityIR): string {
  const packageName = generatePackage(entityIr.packageName);
  const imports = generateImports(entityIr.imports);
  const classAnnotations = generateAnnotations(entityIr.annotations);

  const fields = entityIr.fields.map(generateField).join("\n");

  return `${packageName}${imports}${classAnnotations}${entityIr.type} ${entityIr.className}(
${fields}
)`
}