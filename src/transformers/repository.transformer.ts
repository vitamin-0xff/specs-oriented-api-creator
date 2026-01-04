import { Transformer } from "./transformer.ts";
import { FeatureIR } from "../ir/index.ts";

export class RepositoryTransformer
  implements Transformer<FeatureIR, FeatureIR>
{
  transform(feature: FeatureIR): FeatureIR {
    const repoOps = feature.repositoryOperations.map((op) => ({
      ...op,
      springRepository: `JpaRepository<${feature.entity.name}, Long>`,
    }));

    return {
      ...feature,
      repositoryOperations: repoOps,
    };
  }
}