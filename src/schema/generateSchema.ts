import { ZodObject, type ZodTypeAny, z } from "zod";
import type { FormConfiguration } from "../types";
import { flattenFields } from "../utils";
import { buildFieldSchema } from "./fieldSchemas";
import { setNestedSchema } from "./nestedPaths";

/**
 * Generated schema type - a Zod object schema.
 */
export type GeneratedSchema = ZodObject<Record<string, ZodTypeAny>>;

/**
 * Generate a Zod schema from form configuration.
 * Supports nested field paths via dot notation.
 *
 * This function is called once when the form initializes and the schema
 * is memoized. Visibility changes are handled at validation time, not
 * by regenerating the schema.
 *
 * @param config - Form configuration object
 * @returns Zod object schema for validating form data
 *
 * @example
 * ```typescript
 * const config = {
 *   elements: [
 *     { type: 'text', name: 'source.name', validation: { required: true } },
 *     { type: 'email', name: 'source.email' },
 *     { type: 'boolean', name: 'active' }
 *   ]
 * };
 *
 * const schema = generateZodSchema(config);
 *
 * // The generated schema is equivalent to:
 * // z.object({
 * //   source: z.object({
 * //     name: z.string().min(1, 'required'),
 * //     email: z.string().email()
 * //   }),
 * //   active: z.boolean()
 * // })
 *
 * schema.parse({
 *   source: { name: 'John', email: 'john@example.com' },
 *   active: true
 * }); // Valid
 * ```
 */
export function generateZodSchema(config: FormConfiguration): GeneratedSchema {
  // Extract all field elements (flattening any containers/columns)
  const fields = flattenFields(config.elements);

  // Build the schema shape
  const schemaShape: Record<string, ZodTypeAny> = {};

  for (const field of fields) {
    // Build the Zod schema for this field
    const fieldSchema = buildFieldSchema(field);

    // Set it in the shape, handling nested paths
    setNestedSchema(schemaShape, field.name, fieldSchema);
  }

  return z.object(schemaShape);
}

/**
 * Infer the TypeScript type from a generated schema.
 * Useful for typing form data in the consuming application.
 *
 * @example
 * ```typescript
 * const schema = generateZodSchema(config);
 * type FormData = InferSchemaType<typeof schema>;
 *
 * const onSubmit = (data: FormData) => {
 *   // data is fully typed based on configuration
 * };
 * ```
 */
export type InferSchemaType<T extends GeneratedSchema> = z.infer<T>;

/**
 * Extract field paths from a generated schema.
 * Returns all top-level and nested paths.
 *
 * @param schema - Generated Zod schema
 * @param prefix - Current path prefix (used in recursion)
 * @returns Array of all field paths
 */
export function getSchemaFieldPaths(
  schema: ZodObject<Record<string, ZodTypeAny>>,
  prefix = ""
): string[] {
  const paths: string[] = [];
  const shape = schema.shape;

  for (const key in shape) {
    if (Object.hasOwn(shape, key)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      const fieldSchema = shape[key];

      if (fieldSchema instanceof ZodObject) {
        // Recursively get paths from nested object
        paths.push(...getSchemaFieldPaths(fieldSchema, fullPath));
      } else {
        paths.push(fullPath);
      }
    }
  }

  return paths;
}
