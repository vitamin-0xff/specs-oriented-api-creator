// src/generators/kotlin/enum.generator.ts

import { FieldIR } from "../../parser/specs-validators.ts";
import { upperFirst } from "../../utils/capitalize.ts";
import { generatePackage } from "../../utils/template.kt.ts";

export function generateKotlinEnum(
  field: FieldIR,
  basePackage: string
): { code: string; className: string; packageName: string } | null {
  if (field.type !== "Enum" || !field.values) {
    return null;
  }

  const className = `${upperFirst(field.name)}Enum`;
  const packageName = `${basePackage}.domain.enums`;
  const packageCode = generatePackage(packageName);

  const values = field.values.join(",\n  ");

  const code = `${packageCode}enum class ${className} {
  ${values}
}`;

  return { code, className, packageName };
}
