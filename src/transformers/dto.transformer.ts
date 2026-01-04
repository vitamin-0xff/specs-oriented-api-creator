import { DtoIR, EntityIR, JavaField } from "../ir/java-spring-ir.ts";
import { DtoSpecIR } from "../parser/specs-validators.ts";
import { upperFirst } from "../utils/capitalize.ts";

/**
 * Creates a JavaField for a DTO based on a field from the EntityIR.
 */
function createDtoFieldFromEntityField(
  entityField: JavaField,
  imports: Set<string>
): JavaField {
  // DTO fields are simple: private, no annotations
  const dtoField: JavaField = {
    name: entityField.name,
    type: entityField.type,
    accessModifier: "private",
    annotations: [],
    isRelation: entityField.isRelation,
    relationTargetEntity: entityField.relationTargetEntity,
  };

  // Add necessary imports for the field type
  if (entityField.type.includes("LocalDate")) {
    imports.add("java.time.LocalDate");
  }
  if (entityField.type.includes("UUID")) {
    imports.add("java.util.UUID");
  }
   if (entityField.type.startsWith("List<")) {
    imports.add("java.util.List");
  }

  return dtoField;
}

/**
 * Transforms a generic DTO specification into a Java/Spring-specific DtoIR.
 */
function transformDto(
  dtoSpec: DtoSpecIR,
  entityIr: EntityIR,
  basePackage: string
): DtoIR {
  const dtoName = upperFirst(dtoSpec.name);
  const imports = new Set<string>();
  
  // Add Lombok annotations for boilerplate-free DTOs
  imports.add("lombok.Data");
  imports.add("lombok.NoArgsConstructor");
  imports.add("lombok.AllArgsConstructor");

  const annotations = [
      { name: "Data" },
      { name: "NoArgsConstructor" },
      { name: "AllArgsConstructor" },
  ];

  let potentialFields = new Map(entityIr.fields.map(f => [f.name, f]));
  let finalFields: JavaField[] = [];

  // 1. Handle include/exclude
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
    // If neither include nor exclude is specified, include all non-relation fields by default
    for(const entityField of potentialFields.values()) {
        if (!entityField.isRelation) {
             finalFields.push(createDtoFieldFromEntityField(entityField, imports));
        }
    }
  }

  // 2. Handle relations
  if (dtoSpec.relations) {
      for (const rel of dtoSpec.relations) {
          const entityRelationField = potentialFields.get(rel.field);
          if (!entityRelationField || !entityRelationField.isRelation) continue;

          let fieldType: string;
          let fieldName: string;

          if (rel.mode === "ID") {
              const idFieldType = entityRelationField.type.startsWith("List<") ? `List<Long>` : "Long";
              fieldType = idFieldType;
              fieldName = `${rel.field}Id`;
              if (idFieldType.startsWith("List")) {
                  imports.add("java.util.List");
              }
          } else { // EMBEDDED
              if (!rel.dtoRef) continue; // This should be caught by parser validation
              const dtoRefName = upperFirst(rel.dtoRef);
              fieldType = entityRelationField.type.startsWith("List<") ? `List<${dtoRefName}>` : dtoRefName;
              fieldName = rel.field;
              if (fieldType.startsWith("List")) {
                  imports.add("java.util.List");
              }
              // Assuming the embedded DTO is in the same package
              imports.add(`${basePackage}.dto.${dtoRefName}`);
          }

          finalFields.push({
              name: fieldName,
              type: fieldType,
              accessModifier: "private",
              annotations: [],
              isRelation: false, // In the DTO, it's just a field
          });
      }
  }


  return {
    packageName: `${basePackage}.dto`,
    className: dtoName,
    imports,
    annotations,
    accessModifier: "public",
    type: "class",
    fields: finalFields,
    methods: [],
  };
}

/**
 * Transforms an array of DTO specifications into an array of DtoIRs.
 */
export function transformDtos(
  dtosSpec: DtoSpecIR[],
  entityIr: EntityIR,
  basePackage: string
): DtoIR[] {
  return dtosSpec.map(spec => transformDto(spec, entityIr, basePackage));
}
