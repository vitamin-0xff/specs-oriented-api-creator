export type RepositoryOperationType =
  | "find"
  | "exists"
  | "count"
  | "delete"
  | "custom";

export type RepositoryReturnType =
  | "entity"
  | "list"
  | "page"
  | "boolean"
  | "number";

export type QueryOperator = "eq" | "like" | "gt" | "lt" | "in";

export interface QueryCriteriaSpec {
  field: string;
  operator: QueryOperator;
}

export interface RepositoryOperationSpec {
  name: string;
  type: RepositoryOperationType;
  returnType?: RepositoryReturnType;
  criteria?: QueryCriteriaSpec[];
}

export interface RepositorySpec {
  enabled: boolean;
  operations: RepositoryOperationSpec[];
}
