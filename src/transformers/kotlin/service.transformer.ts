// src/transformers/kotlin/service.transformer.ts

import {
  EntityIR,
  RepositoryIR,
  DtoIR,
  MapperIR,
  ServiceIR,
  KotlinField,
  KotlinFunction,
  KotlinParameter,
} from "../../ir/kotlin-spring-ir.ts";
import { FeatureIR } from "../../parser/specs-validators.ts";
import { camelCase } from "../../utils/capitalize.ts";

function createServiceFunctions(
  featureSpec: FeatureIR,
  repositoryIr: RepositoryIR,
  dtosIr: DtoIR[],
  mapperIr: MapperIR,
  imports: Set<string>
): KotlinFunction[] {
  const functions: KotlinFunction[] = [];
  const repoVar = camelCase(repositoryIr.className);
  const mapperVar = camelCase(mapperIr.className);

  for (const op of featureSpec.operations) {
    const params: KotlinParameter[] = [];
    let returnType = "Unit";
    
    if (op.output) {
        const outputDto = dtosIr.find(d => d.className === op.output);
        if (outputDto) {
            returnType = op.isArray ? `List<${outputDto.className}>` : outputDto.className;
            imports.add(`${outputDto.packageName}.${outputDto.className}`);
        }
    }

    if (op.pathParams) {
        for (const p of op.pathParams) {
            params.push({ name: p.name, type: p.type, isNullable: false });
            if (p.type === "UUID") imports.add("java.util.UUID");
        }
    }
    if (op.queryParams) {
        for (const p of op.queryParams) {
            params.push({ name: p.name, type: p.type, isNullable: !(p.required ?? true) });
        }
    }
    if (op.input) {
        const inputDto = dtosIr.find(d => d.className === op.input);
        if (inputDto) {
            params.push({ name: camelCase(inputDto.className), type: inputDto.className, isNullable: false });
            imports.add(`${inputDto.packageName}.${inputDto.className}`);
        }
    }

    // Placeholder body
    let body = "// TODO: Implement business logic for ${op.name}\n";
    if (returnType !== "Unit") {
        body += `throw NotImplementedError("Method not implemented")`;
    }

    functions.push({
      name: op.name,
      returnType: returnType,
      isSuspend: true, // Assume all service methods are suspend functions
      parameters: params,
      annotations: [],
      body: body,
    });
  }

  return functions;
}

export function transformKotlinService(
  featureSpec: FeatureIR,
  entityIr: EntityIR,
  repositoryIr: RepositoryIR,
  dtosIr: DtoIR[],
  mapperIr: MapperIR,
  basePackage: string
): ServiceIR {
  const serviceName = `${entityIr.className}Service`;
  const imports = new Set<string>();

  imports.add("org.springframework.stereotype.Service");
  imports.add("org.springframework.transaction.annotation.Transactional");
  
  const repoDep: KotlinField = {
      name: camelCase(repositoryIr.className),
      type: repositoryIr.className,
      isMutable: false,
      isNullable: false,
      annotations: [],
      isRelation: false
  };
  imports.add(`${repositoryIr.packageName}.${repositoryIr.className}`);
  
  const mapperDep: KotlinField = {
      name: camelCase(mapperIr.className),
      type: mapperIr.className,
      isMutable: false,
      isNullable: false,
      annotations: [],
      isRelation: false
  };
  imports.add(`${mapperIr.packageName}.${mapperIr.className}`);

  const dependencies = [repoDep, mapperDep];
  const functions = createServiceFunctions(featureSpec, repositoryIr, dtosIr, mapperIr, imports);

  return {
    packageName: `${basePackage}.service`,
    className: serviceName,
    imports,
    annotations: [{ name: "Service" }, { name: "Transactional" }],
    type: "class",
    // Constructor properties are also fields
    fields: dependencies.map(d => ({...d, name: `private val ${d.name}`})),
    functions: functions,
    dependencies: dependencies,
  };
}
