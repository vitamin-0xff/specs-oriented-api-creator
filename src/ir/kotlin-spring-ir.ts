/**
 * This file defines the Intermediate Representation (IR) for generating
 * Kotlin Spring Boot applications.
 */

// ================================== 
// General & Common IR Interfaces
// ================================== 

export interface KotlinAnnotation {
  name: string;
  // e.g., @Table(name = "users") -> properties = ['name = "users"']
  properties?: string[];
}

export interface KotlinField {
  name: string;
  type: string; // Kotlin type, e.g., "String", "Long", "List<Post>"
  isNullable: boolean;
  isMutable: boolean; // val vs var
  defaultValue?: string;
  annotations: KotlinAnnotation[];
  isRelation: boolean;
  relationTargetEntity?: string;
}

export interface KotlinParameter {
  name: string;
  type: string;
  isNullable: boolean;
  annotations?: KotlinAnnotation[];
  defaultValue?: string;
}

export interface KotlinFunction {
  name: string;
  returnType: string;
  isSuspend: boolean;
  parameters: KotlinParameter[];
  annotations: KotlinAnnotation[];
  body?: string;
}

export interface KotlinClass {
  packageName: string;
  className: string;
  imports: Set<string>;
  annotations: KotlinAnnotation[];
  type: "class" | "interface" | "data class";
  fields: KotlinField[];
  functions: KotlinFunction[];
}

// ================================== 
// Component-Specific IR Interfaces
// ================================== 

export interface EntityIR extends KotlinClass {
  type: "data class";
  tableName: string;
  idField: KotlinField;
}

export interface RepositoryIR extends KotlinClass {
  type: "interface";
  extends: string; // e.g., "JpaRepository<User, UUID>"
  entity: EntityIR;
}

export interface DtoIR extends KotlinClass {
  type: "data class";
}

export interface MapperIR extends KotlinClass {
  type: "interface"; // For MapStruct
  annotations: [
    { name: "Mapper", properties: ["componentModel = \"spring\""] },
    ...KotlinAnnotation[]
  ];
}

export interface ServiceIR extends KotlinClass {
  type: "class";
  dependencies: KotlinField[];
}

export interface ControllerIR extends KotlinClass {
  type: "class";
  basePath: string;
  dependencies: KotlinField[];
}

export interface SpringKotlinFeatureIR {
  featureName: string;
  basePackage: string;
  entity: EntityIR;
  repository: RepositoryIR;
  dtos: DtoIR[];
  mapper: MapperIR;
  service: ServiceIR;
  controller: ControllerIR;
}
