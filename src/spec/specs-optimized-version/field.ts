// Base interface
export interface FieldIRBase {
  name: string;
  type: string;
  nullable?: boolean;
  unique?: boolean;
}

// Advanced options shared by all field types
export interface BaseAdvancedFieldOptions {
  index?: boolean;
  customAnnotation?: string;
  description?: string;
}

// Advanced options per type
export interface StringFieldAdvancedOptions extends BaseAdvancedFieldOptions {
  validation?: { regex?: string; length?: number; minLength?: number; maxLength?: number };
  defaultValue?: string;
}

export interface NumberFieldAdvancedOptions extends BaseAdvancedFieldOptions {
  validation?: { min?: number; max?: number };
  defaultValue?: number;
}

export interface DateFieldAdvancedOptions extends BaseAdvancedFieldOptions {
  format?: string;
  defaultValue?: "CURRENT_TIMESTAMP" | string;
}

export interface BooleanFieldAdvancedOptions extends BaseAdvancedFieldOptions {
  defaultValue?: boolean;
}

export interface IdFieldAdvancedOptions extends BaseAdvancedFieldOptions {
  generationStrategy: "AUTO" | "IDENTITY" | "SEQUENCE" | "UUID";
}

// -----------------------
// Specialized Field Types
// -----------------------

// String-based fields: String, Text, Enum
export interface StringBasedFieldIR extends FieldIRBase {
  type: "String" | "Text" | "Enum";
  advanced?: StringFieldAdvancedOptions;
}

export interface EnumFieldIR extends StringBasedFieldIR {
  type: "Enum";
  values: string[];
  advanced?: StringFieldAdvancedOptions;
}

// Number-based fields
export interface NumberBasedFieldIR extends FieldIRBase {
  type: "Integer" | "Long" | "Double";
  advanced?: NumberFieldAdvancedOptions;
}

// Date-based fields
export interface DateBasedFieldIR extends FieldIRBase {
  type: "Date";
  advanced?: DateFieldAdvancedOptions;
}

// ID-based fields
export interface IdBasedFieldIR extends FieldIRBase {
  type: "Id";
  concreteType: "Long" | "UUID";
  advanced: IdFieldAdvancedOptions;
}

// Boolean-based fields
export interface BooleanBasedFieldIR extends FieldIRBase {
  type: "Boolean";
  advanced?: BooleanFieldAdvancedOptions;
}

// Base Relation interface
export type CascadeOption = 
  | "ALL"
  | "PERSIST"
  | "MERGE"
  | "REMOVE"
  | "REFRESH"
  | "DETACH";

export interface RelationIRBase {
  name: string;                 // property name in this entity
  type: "OneToOne" | "OneToMany" | "ManyToOne" | "ManyToMany";
  targetEntity: string;          // the other feature/entity
  description?: string;          // optional documentation
  customAnnotation?: string;     // optional custom annotation
  fetch?: "LAZY" | "EAGER";     // optional fetch strategy
  cascade?: CascadeOption[];            // optional cascade options
  optional?: boolean;            // is this relation optional
}

// Parent relation
export interface ParentRelationIR extends RelationIRBase {
  kind: "Parent";
  // property in child pointing back to this parent
  mappedBy?: string;
}

// Child relation
export interface ChildRelationIR extends RelationIRBase {
  kind: "Child";
  // child usually references parent
  mappedBy?: string;             // property in parent pointing to this child
}

