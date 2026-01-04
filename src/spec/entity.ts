export type PrimitiveFieldType =
  | "string"
  | "int"
  | "long"
  | "double"
  | "boolean"
  | "date"
  | "datetime";

  export interface EnumType {
    name: string;
    values: string[];
  }

export type ReferenceCardinality =
  | "one-to-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many";

export interface ReferenceType {
  targetEntity: string;
  cardinality: ReferenceCardinality;
}

export type FieldType = PrimitiveFieldType | { reference: ReferenceType };

export interface FieldSpec {
  name: string;
  type: FieldType;
  nullable?: boolean;
  unique?: boolean;
  length?: number;
}

export interface EntitySpec {
  name: string;
  tableName?: string;
  fields: FieldSpec[];
}
