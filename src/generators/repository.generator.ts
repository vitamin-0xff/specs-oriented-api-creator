import { FeatureIR, RepositoryOperationIR } from "../ir/index.ts";
import { repositoryTemplate } from "../templates/repository.template.ts";
import { ensureDir, writeTextFile } from "../utils/fs-utils.ts";

function mapRepoOpToMethod(op: RepositoryOperationIR, entityName: string): string {
  switch (op.type) {
    case "find":
      return `Optional<${entityName}> ${op.name}(${op.criteria
        .map((c) => `String ${c.field.name}`)
        .join(", ")});`;
    case "exists":
      return `boolean ${op.name}(${op.criteria
        .map((c) => `String ${c.field.name}`)
        .join(", ")});`;
    case "count":
      return `long ${op.name}(${op.criteria
        .map((c) => `String ${c.field.name}`)
        .join(", ")});`;
    case "delete":
      return `void ${op.name}(${op.criteria
        .map((c) => `String ${c.field.name}`)
        .join(", ")});`;
    default:
      return `// TODO: custom method ${op.name}`;
  }
}

export async function generateRepository(
  feature: FeatureIR,
  basePath: string,
  basePackage: string,
) {
  const entityName = feature.entity.name;
  const repositoryName = `${entityName}Repository`;

  const customMethods = feature.repositoryOperations.map((op) =>
    mapRepoOpToMethod(op, entityName)
  );

  const content = repositoryTemplate(
    basePackage,
    entityName,
    repositoryName,
    customMethods,
  );

  const dir = `${basePath}/repository`;
  await ensureDir(dir);

  const filePath = `${dir}/${repositoryName}.java`;
  await writeTextFile(filePath, content);

  console.log(`Generated repository: ${filePath}`);
}
