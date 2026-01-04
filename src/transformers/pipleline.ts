import { FeatureIR } from "../ir/index.ts";
import { EntityTransformer } from "./entity.transformer.ts";
import { RepositoryTransformer } from "./repository.transformer.ts";
import { ServiceTransformer } from "./service.transformer.ts";
import { ControllerTransformer } from "./controller.transformer.ts";
import { SecurityTransformer } from "./security.transformer.ts";

export function transformFeature(feature: FeatureIR): FeatureIR {
  let f = feature;
  f = new EntityTransformer().transform(f);
  f = new RepositoryTransformer().transform(f);
  f = new ServiceTransformer().transform(f);
  f = new ControllerTransformer().transform(f);
  f = new SecurityTransformer().transform(f);
  return f;
}

export function transformApplication(features: FeatureIR[]): FeatureIR[] {
  return features.map(transformFeature);
}
