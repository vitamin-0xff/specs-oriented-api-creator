export function entityTemplate(
  packageName: string,
  entityName: string,
  tableName: string,
  fields: {
    name: string;
    type: string;
    annotation?: string;
  }[],
): string {
  const imports = new Set<string>();
  imports.add("javax.persistence.*");

  // Determine additional imports
  for (const field of fields) {
    if (field.type === "LocalDate" || field.type === "LocalDateTime") {
      imports.add("java.time.*");
    }
  }

  const importsStr = Array.from(imports)
    .map((i) => `import ${i};`)
    .join("\n");

  const fieldsStr = fields
    .map((f) => {
      const ann = f.annotation ? `${f.annotation}\n    ` : "";
      return `    ${ann}private ${f.type} ${f.name};`;
    })
    .join("\n");

  return `package ${packageName}.domain;

${importsStr}

@Entity
@Table(name = "${tableName}")
public class ${entityName} {

${fieldsStr}

    // Getters and Setters
}`;
}
