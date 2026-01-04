// src/generators/kotlin/repository.generator.ts

import { RepositoryIR } from "../../ir/kotlin-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
} from "../../utils/template.kt.ts";

export function generateKotlinRepository(repositoryIr: RepositoryIR): string {
  const packageName = generatePackage(repositoryIr.packageName);
  const imports = generateImports(repositoryIr.imports);
  const interfaceAnnotations = generateAnnotations(repositoryIr.annotations);

  return `${packageName}${imports}${interfaceAnnotations}interface ${repositoryIr.className} : ${repositoryIr.extends} {

}`;
}
