export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface EndpointSpec {
  name: string;
  method: HttpMethod;
  path: string;
  serviceMethod: string;
  requestBody?: boolean;
}

export interface ControllerSpec {
  basePath: string;
  endpoints: EndpointSpec[];
}
