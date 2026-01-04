// src/generators/kotlin/mapper.generator.ts

import { MapperIR } from "../../ir/kotlin-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
  generateFunction,
} from "../../utils/template.kt.ts";

export function generateKotlinMapper(mapperIr: MapperIR): string {
  const packageName = generatePackage(mapperIr.packageName);
  const imports = generateImports(mapperIr.imports);
  const interfaceAnnotations = generateAnnotations(mapperIr.annotations);

  const functions = mapperIr.functions
    .map(func => {
        const abstractFunc = { ...func, body: "" }; // Interfaces have no bodies
        return generateFunction(abstractFunc).replace("{}", ""); // remove empty body
    })
    .join("\n\n");

  return `${packageName}${imports}${interfaceAnnotations}interface ${mapperIr.className} {
${functions}
}`;
}
