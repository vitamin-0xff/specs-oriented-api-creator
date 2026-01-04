import { FeatureIR } from "../ir/index.ts";
import { controllerTemplate } from "../templates/controller.template.ts";
import { ensureDir, writeTextFile } from "../utils/fs-utils.ts";

export async function generateController(
    feature: FeatureIR,
    basePath: string,
    basePackage: string,
) {
    const entityName = feature.entity.name;
    const serviceName = `${entityName}Service`;
    const controllerName = `${entityName}Controller`;
    const baseMapping = `/${feature.name.toLowerCase()}s`;

    const endpoints = feature.endpoints.map((e) => ({
        method: e.method,
        path: e.path,           // from EndpointIR
        serviceMethod: e.serviceMethod.name,
        params: e.serviceMethod.repositoryOperation.criteria
            .map((c) => `${c.field.type === "Long" ? "Long" : "String"} ${c.field.name}`)
            .join(", "),
        fieldNames: e.serviceMethod.repositoryOperation.criteria.map((c) => c.field.name).join(", "),
        requestBody: e.requestBody ?? (e.method === "POST" || e.method === "PUT"),
    }));

    const content = controllerTemplate(
        basePackage,
        entityName,
        serviceName,
        controllerName,
        baseMapping,
        endpoints,
        feature.defaultRoles ?? [],
    );

    const dir = `${basePath}/controller`;
    await ensureDir(dir);

    const filePath = `${dir}/${controllerName}.java`;
    await writeTextFile(filePath, content);

    console.log(`Generated controller: ${filePath}`);
}
