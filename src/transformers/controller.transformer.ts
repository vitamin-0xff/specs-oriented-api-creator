import { Transformer } from "./transformer.ts";
import { FeatureIR } from "../ir/index.ts";

export class ControllerTransformer
  implements Transformer<FeatureIR, FeatureIR>
{
  transform(feature: FeatureIR): FeatureIR {
    const endpoints = feature.endpoints.map((e) => ({
      ...e,
      requestBody: e.requestBody ?? e.method !== "GET",
    }));

    return {
      ...feature,
      endpoints,
    };
  }
}
