// =============================================================================
// Dynamic Form Library - Main Exports
// =============================================================================

export type { DynamicFormContextValue } from "./context";
// =============================================================================
// Context (for advanced use cases)
// =============================================================================
export { DynamicFormContext } from "./context";
// =============================================================================
// Custom Components (Phase 5)
// =============================================================================
export type { CustomComponentRenderProps } from "./customComponents";
export { defineCustomComponent } from "./customComponents";
// Main Component
export { DynamicForm, default } from "./DynamicForm";
// =============================================================================
// Hooks
// =============================================================================
export {
  useDynamicFormContext,
  useDynamicFormContextSafe,
} from "./hooks";
export type { ParseResult } from "./parser";
// =============================================================================
// Parser (for advanced use cases)
// =============================================================================
export {
  ConfigurationError,
  parseConfiguration,
  safeParseConfiguration,
} from "./parser";
// =============================================================================
// Resolver (Phase 3 - Visibility-aware validation)
// =============================================================================
export {
  createVisibilityAwareResolver,
  type VisibilityAwareResolverOptions,
} from "./resolver";
export type {
  GeneratedSchema,
  InferSchemaType,
  SchemaFactory,
  SchemaMap,
} from "./schema";
// =============================================================================
// Schema Generation (for advanced use cases)
// =============================================================================
export {
  buildFieldSchema,
  defaultSchemaMap,
  generateZodSchema,
  getSchemaFieldPaths,
  setSchemaMap,
} from "./schema";
// =============================================================================
// Types
// =============================================================================
export type {
  ApiOptionsSource,
  ArrayFieldComponent,
  ArrayFieldElement,
  ArrayFieldProps,
  BaseFieldComponent,
  BaseFieldElement,
  BaseFieldProps,
  ComponentRegistry,
  ContainerComponent,
  ContainerElement,
  ContainerProps,
  CustomComponentDefinition,
  CustomComponentRegistry,
  CustomContainerRegistry,
  CustomFieldComponent,
  CustomFieldElement,
  CustomFieldProps,
  DynamicFormProps,
  DynamicFormRef,
  ElementType,
  FieldComponentRegistry,
  FieldElement,
  FieldProps,
  FieldType,
  FieldWrapperFunction,
  FieldWrapperProps,
  FormConfiguration,
  FormData,
  FormElement,
  InvisibleFieldValidation,
  JsonLogicRule,
  LayoutElement,
  MapOptionsSource,
  OnChangeHandler,
  OnErrorHandler,
  OnResetHandler,
  OnSubmitHandler,
  OnValidationChangeHandler,
  OptionsSource,
  ResolverOptionsSource,
  SearchOptionsSource,
  SelectFieldComponent,
  SelectFieldElement,
  SelectFieldProps,
  SelectOption,
  StaticOptionsSource,
  ValidationConfig,
} from "./types";
// Element type guards
export {
  isArrayFieldElement,
  isContainerElement,
  isCustomFieldElement,
  isFieldElement,
  isSectionContainer,
} from "./types";
// =============================================================================
// Utilities (for advanced use cases)
// =============================================================================
export {
  calculateVisibility,
  flattenFields,
  getFieldNames,
  getNestedValue,
  mergeDefaults,
  setNestedValue,
  type VisibilityState,
} from "./utils";
// =============================================================================
// Validation Utilities (Phase 3 - JSON Logic)
// =============================================================================
export { applyJsonLogic, evaluateCondition } from "./validation";
