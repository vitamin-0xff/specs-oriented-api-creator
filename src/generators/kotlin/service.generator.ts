// src/generators/kotlin/service.generator.ts

import { ServiceIR } from "../../ir/kotlin-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateFunction,
} from "../../utils/template.kt.ts";

export function generateKotlinService(serviceIr: ServiceIR): string {
  const packageName = generatePackage(serviceIr.packageName);
  const imports = generateImports(serviceIr.imports);
  const classAnnotations = generateAnnotations(serviceIr.annotations);

  const constructorParams = serviceIr.dependencies
    .map(dep => `  private val ${dep.name}: ${dep.type}`)
    .join(",\n");

  const functions = serviceIr.functions.map(generateFunction).join("\n\n");

  return `${packageName}${imports}${classAnnotations}class ${serviceIr.className}(
${constructorParams}
) {

${functions}

}`;
}
