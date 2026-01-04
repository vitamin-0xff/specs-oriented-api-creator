// src/generators/repository.generator.ts

import { RepositoryIR } from "../ir/java-spring-ir.ts";
import {
  generatePackage,
  generateImports,
  generateAnnotations,
} from "../utils/template.ts";

/**
 * Generates the Java code for a Spring Data JPA Repository interface.
 */
export function generateRepository(repositoryIr: RepositoryIR): string {
  const packageName = generatePackage(repositoryIr.packageName);
  const imports = generateImports(repositoryIr.imports);
  const interfaceAnnotations = generateAnnotations(repositoryIr.annotations);

  // TODO: Add methods if any custom ones are defined in the IR

  return `${packageName}${imports}${interfaceAnnotations}${repositoryIr.accessModifier} ${repositoryIr.type} ${repositoryIr.className} extends ${repositoryIr.extends} {

}
`;
}
