export interface DtoIR {
  name: string;
  sourceEntity: string;
  
  // field selection
  include?: string[];          // fields to include
  exclude?: string[];          // fields to exclude

  relations?: {
    field: string;
    mode: "ID" | "EMBEDDED";
    dtoRef?: string;
  }[];

  description?: string;
}