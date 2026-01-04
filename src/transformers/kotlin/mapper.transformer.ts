// src/transformers/kotlin/mapper.transformer.ts

import {
  EntityIR,
  DtoIR,
  MapperIR,
  KotlinFunction,
} from "../../ir/kotlin-spring-ir.ts";

function createMapperFunctions(
  entityIr: EntityIR,
  dtosIr: DtoIR[],
  imports: Set<string>
): KotlinFunction[] {
  const functions: KotlinFunction[] = [];
  const entityName = entityIr.className;

  imports.add(`${entityIr.packageName}.${entityName}`);

  for (const dto of dtosIr) {
    const dtoName = dto.className;
    imports.add(`${dto.packageName}.${dtoName}`);

    // fun toDto(entity: User): UserDTO
    functions.push({
      name: `toDto`,
      returnType: dtoName,
      isSuspend: false,
      parameters: [{ name: entityName.toLowerCase(), type: entityName, isNullable: false }],
      annotations: [],
    });
    
    // fun toEntity(dto: UserDTO): User
    functions.push({
      name: `toEntity`,
      returnType: entityName,
      isSuspend: false,
      parameters: [{ name: dtoName.toLowerCase(), type: dtoName, isNullable: false }],
      annotations: [],
    });
  }

  return functions;
}

export function transformKotlinMapper(
  entityIr: EntityIR,
  dtosIr: DtoIR[],
  basePackage: string
): MapperIR {
  const mapperName = `${entityIr.className}Mapper`;
  const imports = new Set<string>();

  imports.add("org.mapstruct.Mapper");

  const functions = createMapperFunctions(entityIr, dtosIr, imports);

  return {
    packageName: `${basePackage}.mapper`,
    className: mapperName,
    imports,
    annotations: [
      { name: "Mapper", properties: ['componentModel = "spring"'] },
    ],
    type: "interface",
    fields: [],
    functions: functions,
  };
}
