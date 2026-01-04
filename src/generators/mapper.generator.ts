// src/generators/mapper.generator.ts

import { MapperIR } from "../ir/java-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateMethod,
} from "../utils/template.ts";

/**
 * Generates the Java code for a MapStruct Mapper interface.
 */
export function generateMapper(mapperIr: MapperIR): string {
  const packageName = generatePackage(mapperIr.packageName);
  const imports = generateImports(mapperIr.imports);
  const interfaceAnnotations = generateAnnotations(mapperIr.annotations);

  // MapStruct methods are abstract by default, so their body is empty
  const methods = mapperIr.methods
    .map((method) => {
      // Clear method body for interface methods
      const abstractMethod = { ...method, body: "" };
      return generateMethod(abstractMethod);
    })
    .join("\n");

  return `${packageName}${imports}${interfaceAnnotations}${mapperIr.accessModifier} ${mapperIr.type} ${mapperIr.className} {
${methods}
}
`;
}
