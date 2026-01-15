import { useController } from "react-hook-form";
import type { StandardFieldComponentType } from "@/types/fields";
import { useDynamicFormContext } from "../hooks";
import type {
  BaseFieldComponent,
  CustomFieldComponent,
  FieldElement,
} from "../types";
import { isCustomFieldElement } from "../types";

/**
 * Props for the FieldRenderer component.
 */
export interface FieldRendererProps {
  /** Field element configuration */
  config: FieldElement;
}

const CustomFieldRenderer: CustomFieldComponent = ({
  config,
  field,
  fieldState,
}) => {
  const { customComponents } = useDynamicFormContext();

  const FieldComponent = customComponents[
    config.component
  ] as CustomFieldComponent;

  if (!FieldComponent) {
    console.warn(
      `No custom component registered for: "${config.component}". ` +
        "Make sure to pass it in the customComponents prop."
    );
    return null;
  }

  return (
    <FieldComponent config={config} field={field} fieldState={fieldState} />
  );
};

const StandardFieldRenderer: BaseFieldComponent = ({
  config,
  field,
  fieldState,
}) => {
  const { fieldComponents } = useDynamicFormContext();
  const FieldComponent = fieldComponents[
    config.type as StandardFieldComponentType
  ] as BaseFieldComponent;

  if (!FieldComponent) {
    console.warn(
      `No field component registered for type: "${config.type}". ` +
        "Make sure to provide all field types in the fieldComponents prop."
    );
    return null;
  }

  return (
    <FieldComponent config={config} field={field} fieldState={fieldState} />
  );
};

/**
 * Renders a single field using the registered field component.
 *
 * This component:
 * 1. Gets the react-hook-form controller for the field
 * 2. Resolves the appropriate field component from the registry
 * 3. Passes the controller props (field, fieldState) to the component
 *
 * @example
 * ```tsx
 * // Used internally by ElementRenderer
 * <FieldRenderer config={{ type: 'text', name: 'source.name', label: 'Name' }} />
 * ```
 */
export const FieldRenderer: React.FC<FieldRendererProps> = ({ config }) => {
  const { form, visibility, fieldComponents } = useDynamicFormContext();

  // Get controller from react-hook-form (must be called before any early returns)
  const { field, fieldState } = useController({
    name: config.name,
    control: form.control,
  });

  // Check visibility (Phase 4 - for now all fields are visible)
  const isVisible = visibility[config.name] !== false;
  if (!isVisible) {
    return null;
  }

  if (isCustomFieldElement(config)) {
    return (
      <CustomFieldRenderer
        config={config}
        field={field}
        fieldState={fieldState}
      />
    );
  }

  const FieldComponent = fieldComponents[config.type];

  if (!FieldComponent) {
    console.warn(
      `No field component registered for type: "${config.type}". ` +
        "Make sure to provide all field types in the fieldComponents prop."
    );
    return null;
  }

  return (
    <StandardFieldRenderer
      config={config}
      field={field}
      fieldState={fieldState}
    />
  );
};

FieldRenderer.displayName = "FieldRenderer";
