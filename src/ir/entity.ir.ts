export interface FieldIR {
  name: string;
  type: string | { reference: { targetEntity: string; cardinality: string } };
  nullable: boolean;
  unique: boolean;
  length?: number;
}

export interface EntityIR {
  name: string;
  tableName: string;
  fields: FieldIR[];
}
