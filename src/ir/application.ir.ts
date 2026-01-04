import { FeatureIR } from "./feature.ir.ts";

export interface ApplicationIR {
  projectName: string;
  basePackage: string;
  language: "java" | "kotlin";
  features: FeatureIR[];
}
