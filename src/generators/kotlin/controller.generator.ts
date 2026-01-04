// src/generators/kotlin/controller.generator.ts

import {
  ControllerIR,
} from "../../ir/kotlin-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateFunction,
} from "../../utils/template.kt.ts";

export function generateKotlinController(controllerIr: ControllerIR): string {
  const packageName = generatePackage(controllerIr.packageName);
  const imports = generateImports(controllerIr.imports);
  const classAnnotations = generateAnnotations(controllerIr.annotations);
  
  const constructorParams = controllerIr.dependencies
    .map(dep => `  private val ${dep.name}: ${dep.type}`)
    .join(",\n");

  const functions = controllerIr.functions.map(generateFunction).join("\n\n");

  return `${packageName}${imports}${classAnnotations}class ${controllerIr.className}(
${constructorParams}
) {

${functions}

}`;
}
