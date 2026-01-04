import { FeatureIR, FieldIR } from "../ir/index.ts";
import { entityTemplate } from "../templates/entity.template.ts";
import { ensureDir, writeTextFile } from "../utils/fs-utils.ts";

export async function generateEntity(
  feature: FeatureIR,
  basePath: string,
  basePackage: string,
) {
  const entity = feature.entity;

  // Map field types to Java types
  const mapType = (f: FieldIR): string => {
    if (typeof f.type === "string") {
      switch (f.type) {
        case "string":
          return "String";
        case "long":
          return "Long";
        case "int":
          return "Integer";
        case "double":
          return "Double";
        case "boolean":
          return "Boolean";
        case "date":
          return "LocalDate";
        case "datetime":
          return "LocalDateTime";
      }
    } else if ("reference" in f.type) {
      return f.type.reference.targetEntity;
    }
    return "Object";
  };

  const fields = entity.fields.map((f) => ({
    name: f.name,
    type: mapType(f),
    annotation: (f as any).annotation ?? "",
  }));

  const content = entityTemplate(
    basePackage,
    entity.name,
    entity.tableName,
    fields,
  );

  // Determine file path
  const dir = `${basePath}/domain`;
  await ensureDir(dir);

  const filePath = `${dir}/${entity.name}.java`;
  await writeTextFile(filePath, content);

  console.log(`Generated entity: ${filePath}`);
}
