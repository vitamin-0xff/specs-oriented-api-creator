// src/utils/template.ts

/**
 * Generates a Java package declaration.
 */
export function generatePackage(packageName: string): string {
  return `package ${packageName};

`;
}

/**
 * Generates Java import statements.
 */
export function generateImports(imports: Set<string>): string {
  if (imports.size === 0) {
    return "";
  }
  const sortedImports = Array.from(imports).sort();
  return sortedImports.map((i) => `import ${i};`).join("\n") + "\n\n";
}

/**
 * Generates Java annotations.
 */
import { JavaAnnotation } from "../ir/java-spring-ir.ts";
export function generateAnnotations(annotations: JavaAnnotation[]): string {
  if (annotations.length === 0) {
    return "";
  }
  return annotations
    .map((anno) => {
      if (anno.properties && anno.properties.length > 0) {
        return `@${anno.name}(${anno.properties.join(', ')})`;
      }
      return `@${anno.name}`;
    })
    .join("\n") + "\n";
}

/**
 * Generates a Java field declaration.
 */
import { JavaField } from "../ir/java-spring-ir.ts";
export function generateField(field: JavaField): string {
  const annotations = generateAnnotations(field.annotations);
  const keywords = field.keywords ? field.keywords.join(" ") + " " : "";
  return `${annotations}  ${field.accessModifier} ${keywords}${field.type} ${field.name};
`;
}

/**
 * Generates a Java method declaration and body.
 */
import { JavaMethod } from "../ir/java-spring-ir.ts";
export function generateMethod(method: JavaMethod): string {
  const annotations = generateAnnotations(method.annotations);
  const parameters = method.parameters
    .map((p) => {
        const paramAnnotations = generateAnnotations(p.annotations || []);
        // Remove trailing newline from paramAnnotations if present for inline use
        const cleanedParamAnnotations = paramAnnotations.endsWith('\n') ? paramAnnotations.slice(0, -1) : paramAnnotations;
        return `${cleanedParamAnnotations} ${p.type} ${p.name}`;
    })
    .join(", ");

  const returnType = method.returnType ? `${method.returnType} ` : "";
  const body = method.body ? `    ${method.body.replace(/\n/g, '\n    ')}
` : ""; // Indent body

  // For constructor, method.returnType will be empty, so no space needed
  const methodSignature = method.returnType
    ? `${method.accessModifier} ${returnType}${method.name}(${parameters})` 
    : `${method.accessModifier} ${method.name}(${parameters})`;


  return `${annotations}  ${methodSignature} {
${body}  }
`;
}
