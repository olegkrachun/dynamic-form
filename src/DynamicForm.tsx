import type React from "react";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormRenderer } from "./components";
import { DynamicFormContext, type DynamicFormContextValue } from "./context";
import { parseConfiguration } from "./parser";
import { createVisibilityAwareResolver } from "./resolver";
import { generateZodSchema } from "./schema";
import type { DynamicFormProps, DynamicFormRef, FormData } from "./types";
import {
  buildDependencyMap,
  calculateVisibility,
  findFieldByName,
  getFieldDefault,
  getUpdatedVisibility,
  mergeDefaults,
} from "./utils";

interface DynamicFormPropsWithRef extends DynamicFormProps {
  ref?: React.Ref<DynamicFormRef>;
}

export const DynamicForm = ({
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
  resolver: externalResolver,
  schema: externalSchema,
  mode = "onChange",
  invisibleFieldValidation = "skip",
  className,
  style,
  id,
  children,
  fieldWrapper,
  ref,
}: DynamicFormPropsWithRef): React.ReactElement => {
  const parsedConfig = useMemo(() => parseConfiguration(config), [config]);

  const internalZodSchema = useMemo(() => {
    if (externalResolver || externalSchema) {
      return null;
    }
    return generateZodSchema(parsedConfig);
  }, [parsedConfig, externalResolver, externalSchema]);

  const defaultValues = useMemo(
    () => mergeDefaults(parsedConfig, initialData),
    [parsedConfig, initialData]
  );

  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    calculateVisibility(
      parsedConfig.elements,
      defaultValues as Record<string, unknown>
    )
  );

  // Refs for stable closure access (prevents stale closures in subscriptions)
  const visibilityRef = useRef(visibility);
  visibilityRef.current = visibility;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const resolver = useMemo(() => {
    if (externalResolver) {
      return externalResolver;
    }

    if (externalSchema) {
      return createVisibilityAwareResolver({
        schema: externalSchema,
        getVisibility: () => visibilityRef.current,
        invisibleFieldValidation,
      });
    }

    if (internalZodSchema) {
      return createVisibilityAwareResolver({
        schema: internalZodSchema,
        getVisibility: () => visibilityRef.current,
        invisibleFieldValidation,
      });
    }

    return undefined;
  }, [
    externalResolver,
    externalSchema,
    internalZodSchema,
    invisibleFieldValidation,
  ]);

  const form = useForm<FormData>({ defaultValues, resolver, mode });

  useImperativeHandle(
    ref,
    () => ({
      getValues: () => form.getValues(),
      setValue: (name: string, value: unknown) => form.setValue(name, value),
      watch: (name?: string) => (name ? form.watch(name) : form.watch()),
      reset: (values?: FormData) => form.reset(values ?? defaultValues),
      trigger: (name?: string) => form.trigger(name),
    }),
    [form, defaultValues]
  );

  const dependencyMap = useMemo(
    () => buildDependencyMap(parsedConfig.elements),
    [parsedConfig]
  );

  const previousValuesRef = useRef<Record<string, unknown>>({});

  // Single watch subscription: visibility + dependency resets + onChange
  useEffect(() => {
    const handleDependencyReset = (
      fieldName: string,
      formValues: Record<string, unknown>
    ) => {
      const dependents = dependencyMap[fieldName];
      if (!dependents) {
        return;
      }

      const currentValue = formValues[fieldName];
      const previousValue = previousValuesRef.current[fieldName];
      if (currentValue === previousValue) {
        return;
      }

      previousValuesRef.current[fieldName] = currentValue;
      for (const dep of dependents) {
        const field = findFieldByName(parsedConfig.elements, dep);
        if (field && field.resetOnParentChange !== false) {
          form.setValue(dep, getFieldDefault(field));
        }
      }
    };

    const subscription = form.watch((values, { name }) => {
      const formValues = values as Record<string, unknown>;

      const newVisibility = calculateVisibility(
        parsedConfig.elements,
        formValues
      );
      setVisibility((prev) => getUpdatedVisibility(prev, newVisibility));

      if (!name) {
        return;
      }

      handleDependencyReset(name, formValues);
      onChangeRef.current?.(values as FormData, name);
    });

    return () => subscription.unsubscribe();
  }, [form, parsedConfig, dependencyMap]);

  const { errors: formErrors, isValid: formIsValid } = form.formState;

  useEffect(() => {
    if (!onValidationChange) {
      return;
    }
    onValidationChange(formErrors, formIsValid);
  }, [formErrors, formIsValid, onValidationChange]);

  const contextValue: DynamicFormContextValue = useMemo(
    () => ({
      form,
      config: parsedConfig,
      fieldComponents,
      customComponents,
      customContainers,
      visibility,
      fieldWrapper,
    }),
    [
      form,
      parsedConfig,
      fieldComponents,
      customComponents,
      customContainers,
      visibility,
      fieldWrapper,
    ]
  );

  const handleSubmit = form.handleSubmit(
    async (data) => onSubmit(data),
    (errors) => onError?.(errors)
  );

  const handleReset = useCallback(() => {
    form.reset(defaultValues);
    onReset?.();
  }, [defaultValues, onReset, form]);

  return (
    <FormProvider {...form}>
      <DynamicFormContext.Provider value={contextValue}>
        <form
          className={className}
          id={id}
          noValidate
          onReset={handleReset}
          onSubmit={handleSubmit}
          style={style}
        >
          <FormRenderer elements={parsedConfig.elements} />
          {children}
        </form>
      </DynamicFormContext.Provider>
    </FormProvider>
  );
};

DynamicForm.displayName = "DynamicForm";

export default DynamicForm;
