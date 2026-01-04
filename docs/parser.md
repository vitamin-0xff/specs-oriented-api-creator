# Parser Documentation

This document provides a detailed explanation of the parser's functionality, validation rules, and usage.

## Overview

The parser is a crucial component responsible for validating the integrity and correctness of feature specifications and their associated Data Transfer Objects (DTOs). It ensures that the provided JSON definitions adhere to a predefined structure and a set of semantic rules, preventing inconsistencies and errors downstream in the code generation process.

The main entry point for the parser is the `parseFeature` function located in `src/parser/validation-pipeline.ts`. This function orchestrates the entire validation process.

## Core Concepts

The parser operates on two primary data structures:

-   **Features**: A feature represents a domain entity, its fields, relationships with other entities, and the operations that can be performed on it. The structure and constraints for features are defined in `src/parser/specs-validators.ts` using the `zod` library.
-   **DTOs (Data Transfer Objects)**: DTOs define how data is presented to the client. They allow for selective exposure of entity fields and can be used to shape the API's input and output structures. DTO specifications are also validated by the parser.

## Validation Rules

The parser enforces a series of validation rules to ensure the consistency of the feature and DTO definitions.

### 1. Entity Field Validation

-   **Unique Field Names**: All fields within a single entity must have unique names.
-   **Single ID Field**: Each entity must have exactly one field of type `Id`. This field serves as the primary identifier for the entity.
-   **Enum Values**: Any field of type `Enum` must define a non-empty array of `values`.

### 2. DTO Validation

-   **Valid `sourceEntity`**: The `sourceEntity` specified in a DTO must correspond to an existing feature.
-   **Field Existence**: When using `include` or `exclude` in a DTO, the specified fields must exist in the `sourceEntity`.
-   **Relation Correctness**: Any relations defined in a DTO must correspond to relations defined in the source entity.
-   **DTO Embedding**:
    -   If a DTO relation has its `mode` set to `EMBEDDED`, a `dtoRef` must be provided, and the referenced DTO must exist.
    -   If a DTO relation has its `mode` set to `ID`, a `dtoRef` must *not* be provided.

### 3. Operation Validation

-   **DTO Existence**: If an operation specifies an `input` or `output` DTO, those DTOs must be defined.
-   **GET Operations**: Operations with the `method` "GET" are not allowed to have an `input` DTO, as they should not have a request body.

## Usage

To use the parser, import the `parseFeature` function and pass the raw feature and DTO objects to it.

```typescript
import { parseFeature } from "./parser/validation-pipeline.ts";
import { loadContentFile } from "./utils/load-content-file.ts";

// Load the raw JSON data
const rawFeature = await loadContentFile("example.json");
const rawDtos = await loadContentFile("dtos.json");

try {
    const { feature, dtos } = parseFeature(rawFeature, rawDtos);
    console.log("Validation successful!");
    // Proceed with the validated feature and DTOs
} catch (error) {
    console.error("Validation failed:", error.message);
}
```

If validation is successful, `parseFeature` returns the validated `feature` and `dtos` objects. If validation fails, it throws an error with a descriptive message.

## Extending the Parser

The parser is designed to be extensible. To add new validation rules, you can modify the `zod` schemas in `src/parser/specs-validators.ts`.

For example, to add a new validation rule to the `featureSchema`, you can add a `.refine()` call to the schema definition:

```typescript
export const featureSchema = z.object({
  // ... existing schema ...
}).refine(
  (feature) => {
    // Your new validation logic here
    return a_boolean_value;
  },
  { message: "Your custom error message." }
);
```

For more complex validation logic, you can create a new validation function and integrate it into the `parseFeature` pipeline in `src/parser/validation-pipeline.ts`.
