// src/transformers/kotlin/entity.transformer.ts

import {
  FeatureIR,
  FieldIR as SpecFieldIR,
  RelationIR as SpecRelationIR,
} from "../../parser/specs-validators.ts";
import {
  EntityIR,
  KotlinAnnotation,
  KotlinField,
} from "../../ir/kotlin-spring-ir.ts";
import { upperFirst } from "../../utils/capitalize.ts";

function mapSpecTypeToKotlinType(field: SpecFieldIR): string {
  switch (field.type) {
    case "String":
    case "Text":
      return "String";
    case "Integer":
      return "Int";
    case "Long":
      return "Long";
    case "Double":
      return "Double";
    case "Boolean":
      return "Boolean";
    case "Date":
      return "LocalDate";
    case "Enum":
      return `${upperFirst(field.name)}Enum`;
    case "Id":
      return field.concreteType === "UUID" ? "UUID" : "Long";
    default:
      throw new Error(`Unknown field type: ${field.type}`);
  }
}

function transformSpecField(field: SpecFieldIR, imports: Set<string>): KotlinField {
  const annotations: KotlinAnnotation[] = [];
  let isNullable = field.nullable ?? false;
  
  if (field.type === "Id") {
    annotations.push({ name: "Id" });
    const strategy = field.advanced?.generationStrategy || "AUTO";
    annotations.push({
      name: "GeneratedValue",
      properties: [`strategy = GenerationType.${strategy}`],
    });
    imports.add("javax.persistence.Id");
    imports.add("javax.persistence.GeneratedValue");
    imports.add("javax.persistence.GenerationType");
    isNullable = true; // IDs are nullable before being persisted
  } else {
    if (field.unique) {
      annotations.push({ name: "Column", properties: ["unique = true"] });
      imports.add("javax.persistence.Column");
    }
  }

  if (field.type === "Enum") {
    annotations.push({ name: "Enumerated", properties: ["EnumType.STRING"] });
    imports.add("javax.persistence.Enumerated");
    imports.add("javax.persistence.EnumType");
  }

  if (field.type === "Date") {
    imports.add("java.time.LocalDate");
  }
  
  if (field.type === "Id" && field.concreteType === "UUID") {
    imports.add("java.util.UUID");
  }

  return {
    name: field.name,
    type: mapSpecTypeToKotlinType(field),
    isNullable: isNullable,
    isMutable: true, // `var` for JPA compatibility
    annotations,
    isRelation: false,
  };
}

function transformSpecRelation(relation: SpecRelationIR, imports: Set<string>): KotlinField {
  const annotations: KotlinAnnotation[] = [];
  const { type, fetch, cascade, mappedBy, name, targetEntity } = relation;

  annotations.push({ name: type });
  imports.add(`javax.persistence.${type}`);

  const annotationProperties: string[] = [];
  if (mappedBy) {
    annotationProperties.push(`mappedBy = "${mappedBy}"`);
  }
  if (fetch) {
    annotationProperties.push(`fetch = FetchType.${fetch}`);
    imports.add("javax.persistence.FetchType");
  }
  if (cascade && cascade.length > 0) {
    const cascadeString = cascade.map(c => `CascadeType.${c}`).join(", ");
    annotationProperties.push(`cascade = [${cascadeString}]`); // Kotlin array syntax
    imports.add("javax.persistence.CascadeType");
  }

  if (annotationProperties.length > 0) {
    annotations[0].properties = annotationProperties;
  }

  let kotlinType = upperFirst(targetEntity);
  if (type === "OneToMany" || type === "ManyToMany") {
    kotlinType = `List<${kotlinType}>`;
  }

  return {
    name: name,
    type: kotlinType,
    isNullable: relation.optional ?? false,
    isMutable: true,
    annotations,
    isRelation: true,
    relationTargetEntity: upperFirst(targetEntity),
  };
}

export function transformKotlinEntity(
  feature: FeatureIR,
  basePackage: string
): EntityIR {
  const entityName = upperFirst(feature.name);
  const imports = new Set<string>();
  const entityAnnotations: KotlinAnnotation[] = [];

  entityAnnotations.push({ name: "Entity" });
  imports.add("javax.persistence.Entity");

  const tableName = feature.tableName || `${feature.name.toLowerCase()}s`;
  entityAnnotations.push({ name: "Table", properties: [`name = "${tableName}"`] });
  imports.add("javax.persistence.Table");

  const fields = feature.fields.map((f) => transformSpecField(f as SpecFieldIR, imports));
  const relations = feature.relations?.map((r) => transformSpecRelation(r, imports)) ?? [];
  
  const allFields = [...fields, ...relations];

  const idField = allFields.find(f => f.annotations.some(a => a.name === "Id"));
  if (!idField) {
    throw new Error(`Feature ${feature.name} must have exactly one Id field`);
  }

  return {
    packageName: `${basePackage}.domain`,
    className: entityName,
    imports,
    annotations: entityAnnotations,
    type: "data class",
    fields: allFields,
    functions: [],
    tableName: tableName,
    idField: idField,
  };
}
