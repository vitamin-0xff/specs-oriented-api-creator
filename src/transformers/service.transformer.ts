import {
  EntityIR,
  RepositoryIR,
  DtoIR,
  MapperIR,
  ServiceIR,
  JavaField,
  JavaMethod,
  JavaMethodParameter,
} from "../ir/java-spring-ir.ts";
import { FeatureIR, OperationIR } from "../parser/specs-validators.ts";
import { upperFirst, camelCase } from "../utils/capitalize.ts";

/**
 * Creates the service methods based on the operations defined in the feature spec.
 */
function createServiceMethods(
  featureSpec: FeatureIR,
  entityIr: EntityIR,
  repositoryIr: RepositoryIR,
  dtosIr: DtoIR[],
  mapperIr: MapperIR,
  imports: Set<string>
): JavaMethod[] {
  const methods: JavaMethod[] = [];
  const entityName = entityIr.className;
  const repoVar = camelCase(repositoryIr.className);
  const mapperVar = camelCase(mapperIr.className);

  for (const op of featureSpec.operations) {
    const params: JavaMethodParameter[] = [];
    let returnType = "void";
    
    // Determine return type
    if (op.output) {
        const outputDto = dtosIr.find(d => d.className === op.output);
        if (outputDto) {
            returnType = op.isArray ? `List<${outputDto.className}>` : outputDto.className;
            imports.add(`${outputDto.packageName}.${outputDto.className}`);
            if (op.isArray) {
                imports.add("java.util.List");
                imports.add("java.util.Collections");
            }
        }
    }

    // Determine parameters
    if (op.pathParams) {
        for (const p of op.pathParams) {
            params.push({ name: p.name, type: p.type });
            if (p.type === "UUID") {
                imports.add("java.util.UUID");
            }
        }
    }
    if (op.queryParams) {
        for (const p of op.queryParams) {
            params.push({ name: p.name, type: p.type });
        }
    }
     if (op.input) {
        const inputDto = dtosIr.find(d => d.className === op.input);
        if (inputDto) {
            params.push({ name: camelCase(inputDto.className), type: inputDto.className });
            imports.add(`${inputDto.packageName}.${inputDto.className}`);
        }
    }

    // Basic logic for method body generation (as comments for the template engine)
    let body = `// TODO: Implement business logic for ${op.name}\n`;
    if (op.method === "POST") {
        body += `// 1. Map DTO to entity: ${entityName} ${camelCase(entityName)} = ${mapperVar}.toEntity(${params[0].name});\n`;
        body += `// 2. Save entity: ${repoVar}.save(${camelCase(entityName)});\n`;
        body += `// 3. Map saved entity back to DTO and return\n`;
    } else if (op.method === "GET" && op.path.includes("{id}")) {
        body += `// 1. Fetch entity: ${repoVar}.findById(${params[0].name}).orElseThrow();\n`;
        body += `// 2. Map entity to DTO and return\n`;
    } else if (op.method === "PUT") {
        body += `// 1. Fetch existing entity by ID: ${entityName} existing${entityName} = ${repoVar}.findById(${params[0].name}).orElseThrow();\n`;
        body += `// 2. Update existing entity fields from DTO: ${mapperVar}.update${entityName}FromDto(${params[1].name}, existing${entityName});\n`;
        body += `// 3. Save updated entity: ${repoVar}.save(existing${entityName});\n`;
        body += `// 4. Map saved entity back to DTO and return\n`;
    } else if (op.method === "DELETE") {
        body += `// 1. Check if entity exists: ${repoVar}.findById(${params[0].name}).orElseThrow();\n`;
        body += `// 2. Delete entity by ID: ${repoVar}.deleteById(${params[0].name});\n`;
    }
     
    // Add placeholder return statement for compilable code
    if (returnType !== "void") {
        if (returnType.startsWith("List<")) {
            body += `return Collections.emptyList();`;
        } else {
            body += `return null;`;
        }
    }

    methods.push({
      name: op.name,
      returnType: returnType,
      accessModifier: "public",
      parameters: params,
      annotations: [], // Can add @Transactional(readOnly=true) for GETs etc.
      body: body,
    });
  }

  return methods;
}

/**
 * Transforms feature specs and component IRs into a Java/Spring-specific ServiceIR.
 */
export function transformService(
  featureSpec: FeatureIR,
  entityIr: EntityIR,
  repositoryIr: RepositoryIR,
  dtosIr: DtoIR[],
  mapperIr: MapperIR,
  basePackage: string
): ServiceIR {
  const serviceName = `${entityIr.className}Service`;
  const imports = new Set<string>();

  // Add default annotations
  imports.add("org.springframework.stereotype.Service");
  imports.add("org.springframework.transaction.annotation.Transactional");
  const annotations = [
      { name: "Service" },
      { name: "Transactional" },
  ];
  
  // Define dependencies
  const dependencies: JavaField[] = [];
  dependencies.push({
      name: camelCase(repositoryIr.className),
      type: repositoryIr.className,
      accessModifier: "private",
      keywords: ["final"], // Assuming constructor injection
      annotations: [],
      isRelation: false,
  });
  imports.add(`${repositoryIr.packageName}.${repositoryIr.className}`);
  
  dependencies.push({
      name: camelCase(mapperIr.className),
      type: mapperIr.className,
      accessModifier: "private",
      keywords: ["final"],
      annotations: [],
      isRelation: false,
  });
  imports.add(`${mapperIr.packageName}.${mapperIr.className}`);

  const methods = createServiceMethods(featureSpec, entityIr, repositoryIr, dtosIr, mapperIr, imports);

  // Add constructor for dependency injection
  const constructor: JavaMethod = {
      name: serviceName,
      returnType: "", // Constructors have no return type
      accessModifier: "public",
      parameters: dependencies.map(d => ({ name: d.name, type: d.type })),
      annotations: [{ name: "Autowired" }],
      body: dependencies.map(d => `this.${d.name} = ${d.name};`).join("\n"),
  };
  imports.add("org.springframework.beans.factory.annotation.Autowired");


  return {
    packageName: `${basePackage}.service`,
    className: serviceName,
    imports,
    annotations,
    accessModifier: "public",
    type: "class",
    fields: dependencies,
    methods: [constructor, ...methods],
    dependencies: dependencies,
  };
}
