// src/transformers/kotlin/dto.transformer.ts

import { DtoIR, EntityIR, KotlinField } from "../../ir/kotlin-spring-ir.ts";
import { DtoSpecIR } from "../../parser/specs-validators.ts";
import { upperFirst } from "../../utils/capitalize.ts";

function createDtoFieldFromEntityField(
  entityField: KotlinField,
  imports: Set<string>
): KotlinField {
  const dtoField: KotlinField = {
    name: entityField.name,
    type: entityField.type,
    isNullable: entityField.isNullable,
    isMutable: false, // DTOs should be immutable (val)
    annotations: [],
    isRelation: entityField.isRelation,
    relationTargetEntity: entityField.relationTargetEntity,
  };

  if (entityField.type.includes("LocalDate")) {
    imports.add("java.time.LocalDate");
  }
  if (entityField.type.includes("UUID")) {
    imports.add("java.util.UUID");
  }

  return dtoField;
}

function transformKotlinDto(
  dtoSpec: DtoSpecIR,
  entityIr: EntityIR,
  basePackage: string
): DtoIR {
  const dtoName = upperFirst(dtoSpec.name);
  const imports = new Set<string>();
  
  const potentialFields = new Map(entityIr.fields.map(f => [f.name, f]));
  let finalFields: KotlinField[] = [];

  // Handle include/exclude
  if (dtoSpec.include) {
    for (const fieldName of dtoSpec.include) {
        const entityField = potentialFields.get(fieldName);
        if (entityField) {
            finalFields.push(createDtoFieldFromEntityField(entityField, imports));
        }
    }
  } else if (dtoSpec.exclude) {
    const excludedSet = new Set(dtoSpec.exclude);
    for(const [fieldName, entityField] of potentialFields.entries()) {
        if (!excludedSet.has(fieldName)) {
            finalFields.push(createDtoFieldFromEntityField(entityField, imports));
        }
    }
  } else {
    for(const entityField of potentialFields.values()) {
        if (!entityField.isRelation) {
             finalFields.push(createDtoFieldFromEntityField(entityField, imports));
        }
    }
  }

  // Handle relations
  if (dtoSpec.relations) {
      for (const rel of dtoSpec.relations) {
          const entityRelationField = potentialFields.get(rel.field);
          if (!entityRelationField || !entityRelationField.isRelation) continue;

          let fieldType: string;
          let fieldName: string;

          if (rel.mode === "ID") {
              const idFieldType = entityRelationField.type.startsWith("List<") ? "List<Long>" : "Long";
              fieldType = idFieldType;
              fieldName = `${rel.field}Id`;
          } else { // EMBEDDED
              if (!rel.dtoRef) continue;
              const dtoRefName = upperFirst(rel.dtoRef);
              fieldType = entityRelationField.type.startsWith("List<") ? `List<${dtoRefName}>` : dtoRefName;
              fieldName = rel.field;
              imports.add(`${basePackage}.dto.${dtoRefName}`);
          }

          finalFields.push({
              name: fieldName,
              type: fieldType,
              isNullable: entityRelationField.isNullable,
              isMutable: false,
              annotations: [],
              isRelation: false,
          });
      }
  }

  return {
    packageName: `${basePackage}.dto`,
    className: dtoName,
    imports,
    annotations: [],
    type: "data class",
    fields: finalFields,
    functions: [],
  };
}

export function transformKotlinDtos(
  dtosSpec: DtoSpecIR[],
  entityIr: EntityIR,
  basePackage: string
): DtoIR[] {
  return dtosSpec.map(spec => transformKotlinDto(spec, entityIr, basePackage));
}
