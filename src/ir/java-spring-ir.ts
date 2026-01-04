/**
 * This file defines the Intermediate Representation (IR) for generating
 * Java Spring Boot applications. The IR is a language-specific data structure
 * derived from the generic spec, containing all the necessary details
 * for the final code generation templates.
 */

// ==================================
// General & Common IR Interfaces
// ==================================

export interface JavaAnnotation {
  name: string;
  // e.g., @Table(name = "users") -> properties = ['name = "users"']
  properties?: string[];
}

export interface JavaField {
  name: string;
  type: string; // Java type, e.g., "String", "Long", "List<Post>"
  annotations: JavaAnnotation[];
  keywords?: string[]; // e.g., ["final", "static"]
  accessModifier: "public" | "private" | "protected";
  isRelation: boolean;
  // For relations, the name of the target entity class
  relationTargetEntity?: string;
}

export interface JavaMethodParameter {
  name: string;
  type: string;
  annotations?: JavaAnnotation[];
}

export interface JavaMethod {
  name:string;
  returnType: string;
  accessModifier: "public" | "private" | "protected";
  parameters: JavaMethodParameter[];
  annotations: JavaAnnotation[];
  // The actual method body will be generated in the template
  // but we can have placeholders or logic hints here if needed.
  body?: string;
}

export interface JavaClass {
  packageName: string;
  className: string;
  imports: Set<string>; // Use a Set to avoid duplicate imports
  annotations: JavaAnnotation[];
  accessModifier: "public" | "private";
  type: "class" | "interface";
  fields: JavaField[];
  methods: JavaMethod[];
}

// ==================================
// Component-Specific IR Interfaces
// ==================================

/**
 * IR for a JPA Entity
 */
export interface EntityIR extends JavaClass {
  type: "class";
  tableName: string;
  idField: JavaField; // For easy access to the primary key
}

/**
 * IR for a Spring Data JPA Repository
 */
export interface RepositoryIR extends JavaClass {
  type: "interface";
  // e.g., "JpaRepository<User, Long>"
  extends: string;
  entity: EntityIR; // A reference to the entity this repository manages
}

/**
 * IR for a DTO class
 */
export interface DtoIR extends JavaClass {
  type: "class";
  // DTOs are simple data carriers, so they primarily have fields.
  // Methods are typically just getters/setters, often handled by Lombok.
}

/**
 * IR for a Mapper class (e.g., using MapStruct)
 */
export interface MapperIR extends JavaClass {
  type: "interface"; // For MapStruct, mappers are interfaces
  annotations: [
    { name: "Mapper", properties: ["componentModel = \"spring\""] },
    ...JavaAnnotation[]
  ];
  // Methods will define the mappings, e.g., "UserDTO toDto(User user);"
}

/**
 * IR for a Spring Service class
 */
export interface ServiceIR extends JavaClass {
  type: "class";
  dependencies: JavaField[]; // e.g., UserRepository, UserMapper
}

/**
 * IR for a Spring RestController class
 */
export interface ControllerIR extends JavaClass {
  type: "class";
  // The base path for all endpoints in this controller
  basePath: string;
  dependencies: JavaField[]; // e.g., UserService
}

/**
 * The root of our Java/Spring IR.
 * It contains all the generated components for a single feature.
 */
export interface SpringFeatureIR {
  featureName: string;
  basePackage: string;
  entity: EntityIR;
  repository: RepositoryIR;
  dtos: DtoIR[];
  mapper: MapperIR;
  service: ServiceIR;
  controller: ControllerIR;
}
