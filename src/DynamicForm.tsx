import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormRenderer } from "./components";
import { DynamicFormContext, type DynamicFormContextValue } from "./context";
import { parseConfiguration } from "./parser";
import { generateZodSchema } from "./schema";
import type { DynamicFormProps, FormData } from "./types";
import { getFieldNames, mergeDefaults } from "./utils";

/**
 * DynamicForm - A configuration-driven form component.
 *
 * Renders a complete form from JSON configuration, handling:
 * - Field rendering via provided field components
 * - Validation via dynamically generated Zod schemas
 * - Form state management via react-hook-form
 * - Event callbacks for changes and submissions
 *
 * @example
 * ```tsx
 * const config = {
 *   elements: [
 *     { type: 'text', name: 'source.name', label: 'Name', validation: { required: true } },
 *     { type: 'email', name: 'source.email', label: 'Email' },
 *   ]
 * };
 *
 * const fieldComponents = {
 *   text: MyTextInput,
 *   email: MyEmailInput,
 *   boolean: MyCheckbox,
 *   phone: MyPhoneInput,
 *   date: MyDatePicker,
 * };
 *
 * <DynamicForm
 *   config={config}
 *   fieldComponents={fieldComponents}
 *   onSubmit={(data) => console.log('Submitted:', data)}
 *   onChange={(data, field) => console.log(`${field} changed:`, data)}
 * >
 *   <button type="submit">Submit</button>
 * </DynamicForm>
 * ```
 */
export function DynamicForm({
  config,
  initialData,
  fieldComponents,
  customComponents = {},
  customContainers = {},
  onSubmit,
  onChange,
  onValidationChange,
  onReset,
  onError,
  mode = "onChange",
  className,
  style,
  id,
  children,
}: DynamicFormProps): React.ReactElement {
  // Step 1: Parse and validate configuration
  // This throws if the configuration is invalid
  const parsedConfig = useMemo(() => {
    return parseConfiguration(config);
  }, [config]);

  // Step 2: Generate Zod schema from configuration
  // Schema is generated once and memoized
  const zodSchema = useMemo(() => {
    return generateZodSchema(parsedConfig);
  }, [parsedConfig]);

  // Step 3: Calculate default values
  // Merges config defaults with initialData
  const defaultValues = useMemo(() => {
    return mergeDefaults(parsedConfig, initialData);
  }, [parsedConfig, initialData]);

  // Step 4: Initialize visibility state (all visible for Phase 1)
  const visibility = useMemo(() => {
    const fieldNames = getFieldNames(parsedConfig.elements);
    return fieldNames.reduce(
      (acc, name) => {
        acc[name] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
  }, [parsedConfig]);

  // Step 5: Initialize react-hook-form with Zod resolver
  const form = useForm<FormData>({
    defaultValues,
    resolver: zodResolver(zodSchema),
    mode,
  });

  // Step 6: Subscribe to value changes for onChange callback
  useEffect(() => {
    if (!onChange) {
      return;
    }

    const subscription = form.watch((values, { name }) => {
      if (name) {
        onChange(values as FormData, name);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Step 7: Subscribe to validation state changes
  useEffect(() => {
    if (!onValidationChange) {
      return;
    }

    const subscription = form.watch(() => {
      // Trigger validation and get current state
      const { errors, isValid } = form.formState;
      onValidationChange(errors, isValid);
    });

    return () => subscription.unsubscribe();
  }, [form, onValidationChange]);

  // Step 8: Create context value
  const contextValue: DynamicFormContextValue = useMemo(
    () => ({
      form,
      config: parsedConfig,
      fieldComponents,
      customComponents,
      customContainers,
      visibility,
    }),
    [
      form,
      parsedConfig,
      fieldComponents,
      customComponents,
      customContainers,
      visibility,
    ]
  );

  // Step 9: Handle form submission
  const handleSubmit = form.handleSubmit(
    // Success handler
    async (data) => {
      await onSubmit(data);
    },
    // Error handler
    (errors) => {
      onError?.(errors);
    }
  );

  // Step 10: Handle form reset
  const handleReset = () => {
    form.reset(defaultValues);
    onReset?.();
  };

  return (
    <FormProvider {...form}>
      <DynamicFormContext.Provider value={contextValue}>
        <form
          className={className}
          id={id}
          noValidate
          onReset={handleReset}
          onSubmit={handleSubmit}
          style={style} // Let react-hook-form handle validation
        >
          <FormRenderer elements={parsedConfig.elements} />
          {children}
        </form>
      </DynamicFormContext.Provider>
    </FormProvider>
  );
}

DynamicForm.displayName = "DynamicForm";

export default DynamicForm;
