import { Transformer } from "./transformer.ts";
import { FeatureIR, EntityIR, FieldIR } from "../ir/index.ts";

export class EntityTransformer
  implements Transformer<FeatureIR, FeatureIR>
{
  transform(feature: FeatureIR): FeatureIR {
    // Add JPA ID if missing
    const fields = feature.entity.fields.map((f) => {
      if (f.name === "id") {
        return {
          ...f,
          // special metadata for codegen
          generated: true,
          annotation: "@Id @GeneratedValue",
        } as FieldIR & { generated: boolean; annotation: string };
      }
      return f;
    });

    const entity: EntityIR & { fields: (FieldIR & { generated?: boolean; annotation?: string })[] } = {
      ...feature.entity,
      fields,
    };

    return {
      ...feature,
      entity,
    };
  }
}
