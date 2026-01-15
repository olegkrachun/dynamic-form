// Validation types

// Configuration types
export type {
  CustomComponentDefinition,
  DynamicFormProps,
  FormConfiguration,
} from "./config";

// Element types
export type {
  BooleanFieldElement,
  ColumnElement,
  ContainerElement,
  CustomFieldElement,
  DateFieldElement,
  ElementType,
  EmailFieldElement,
  FieldElement,
  FieldType,
  FormElement,
  LayoutElement,
  PhoneFieldElement,
  TextFieldElement,
} from "./elements";

export {
  isColumnElement,
  isContainerElement,
  isCustomFieldElement,
  isFieldElement,
} from "./elements";
// Event types
export type {
  FormData,
  OnChangeHandler,
  OnErrorHandler,
  OnResetHandler,
  OnSubmitHandler,
  OnValidationChangeHandler,
} from "./events";
// Field component types
export type {
  BaseFieldComponent,
  BaseFieldProps,
  BooleanFieldComponent,
  BooleanFieldProps,
  // Container component types (Phase 2)
  ColumnComponent,
  ColumnProps,
  ContainerComponent,
  ContainerProps,
  CustomComponentRegistry,
  CustomContainerRegistry,
  CustomFieldComponent,
  CustomFieldProps,
  DateFieldComponent,
  DateFieldProps,
  EmailFieldComponent,
  EmailFieldProps,
  FieldComponentRegistry,
  FieldProps,
  PhoneFieldComponent,
  PhoneFieldProps,
  TextFieldComponent,
  TextFieldProps,
} from "./fields";
export type {
  InvisibleFieldValidation,
  JsonLogicRule,
  ValidationConfig,
} from "./validation";
