// src/generators/controller.generator.ts

import { ControllerIR } from "../ir/java-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateField,
  generateMethod,
} from "../utils/template.ts";

/**
 * Generates the Java code for a Spring RestController class.
 */
export function generateController(controllerIr: ControllerIR): string {
  const packageName = generatePackage(controllerIr.packageName);
  const imports = generateImports(controllerIr.imports);
  const classAnnotations = generateAnnotations(controllerIr.annotations);

  const fields = controllerIr.fields.map((field) => generateField(field)).join("");
  const methods = controllerIr.methods.map((method) => generateMethod(method)).join("\n");

  return `${packageName}${imports}${classAnnotations}${controllerIr.accessModifier} ${controllerIr.type} ${controllerIr.className} {
${fields}

${methods}
}
`;
}
