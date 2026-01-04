import { FeatureIR } from "../ir/index.ts";
import { serviceTemplate } from "../templates/service.template.ts";
import { ensureDir, writeTextFile } from "../utils/fs-utils.ts";

export async function generateService(
  feature: FeatureIR,
  basePath: string,
  basePackage: string,
) {
  const entityName = feature.entity.name;
  const repositoryName = `${entityName}Repository`;
  const serviceName = `${entityName}Service`;

  const repoVar = repositoryName.charAt(0).toLowerCase() + repositoryName.slice(1);

  const methods = feature.serviceMethods.map((m) => {
    const repoMethod = m.repositoryOperation.name;
    const params = m.repositoryOperation.criteria
      .map((c) => `${c.field.type === "Long" ? "Long" : "String"} ${c.field.name}`)
      .join(", ");
    return { name: m.name, repositoryMethod: repoMethod, params, repoVar };
  });

  const content = serviceTemplate(basePackage, entityName, repositoryName, serviceName, repoVar, methods);

  const dir = `${basePath}/service`;
  await ensureDir(dir);

  const filePath = `${dir}/${serviceName}.java`;
  await writeTextFile(filePath, content);

  console.log(`Generated service: ${filePath}`);
}
