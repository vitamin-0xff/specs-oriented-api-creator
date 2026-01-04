import { Transformer } from "./transformer.ts";
import { FeatureIR } from "../ir/index.ts";

export class ServiceTransformer
  implements Transformer<FeatureIR, FeatureIR>
{
  transform(feature: FeatureIR): FeatureIR {
    const methods = feature.serviceMethods.map((m) => ({
      ...m,
      transactional: m.transactional ?? true,
    }));

    return {
      ...feature,
      serviceMethods: methods,
    };
  }
}
