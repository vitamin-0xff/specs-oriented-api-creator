// src/utils/template.kt.ts

import { KotlinAnnotation, KotlinField, KotlinFunction, KotlinParameter } from "../ir/kotlin-spring-ir.ts";

export function generatePackage(packageName: string): string {
  return `package ${packageName}\n\n`;
}

export function generateImports(imports: Set<string>): string {
  if (imports.size === 0) return "";
  return Array.from(imports).sort().map(i => `import ${i}`).join("\n") + "\n\n";
}

export function generateAnnotations(annotations: KotlinAnnotation[], indent: string = ""): string {
  if (annotations.length === 0) return "";
  return annotations.map(anno => {
    if (anno.properties && anno.properties.length > 0) {
      return `${indent}@${anno.name}(${anno.properties.join(", ")})`;
    }
    return `${indent}@${anno.name}`;
  }).join("\n") + "\n";
}

export function generateField(field: KotlinField): string {
  const keyword = field.isMutable ? "var" : "val";
  const nullableMarker = field.isNullable ? "?" : "";
  const annotations = generateAnnotations(field.annotations, "  ");
  return `${annotations}  ${keyword} ${field.name}: ${field.type}${nullableMarker},`;
}

export function generateFunction(func: KotlinFunction): string {
  const annotations = generateAnnotations(func.annotations, "  ");
  const suspend = func.isSuspend ? "suspend " : "";
  const parameters = func.parameters.map(p => {
    const paramAnnotations = p.annotations ? generateAnnotations(p.annotations).trim() + " " : "";
    const nullableMarker = p.isNullable ? "?" : "";
    return `${paramAnnotations}${p.name}: ${p.type}${nullableMarker}`;
  }).join(", ");
  
  const body = func.body ? `\n    ${func.body.replace(/\n/g, '\n    ')}\n  ` : "";

  return `${annotations}  ${suspend}fun ${func.name}(${parameters}): ${func.returnType} {${body}}`;
}
