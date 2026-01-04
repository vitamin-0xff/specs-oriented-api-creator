import { EntityIR, FieldIR } from "./entity.ir.ts";

export interface RepositoryOperationIR {
  name: string;
  type: "find" | "exists" | "count" | "delete" | "custom";
  returnType: "entity" | "list" | "page" | "boolean" | "number";
  criteria: { field: FieldIR; operator: string }[];
}

export interface ServiceMethodIR {
  name: string;
  repositoryOperation: RepositoryOperationIR;
  transactional: boolean;
}

export interface EndpointIR {
    name: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    serviceMethod: ServiceMethodIR;
    requestBody: boolean;
    queryParams?: { name: string; type: string }[];
    pathParams?: { name: string; type: string }[];
    bodyParams?: { name: string; type: string }[]; // Optional if requestBody=true
}

export interface EndpointIR {
    name: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    serviceMethod: ServiceMethodIR;
    requestBody: boolean;
    queryParams?: { name: string; type: string }[];
    pathParams?: { name: string; type: string }[];
    bodyParams?: { name: string; type: string }[]; // Optional if requestBody=true
}

export interface FeatureIR {
  name: string;
  entity: EntityIR;
  repositoryOperations: RepositoryOperationIR[];
  serviceMethods: ServiceMethodIR[];
  endpoints: EndpointIR[];
  defaultRoles: string[];
  securityRules: { target: "controller" | "endpoint"; name: string; roles: string[] }[];
}
