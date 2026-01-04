# Specifications Documentation

This document details the structure and format of the specification files that drive the API generation process. Understanding this format is key to effectively defining your API's data models, operations, and data transfer objects.

## 1. Introduction

Specifications are declarative JSON files that define the entire architecture of a feature. They are the single source of truth from which entities, repositories, services, controllers, and DTOs are generated.

The specifications are divided into two main files:
-   **Feature Specification**: Defines the core domain entity, its fields, relations, and operations.
-   **DTO Specification**: Defines the Data Transfer Objects used for API input and output.

## 2. File Structure

The parser expects at least two JSON files:
-   A file containing a single "feature" object (e.g., `feature.json`).
-   A file containing an array of "DTO" objects (e.g., `dtos.json`).

## 3. The Feature Specification

This file defines the core domain model for a single feature (e.g., `User`, `Product`).

### Top-Level Properties

| Name           | Type                | Description                                                                                                   |
| :------------- | :------------------ | :------------------------------------------------------------------------------------------------------------ |
| `name`         | `string`            | **Required.** The name of the feature/entity (e.g., "User").                                                  |
| `tableName`    | `string`            | The name of the database table. If omitted, it's typically derived from the feature name.                     |
| `fields`       | `Field[]`           | **Required.** An array of objects defining the entity's fields.                                               |
| `relations`    | `Relation[]`        | An array of objects defining relationships to other entities.                                                 |
| `operations`   | `Operation[]`       | **Required.** An array of objects defining the API endpoints and their behavior.                              |
| `defaultRoles` | `string[]`          | A list of security roles that apply to all operations by default.                                             |
| `advanced`     | `AdvancedFeature`   | Advanced options for the entity.                                                                              |

#### `AdvancedFeature` Object

| Name         | Type      | Description                               |
| :----------- | :-------- | :---------------------------------------- |
| `softDelete` | `boolean` | Enables soft-deletion for the entity.     |
| `timestamps` | `boolean` | Adds `createdAt` and `updatedAt` fields.  |
| `versioning` | `boolean` | Adds a version field for optimistic locking. |

### The `fields` Array

Each object in the `fields` array defines a single attribute of the entity.

#### Common Field Properties

| Name       | Type                                                               | Description                                       |
| :--------- | :----------------------------------------------------------------- | :------------------------------------------------ |
| `name`     | `string`                                                           | **Required.** The name of the field.              |
| `type`     | `string`                                                           | **Required.** The data type of the field. See below. |
| `nullable` | `boolean`                                                          | Whether the field can be `null`. Defaults to `false`. |
| `unique`   | `boolean`                                                          | Whether the field value must be unique.          |
| `advanced` | `AdvancedField`                                                    | Type-specific advanced options.                   |

#### Field Types and Advanced Options

| `type`    | `advanced` Options                                                                      | Description                                                                   |
| :-------- | :-------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| `Id`      | `concreteType`: "Long" or "UUID" <br> `generationStrategy`: "AUTO", "IDENTITY", "SEQUENCE", "UUID" | **Required (once).** The primary identifier for the entity.                   |
| `String`  | `validation`: { `regex`, `length`, `minLength`, `maxLength` } <br> `defaultValue`: string | A short string.                                                               |
| `Text`    | Same as `String`.                                                                       | A long string, typically mapping to a `TEXT` or `CLOB` type in the database.  |
| `Enum`    | `values`: `string[]` <br> `defaultValue`: string                                         | A string field restricted to a predefined set of values.                      |
| `Integer` | `validation`: { `min`, `max` } <br> `defaultValue`: number                              | A 32-bit integer.                                                             |
| `Long`    | `validation`: { `min`, `max` } <br> `defaultValue`: number                              | A 64-bit integer.                                                             |
| `Double`  | `validation`: { `min`, `max` } <br> `defaultValue`: number                              | A double-precision floating-point number.                                     |
| `Boolean` | `defaultValue`: boolean                                                                 | A `true` or `false` value.                                                    |
| `Date`    | `format`: string (e.g., "YYYY-MM-DD") <br> `defaultValue`: "CURRENT_TIMESTAMP" or string | A date or timestamp value.                                                    |

### The `relations` Array

This array defines relationships between the current feature and other features.

| Name               | Type                  | Description                                                                 |
| :----------------- | :-------------------- | :-------------------------------------------------------------------------- |
| `name`             | `string`              | **Required.** The name of the relation property.                            |
| `type`             | `string`              | **Required.** "OneToOne", "OneToMany", "ManyToOne", "ManyToMany".           |
| `targetEntity`     | `string`              | **Required.** The name of the other feature in the relationship.            |
| `kind`             | `"Parent"` or `"Child"` | **Required.** Defines the ownership of the relationship.                    |
| `mappedBy`         | `string`              | In a bidirectional relationship, this is the name of the property on the other side that owns the relationship. |
| `fetch`            | `"LAZY"` or `"EAGER"` | The fetch strategy. Defaults to "LAZY" for collections, "EAGER" for single associations. |
| `cascade`          | `string[]`            | Array of cascade options (e.g., "PERSIST", "REMOVE").                       |
| `optional`         | `boolean`             | Whether the relationship is optional.                                       |
| `customAnnotation` | `string`              | A custom annotation to add to the generated code for this relation.         |

### The `operations` Array

This array defines the API endpoints for the feature.

| Name          | Type                                        | Description                                                                    |
| :------------ | :------------------------------------------ | :----------------------------------------------------------------------------- |
| `name`        | `string`                                    | **Required.** The name of the operation (e.g., "findUserById").                |
| `type`        | `"CRUD"` or `"CUSTOM"`                      | The type of operation.                                                         |
| `path`        | `string`                                    | **Required.** The URL path for the endpoint (e.g., "/users/{id}").             |
| `method`      | `"GET"`, `"POST"`, `"PUT"`, `"DELETE"`      | **Required.** The HTTP method.                                                 |
| `output`      | `string`                                    | The name of the DTO to use for the response body.                              |
| `input`       | `string`                                    | The name of the DTO to use for the request body (not for GET).                 |
| `isArray`     | `boolean`                                   | Whether the output is an array of the `output` DTO.                            |
| `roles`       | `string[]`                                  | Roles required to access this endpoint, overriding `defaultRoles`.             |
| `pathParams`  | `Param[]`                                   | Parameters extracted from the URL path.                                        |
| `queryParams` | `Param[]`                                   | Parameters from the URL query string.                                          |
| `description` | `string`                                    | A description of the operation.                                                |

#### `Param` Object

| Name        | Type      | Description                               |
| :---------- | :-------- | :---------------------------------------- |
| `name`      | `string`  | **Required.** The name of the parameter.  |
| `type`      | `string`  | **Required.** The data type of the parameter. |
| `required`  | `boolean` | Whether the parameter is required.        |

## 4. The DTO Specification

This file (e.g., `dtos.json`) contains an array of DTO definitions. DTOs control how data is shaped for API responses (`output`) and requests (`input`).

### DTO Properties

| Name           | Type               | Description                                                              |
| :------------- | :----------------- | :----------------------------------------------------------------------- |
| `name`         | `string`           | **Required.** The unique name of the DTO (e.g., "UserSummaryDTO").       |
| `sourceEntity` | `string`           | **Required.** The name of the feature this DTO is based on.              |
| `include`      | `string[]`         | A whitelist of fields from the `sourceEntity` to include.                |
| `exclude`      | `string[]`         | A blacklist of fields from the `sourceEntity` to exclude.                |
| `relations`    | `DtoRelation[]`    | Defines how related entities should be represented.                      |
| `description`  | `string`           | A description of the DTO.                                                |

_Note: You can use either `include` or `exclude`, but not both in the same DTO._

### The `DtoRelation` Object

This object controls how relations are represented within a DTO.

| Name     | Type                   | Description                                                                                                                                                             |
| :------- | :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field`  | `string`               | **Required.** The name of the relation field from the `sourceEntity`.                                                                                                   |
| `mode`   | `"ID"` or `"EMBEDDED"` | **Required.** How to represent the relation. `"ID"` includes only the ID(s) of the related entity. `"EMBEDDED"` includes the full related object, shaped by another DTO. |
| `dtoRef` | `string`               | **Required if `mode` is `"EMBEDDED"`.** The name of the DTO to use for shaping the embedded related object. Must be omitted if `mode` is `"ID"`.                        |

## 5. Example

### `user-feature.json`

```json
{
  "name": "User",
  "tableName": "users",
  "fields": [
    { "name": "id", "type": "Id", "concreteType": "Long", "advanced": { "generationStrategy": "IDENTITY" } },
    { "name": "username", "type": "String", "unique": true },
    { "name": "email", "type": "String", "unique": true },
    { "name": "password", "type": "String" },
    { "name": "role", "type": "Enum", "values": ["ADMIN", "USER"] }
  ],
  "relations": [
    {
      "name": "posts",
      "type": "OneToMany",
      "targetEntity": "Post",
      "kind": "Parent",
      "mappedBy": "author"
    }
  ],
  "operations": [
    {
      "name": "getUserById",
      "type": "CRUD",
      "path": "/users/{id}",
      "method": "GET",
      "output": "UserDetailDTO",
      "pathParams": [{ "name": "id", "type": "Long" }]
    },
    {
      "name": "createUser",
      "type": "CRUD",
      "path": "/users",
      "method": "POST",
      "input": "CreateUserDTO",
      "output": "UserDetailDTO"
    }
  ]
}
```

### `user-dtos.json`

```json
[
  {
    "name": "CreateUserDTO",
    "sourceEntity": "User",
    "include": ["username", "email", "password", "role"]
  },
  {
    "name": "UserDetailDTO",
    "sourceEntity": "User",
    "exclude": ["password"],
    "relations": [
      {
        "field": "posts",
        "mode": "ID"
      }
    ]
  }
]
```
