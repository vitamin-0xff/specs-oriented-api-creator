export function controllerTemplate(
  packageName: string,
  entityName: string,
  serviceName: string,
  controllerName: string,
  basePath: string,
  endpoints: {
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    serviceMethod: string;
    params: string;
    fieldNames: string;
    requestBody: boolean;
  }[],
  defaultRoles: string[],
): string {
  const serviceVar = serviceName.charAt(0).toLowerCase() + serviceName.slice(1);

  const methodsStr = endpoints
    .map((e) => {
      const mappingAnnotation = {
        GET: "@GetMapping",
        POST: "@PostMapping",
        PUT: "@PutMapping",
        DELETE: "@DeleteMapping",
      }[e.method];

      const paramsStr = e.requestBody ? `@RequestBody ${entityName} body` : e.params;
      const callParams = e.requestBody ? "body" : e.fieldNames;

      // Add role annotation if defaultRoles are present
      const rolesAnnotation =
        defaultRoles.length > 0
          ? `@PreAuthorize("hasAnyRole(${defaultRoles.map((r) => `\\"${r}\\"`).join(", ")})")`
          : "";

      return `    ${rolesAnnotation}
    ${mappingAnnotation}("${e.path}")
    public ${entityName} ${e.serviceMethod}(${paramsStr}) {
        return ${serviceVar}.${e.serviceMethod}(${callParams});
    }`;
    })
    .join("\n\n");

  return `package ${packageName}.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import ${packageName}.domain.${entityName};
import ${packageName}.service.${serviceName};

@RestController
@RequestMapping("${basePath}")
public class ${controllerName} {

    private final ${serviceName} ${serviceVar};

    @Autowired
    public ${controllerName}(${serviceName} ${serviceVar}) {
        this.${serviceVar} = ${serviceVar};
    }

${methodsStr}
}`;
}
