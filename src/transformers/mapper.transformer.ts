import {
  EntityIR,
  DtoIR,
  MapperIR,
  JavaMethod,
} from "../ir/java-spring-ir.ts";
import { upperFirst } from "../utils/capitalize.ts";

/**
 * Creates the mapping methods for the mapper interface.
 * For each DTO, it creates an entity-to-dto and a dto-to-entity method.
 */
function createMapperMethods(
  entityIr: EntityIR,
  dtosIr: DtoIR[],
  imports: Set<string>
): JavaMethod[] {
  const methods: JavaMethod[] = [];
  const entityName = entityIr.className;

  // Add entity to imports
  imports.add(`${entityIr.packageName}.${entityName}`);

  for (const dto of dtosIr) {
    const dtoName = dto.className;
    // Add DTO to imports
    imports.add(`${dto.packageName}.${dtoName}`);

    // Method: Entity -> DTO
    methods.push({
      name: `toDto`,
      returnType: dtoName,
      accessModifier: "public", // Interfaces methods are public by default
      parameters: [{ name: entityName.toLowerCase(), type: entityName }],
      annotations: [],
    });
    
    // Method: DTO -> Entity
    methods.push({
        name: `toEntity`,
        returnType: entityName,
        accessModifier: "public",
        parameters: [{ name: dtoName.toLowerCase(), type: dtoName }],
        annotations: [],
    });
  }

  return methods;
}

/**
 * Transforms entity and DTO IRs into a Java/Spring-specific MapperIR.
 * This implementation assumes MapStruct is being used.
 * @param entityIr The EntityIR for the feature.
 * @param dtosIr An array of DtoIRs for the feature.
 * @param basePackage The base package name.
 * @returns A MapperIR object.
 */
export function transformMapper(
  entityIr: EntityIR,
  dtosIr: DtoIR[],
  basePackage: string
): MapperIR {
  const mapperName = `${entityIr.className}Mapper`;
  const imports = new Set<string>();

  // Add MapStruct imports
  imports.add("org.mapstruct.Mapper");

  const methods = createMapperMethods(entityIr, dtosIr, imports);

  return {
    packageName: `${basePackage}.mapper`,
    className: mapperName,
    imports,
    annotations: [
      { name: "Mapper", properties: ['componentModel = "spring"'] },
    ],
    accessModifier: "public",
    type: "interface",
    fields: [], // Mappers are interfaces
    methods: methods,
  };
}
