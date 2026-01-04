import { Transformer } from "./transformer.ts";
import { FeatureIR } from "../ir/index.ts";

export class SecurityTransformer
  implements Transformer<FeatureIR, FeatureIR>
{
  transform(feature: FeatureIR): FeatureIR {
    // Ensure all endpoints have roles
    const rules = feature.securityRules ?? [];
    return {
      ...feature,
      securityRules: rules,
      defaultRoles: feature.defaultRoles ?? ["USER"],
    };
  }
}
