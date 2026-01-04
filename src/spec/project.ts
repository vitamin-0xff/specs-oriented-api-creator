export type ProjectLanguage = "java" | "kotlin";

export interface ProjectSpec {
  name: string;
  basePackage: string;
  language: ProjectLanguage;
}
