// src/transformers/kotlin/controller.transformer.ts

import {
  ControllerIR,
  ServiceIR,
  DtoIR,
  KotlinFunction,
  KotlinParameter,
} from "../../ir/kotlin-spring-ir.ts";
import { FeatureIR } from "../../parser/specs-validators.ts";
import { camelCase, upperFirst } from "../../utils/capitalize.ts";

function createControllerFunctions(
  featureSpec: FeatureIR,
  serviceIr: ServiceIR,
  dtosIr: DtoIR[],
  imports: Set<string>
): KotlinFunction[] {
  const functions: KotlinFunction[] = [];
  const serviceVar = camelCase(serviceIr.className);
  const pluralizedFeatureName = `${featureSpec.name.toLowerCase()}s`;

  for (const op of featureSpec.operations) {
    const params: KotlinParameter[] = [];
    let returnDtoName = "Unit";
    
    if (op.output) {
        const outputDto = dtosIr.find(d => d.className === op.output);
        if (outputDto) {
            returnDtoName = op.isArray ? `List<${outputDto.className}>` : outputDto.className;
            imports.add(`${outputDto.packageName}.${outputDto.className}`);
        }
    }
    const returnType = `ResponseEntity<${returnDtoName}>`;
    imports.add("org.springframework.http.ResponseEntity");

    let methodPath = op.path;
    if (methodPath.startsWith(`/${pluralizedFeatureName}`)) {
        methodPath = methodPath.substring(`/${pluralizedFeatureName}`.length);
    }
    if (methodPath === "") {
        methodPath = "/";
    }

    const httpMethodAnnotation = { name: `${upperFirst(op.method.toLowerCase())}Mapping`, properties: [`"${methodPath}"`] };
    imports.add(`org.springframework.web.bind.annotation.${httpMethodAnnotation.name}`);

    if (op.pathParams) {
        for (const p of op.pathParams) {
            imports.add("org.springframework.web.bind.annotation.PathVariable");
            params.push({ name: p.name, type: p.type, isNullable: false, annotations: [{ name: "PathVariable", properties: [`"${p.name}"`] }] });
            if (p.type === "UUID") imports.add("java.util.UUID");
        }
    }
    if (op.queryParams) {
        for (const p of op.queryParams) {
            imports.add("org.springframework.web.bind.annotation.RequestParam");
            params.push({ name: p.name, type: p.type, isNullable: !(p.required ?? true), annotations: [{ name: "RequestParam", properties: [`"${p.name}"`] }] });
        }
    }
    if (op.input) {
        const inputDto = dtosIr.find(d => d.className === op.input);
        if (inputDto) {
            imports.add("org.springframework.web.bind.annotation.RequestBody");
            imports.add(`${inputDto.packageName}.${inputDto.className}`);
            params.push({ name: camelCase(inputDto.className), type: inputDto.className, isNullable: false, annotations: [{ name: "RequestBody" }] });
        }
    }
    
    const serviceCallParams = params.map(p => p.name).join(", ");
    const body = `return ResponseEntity.ok(${serviceVar}.${op.name}(${serviceCallParams}))`;

    functions.push({
      name: op.name,
      returnType: returnType,
      isSuspend: true,
      parameters: params,
      annotations: [httpMethodAnnotation],
      body: body,
    });
  }

  return functions;
}

export function transformKotlinController(
  featureSpec: FeatureIR,
  serviceIr: ServiceIR,
  dtosIr: DtoIR[],
  basePackage: string
): ControllerIR {
  const controllerName = `${serviceIr.className.replace("Service", "")}Controller`;
  const imports = new Set<string>();

  imports.add("org.springframework.web.bind.annotation.RestController");
  imports.add("org.springframework.web.bind.annotation.RequestMapping");
  
  const basePath = `/api/v1/${featureSpec.name.toLowerCase()}s`;
  
  const dependencies = [{
      name: camelCase(serviceIr.className),
      type: serviceIr.className,
      isMutable: false,
      isNullable: false,
      annotations: [],
      isRelation: false,
  }];
  imports.add(`${serviceIr.packageName}.${serviceIr.className}`);

  const functions = createControllerFunctions(featureSpec, serviceIr, dtosIr, imports);

  return {
    packageName: `${basePackage}.controller`,
    className: controllerName,
    imports,
    annotations: [
      { name: "RestController" },
      { name: "RequestMapping", properties: [`"${basePath}"`] },
    ],
    type: "class",
    fields: dependencies.map(d => ({...d, name: `private val ${d.name}`})),
    functions: functions,
    basePath: basePath,
    dependencies: dependencies,
  };
}
