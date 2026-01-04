// src/generators/service.generator.ts

import { ServiceIR } from "../ir/java-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateField,
  generateMethod,
} from "../utils/template.ts";

/**
 * Generates the Java code for a Spring Service class.
 */
export function generateService(serviceIr: ServiceIR): string {
  const packageName = generatePackage(serviceIr.packageName);
  const imports = generateImports(serviceIr.imports);
  const classAnnotations = generateAnnotations(serviceIr.annotations);

  const fields = serviceIr.fields.map((field) => generateField(field)).join("");
  const methods = serviceIr.methods.map((method) => generateMethod(method)).join("\n");

  return `${packageName}${imports}${classAnnotations}${serviceIr.accessModifier} ${serviceIr.type} ${serviceIr.className} {
${fields}
${methods}
}
`;
}
