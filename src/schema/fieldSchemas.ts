import { type ZodTypeAny, z } from "zod";
import type { FieldElement, ValidationConfig } from "../types";

/**
 * Build the base Zod schema for a field based on its type.
 *
 * @param fieldType - The type of the field
 * @returns Base Zod schema for the field type
 */
function buildBaseSchema(fieldType: string): ZodTypeAny {
  switch (fieldType) {
    case "text":
    case "phone":
      return z.string();

    case "email":
      // Email type gets built-in email validation
      return z.string().email("Invalid email address");

    case "boolean":
      return z.boolean();

    case "date":
      // Date is stored as ISO string
      return z.string();

    case "custom":
      // Custom fields accept any value
      return z.unknown();

    default:
      return z.unknown();
  }
}

/**
 * Apply validation rules to a string schema.
 *
 * @param schema - Base string schema
 * @param validation - Validation configuration
 * @returns Schema with validation rules applied
 */
function applyStringValidation(
  schema: z.ZodString,
  validation: ValidationConfig
): z.ZodString {
  let result = schema;

  // Required validation - must be non-empty string
  if (validation.required) {
    result = result.min(1, "This field is required");
  }

  // Min length validation
  if (validation.minLength !== undefined) {
    result = result.min(
      validation.minLength,
      `Must be at least ${validation.minLength} characters`
    );
  }

  // Max length validation
  if (validation.maxLength !== undefined) {
    result = result.max(
      validation.maxLength,
      `Must be no more than ${validation.maxLength} characters`
    );
  }

  // Pattern validation (regex)
  if (validation.pattern) {
    try {
      const regex = new RegExp(validation.pattern);
      result = result.regex(regex, validation.message || "Invalid format");
    } catch {
      console.warn(`Invalid regex pattern: ${validation.pattern}`);
    }
  }

  return result;
}

/**
 * Apply validation rules to a boolean schema.
 *
 * @param schema - Base boolean schema
 * @param validation - Validation configuration
 * @returns Schema with validation rules applied
 */
function applyBooleanValidation(
  schema: z.ZodBoolean,
  validation: ValidationConfig
): ZodTypeAny {
  // For boolean "required", we interpret it as "must be true"
  // (e.g., accepting terms and conditions)
  if (validation.required) {
    return schema.refine((val) => val === true, {
      message: "This field is required",
    });
  }

  return schema;
}

/**
 * Apply validation configuration to a Zod schema based on field type.
 *
 * @param schema - Base Zod schema
 * @param validation - Validation configuration
 * @param fieldType - Type of the field
 * @returns Schema with validation rules applied
 */
function applyValidationRules(
  schema: ZodTypeAny,
  validation: ValidationConfig,
  fieldType: string
): ZodTypeAny {
  // String-based fields (text, phone, email, date)
  if (
    fieldType === "text" ||
    fieldType === "phone" ||
    fieldType === "email" ||
    fieldType === "date"
  ) {
    return applyStringValidation(schema as z.ZodString, validation);
  }

  // Boolean fields
  if (fieldType === "boolean") {
    return applyBooleanValidation(schema as z.ZodBoolean, validation);
  }

  // Custom and unknown types - no standard validation
  return schema;
}

/**
 * Build a complete Zod schema for a single field.
 *
 * @param field - Field element configuration
 * @returns Zod schema for the field
 *
 * @example
 * ```typescript
 * const textField = {
 *   type: 'text',
 *   name: 'name',
 *   validation: { required: true, minLength: 3 }
 * };
 *
 * const schema = buildFieldSchema(textField);
 * // schema is z.string().min(1, 'required').min(3, '...')
 * ```
 */
export function buildFieldSchema(field: FieldElement): ZodTypeAny {
  // Create base schema for the field type
  let schema = buildBaseSchema(field.type);

  // Apply validation rules if present
  if (field.validation) {
    schema = applyValidationRules(schema, field.validation, field.type);
  }

  return schema;
}

/**
 * Determines if a field is optional (has no required validation).
 *
 * @param field - Field element configuration
 * @returns true if the field is optional
 */
export function isFieldOptional(field: FieldElement): boolean {
  return !field.validation?.required;
}
