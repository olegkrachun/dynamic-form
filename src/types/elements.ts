import type { JsonLogicRule, ValidationConfig } from "./validation";

/**
 * All supported element types in the form configuration.
 * Phase 1: text, email, boolean, phone, date, custom
 * Phase 2 adds: container, column
 */
export type ElementType =
  | "text"
  | "email"
  | "boolean"
  | "phone"
  | "date"
  | "container"
  | "column"
  | "custom";

/**
 * Field types that render input controls.
 */
export type FieldType = "text" | "email" | "boolean" | "phone" | "date";

/**
 * Base interface for all field elements.
 */
export interface BaseFieldElement {
  type: ElementType;
  /** Unique identifier for form data binding (supports dot notation like 'source.name') */
  name: string;

  /** Display label for the field */
  label?: string;

  /** Placeholder text (for text-based inputs) */
  placeholder?: string;

  /** Default value for the field */
  defaultValue?: string | number | boolean | null;

  /** Validation configuration */
  validation?: ValidationConfig;

  /** Conditional visibility rules using JSON Logic (Phase 4) */
  visible?: JsonLogicRule;
}

/**
 * Text input field element.
 */
export interface TextFieldElement extends BaseFieldElement {
  type: "text";
}

/**
 * Email input field element.
 */
export interface EmailFieldElement extends BaseFieldElement {
  type: "email";
}

/**
 * Boolean (checkbox/toggle) field element.
 */
export interface BooleanFieldElement extends BaseFieldElement {
  type: "boolean";
}

/**
 * Phone number input field element.
 */
export interface PhoneFieldElement extends BaseFieldElement {
  type: "phone";
}

/**
 * Date picker field element.
 */
export interface DateFieldElement extends BaseFieldElement {
  type: "date";
}

/**
 * Custom component field element.
 * Allows rendering user-defined components.
 */
export interface CustomFieldElement extends BaseFieldElement {
  type: "custom";

  /** Name of the registered custom component */
  component: string;

  /** Props to pass to the custom component */
  componentProps?: Record<string, unknown>;
}

/**
 * Container element for grouping fields in columns (Phase 2).
 */
export interface ContainerElement {
  type: "container";

  /** Array of column elements */
  columns: ColumnElement[];

  /** Conditional visibility rules using JSON Logic */
  visible?: JsonLogicRule;
}

/**
 * Column element within a container (Phase 2).
 */
export interface ColumnElement {
  type: "column";

  /** Column width (e.g., '50%', '200px') */
  width: string;

  /** Nested elements within the column */
  elements: FormElement[];

  /** Conditional visibility rules using JSON Logic */
  visible?: JsonLogicRule;
}

/**
 * Union of all field element types.
 */
export type FieldElement =
  | TextFieldElement
  | EmailFieldElement
  | BooleanFieldElement
  | PhoneFieldElement
  | DateFieldElement
  | CustomFieldElement;

/**
 * Union of all layout element types.
 */
export type LayoutElement = ContainerElement | ColumnElement;

/**
 * Union of all form element types.
 */
export type FormElement = FieldElement | LayoutElement;

/**
 * Type guard to check if an element is a field element.
 */
export function isFieldElement(element: FormElement): element is FieldElement {
  return (
    element.type === "text" ||
    element.type === "email" ||
    element.type === "boolean" ||
    element.type === "phone" ||
    element.type === "date" ||
    element.type === "custom"
  );
}

/**
 * Type guard to check if an element is a container element.
 */
export function isContainerElement(
  element: FormElement
): element is ContainerElement {
  return element.type === "container";
}

/**
 * Type guard to check if an element is a column element.
 */
export function isColumnElement(
  element: FormElement
): element is ColumnElement {
  return element.type === "column";
}

/**
 * Type guard to check if an element is a custom field element.
 */
export function isCustomFieldElement(
  element: FormElement
): element is CustomFieldElement {
  return element.type === "custom";
}
