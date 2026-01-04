import { z } from "zod";

// ---------------------------
// Cascade options
// ---------------------------
const cascadeOptionSchema = z.enum([
  "ALL",
  "PERSIST",
  "MERGE",
  "REMOVE",
  "REFRESH",
  "DETACH",
]);

// ---------------------------
// Field Schemas
// ---------------------------

// Base advanced options
const baseAdvancedOptionsSchema = z.object({
  index: z.boolean().optional(),
  customAnnotation: z.string().optional(),
  description: z.string().optional(),
});

// String-based fields
const stringFieldAdvancedSchema = baseAdvancedOptionsSchema.extend({
  validation: z
    .object({
      regex: z.string().optional(),
      length: z.number().optional(),
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
    })
    .optional(),
  defaultValue: z.string().optional(),
});

const stringFieldSchema = z.object({
  name: z.string(),
  type: z.enum(["String", "Text"]),
  nullable: z.boolean().optional(),
  unique: z.boolean().optional(),
  advanced: stringFieldAdvancedSchema.optional(),
});

const enumFieldSchema = stringFieldSchema.extend({
  type: z.literal("Enum"),
  values: z.array(z.string()),
  advanced: stringFieldAdvancedSchema.optional(),
});

// Number fields
const numberFieldAdvancedSchema = baseAdvancedOptionsSchema.extend({
  validation: z
    .object({ min: z.number().optional(), max: z.number().optional() })
    .optional(),
  defaultValue: z.number().optional(),
});

const numberFieldSchema = z.object({
  name: z.string(),
  type: z.enum(["Integer", "Long", "Double"]),
  nullable: z.boolean().optional(),
  unique: z.boolean().optional(),
  advanced: numberFieldAdvancedSchema.optional(),
});

// Boolean fields
const booleanFieldAdvancedSchema = baseAdvancedOptionsSchema.extend({
  defaultValue: z.boolean().optional(),
});

const booleanFieldSchema = z.object({
  name: z.string(),
  type: z.literal("Boolean"),
  nullable: z.boolean().optional(),
  unique: z.boolean().optional(),
  advanced: booleanFieldAdvancedSchema.optional(),
});

// Date fields
const dateFieldAdvancedSchema = baseAdvancedOptionsSchema.extend({
  format: z.string().optional(),
  defaultValue: z.union([z.literal("CURRENT_TIMESTAMP"), z.string()]).optional(),
});

const dateFieldSchema = z.object({
  name: z.string(),
  type: z.literal("Date"),
  nullable: z.boolean().optional(),
  unique: z.boolean().optional(),
  advanced: dateFieldAdvancedSchema.optional(),
});

// ID fields
const idFieldAdvancedSchema = baseAdvancedOptionsSchema.extend({
  generationStrategy: z.enum(["AUTO", "IDENTITY", "SEQUENCE", "UUID"]),
});

const idFieldSchema = z.object({
  name: z.string(),
  type: z.literal("Id"),
  concreteType: z.enum(["Long", "UUID"]),
  nullable: z.boolean().optional(),
  unique: z.boolean().optional(),
  advanced: idFieldAdvancedSchema,
});

// Union of all fields
const fieldSchema = z.union([
  stringFieldSchema,
  enumFieldSchema,
  numberFieldSchema,
  booleanFieldSchema,
  dateFieldSchema,
  idFieldSchema,
]);

const fieldsSchema = z.array(fieldSchema);

// ---------------------------
// DTO Schema
// ---------------------------

export const dtoSchema = z.object({
  name: z.string(),
  sourceEntity: z.string(),
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  relations: z.array(
    z.object({
      field: z.string(),
      mode: z.enum(["ID", "EMBEDDED"]),
      dtoRef: z.string().optional(),
    }).refine(
      (rel) => !(rel.mode === "EMBEDDED" && !rel.dtoRef),
      { message: "Relation with EMBEDDED mode must define dtoRef" }
    ).refine(
      (rel) => !(rel.mode === "ID" && rel.dtoRef),
      { message: "Relation with ID mode must not define dtoRef" }
    )
  ).optional(),
  description: z.string().optional(),
}).refine(
  (d) => !(d.include && d.exclude),
  { message: "DTO cannot have both include and exclude" }
);

// ---------------------------
// Operations Schema
// ---------------------------
export const paramSchema = z.object({
  name: z.string(),
  type: z.string(),         // e.g., "String", "Long"
  required: z.boolean().optional(),
  description: z.string().optional(),
});

export const paramsSchema = z.array(paramSchema);

// ---------------------------
// Base operation schema
// ---------------------------
const operationBaseSchema = z.object({
  name: z.string(),
  type: z.enum(["CRUD", "CUSTOM"]),
  path: z.string(),
  isArray: z.boolean().optional(),
  roles: z.array(z.string()).optional(),
  description: z.string().optional(),
  transactional: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  customAnnotation: z.string().optional(),
  pathParams: paramsSchema.optional(),
  queryParams: paramsSchema.optional(),
  output: z.string().optional(),
});

// ---------------------------
// GET operation schema
// ---------------------------
export const getOperationSchema = operationBaseSchema.extend({
  method: z.literal("GET"),
  bodyParams: z
    .never() // GET operations cannot have body
    .optional(),
});

// ---------------------------
// POST/PUT/DELETE operation schema
// ---------------------------
export const bodyOperationSchema = operationBaseSchema.extend({
  method: z.enum(["POST", "PUT", "DELETE"]),
  bodyParams: paramsSchema.optional(),
  input: z.string().optional(),
});

// ---------------------------
// Union of all operations
// ---------------------------
export const operationSchema = z.union([getOperationSchema, bodyOperationSchema]);

// Array of operations
export const operationsSchema = z.array(operationSchema);


// ---------------------------
// Relations Schema
// ---------------------------
const relationBaseSchema = z.object({
  name: z.string(),
  type: z.enum(["OneToOne", "OneToMany", "ManyToOne", "ManyToMany"]),
  targetEntity: z.string(),
  description: z.string().optional(),
  customAnnotation: z.string().optional(),
  fetch: z.enum(["LAZY", "EAGER"]).optional(),
  cascade: z.array(cascadeOptionSchema).optional(),
  optional: z.boolean().optional(),
});

// Parent/Child Relations
const parentRelationSchema = relationBaseSchema.extend({
  kind: z.literal("Parent"),
  mappedBy: z.string().optional(),
});

const childRelationSchema = relationBaseSchema.extend({
  kind: z.literal("Child"),
  mappedBy: z.string().optional(),
});

const relationSchema = z.union([parentRelationSchema, childRelationSchema]);
const relationsSchema = z.array(relationSchema).optional();

// ---------------------------
// Feature IR Schema
// ---------------------------
export const featureSchema = z.object({
  name: z.string(),
  tableName: z.string().optional(),
  fields: fieldsSchema,
  operations: operationsSchema,
  relations: relationsSchema,
  defaultRoles: z.array(z.string()).optional(),
  advanced: z
    .object({
      softDelete: z.boolean().optional(),
      timestamps: z.boolean().optional(),
      versioning: z.boolean().optional(),
    })
    .optional(),
});

export type FeatureIR = z.infer<typeof featureSchema>;
export type DtoIR = z.infer<typeof dtoSchema>;
export type OperationIR = z.infer<typeof operationSchema>;
export type FieldIR = z.infer<typeof fieldSchema>;
export type RelationIR = z.infer<typeof relationSchema>;
export type ParamIR = z.infer<typeof paramSchema>;
export type CascadeOption = z.infer<typeof cascadeOptionSchema>;
export type DtoSpecIR = z.infer<typeof dtoSchema>;
export type IDFieldIR = z.infer<typeof idFieldSchema>;