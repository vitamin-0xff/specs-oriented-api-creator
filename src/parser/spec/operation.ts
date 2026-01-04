// Base operation fields
export interface OperationIRBase {
  name: string;                 // operation name
  type: "CRUD" | "CUSTOM";      
  path: string;                 // endpoint path
  returnType: string;           // e.g., "User", "User[]", "void"
  isArray?: boolean;            // return type is list
  roles?: string[];             // authorized roles
  description?: string;
  transactional?: boolean;      // for service layer
  readOnly?: boolean;           // usually true for GET
  customAnnotation?: string;
}

// ---------------------------
// GET-based operations
// ---------------------------
export interface GetOperationIR extends OperationIRBase {
  method: "GET";
  pathParams?: ParamIR[];       // required in URL
  queryParams?: ParamIR[];      // optional or required query parameters
  bodyParams?: never;           // GET does not have body
}

// ---------------------------
// POST/PUT/DELETE-based operations
// ---------------------------
export interface BodyOperationIR extends OperationIRBase {
  method: "POST" | "PUT" | "DELETE";
  pathParams?: ParamIR[];       // may exist
  queryParams?: ParamIR[];      // may exist
  bodyParams?: ParamIR[];       // required/request body
}

// ---------------------------
// Union type
// ---------------------------
export type OperationIR = GetOperationIR | BodyOperationIR;

// ---------------------------
// Parameter spec
// ---------------------------
export interface ParamIR {
  name: string;
  type: string;                // "String", "Long", etc.
  required?: boolean;
  description?: string;
}
