export { buildFieldSchema, isFieldOptional } from "./fieldSchemas";

export type {
  GeneratedSchema,
  InferSchemaType,
} from "./generateSchema";
export {
  generateZodSchema,
  getSchemaFieldPaths,
} from "./generateSchema";

export {
  createNestedStructure,
  getNestedSchema,
  setNestedSchema,
} from "./nestedPaths";
