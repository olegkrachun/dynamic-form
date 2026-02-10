import type { FormConfiguration } from "../types/config";
import type {
  ColumnElement,
  ContainerElement,
  FormElement,
} from "../types/elements";
import type { CustomComponentRegistry } from "./types";
import {
  isCustomElement,
  type ValidatedCustomElement,
  validateCustomElement,
} from "./validateCustomElement";

/**
 * Recursively validate all custom elements in a form configuration.
 */
export function validateCustomComponents(
  config: FormConfiguration,
  registry: CustomComponentRegistry = {}
): FormConfiguration {
  const validatedElements = validateElements(
    config.elements,
    registry,
    "elements"
  );

  return {
    ...config,
    elements: validatedElements,
  };
}

function validateElements(
  elements: FormElement[],
  registry: CustomComponentRegistry,
  basePath: string
): FormElement[] {
  return elements.map((element, index) => {
    const path = `${basePath}[${index}]`;
    return validateElement(element, registry, path);
  });
}

function validateElement(
  element: FormElement,
  registry: CustomComponentRegistry,
  path: string
): FormElement {
  if (isCustomElement(element)) {
    return validateCustomElement(element, registry, path);
  }

  if (isContainerElement(element)) {
    return validateContainer(element, registry, path);
  }

  if (isColumnElement(element)) {
    return validateColumn(element, registry, path);
  }

  return element;
}

function validateContainer(
  container: ContainerElement,
  registry: CustomComponentRegistry,
  path: string
): ContainerElement {
  const result = { ...container };

  // Validate columns (default container)
  if (container.columns) {
    result.columns = container.columns.map((column, index) =>
      validateColumn(column, registry, `${path}.columns[${index}]`)
    );
  }

  // Validate children (section container)
  if (container.children) {
    result.children = validateElements(
      container.children,
      registry,
      `${path}.children`
    );
  }

  return result;
}

function validateColumn(
  column: ColumnElement,
  registry: CustomComponentRegistry,
  path: string
): ColumnElement {
  const validatedElements = validateElements(
    column.elements,
    registry,
    `${path}.elements`
  );

  return {
    ...column,
    elements: validatedElements,
  };
}

function isContainerElement(element: FormElement): element is ContainerElement {
  return element.type === "container";
}

function isColumnElement(element: FormElement): element is ColumnElement {
  return element.type === "column";
}

/**
 * Collect all custom elements from a form configuration.
 * Returns elements with normalized componentProps (defaults to empty object).
 *
 * @remarks For full validation including propsSchema checks, pass the config
 * through validateCustomComponents first.
 */
export function getValidatedCustomElements(
  config: FormConfiguration
): ValidatedCustomElement[] {
  const results: ValidatedCustomElement[] = [];
  collectFromElements(config.elements, results);
  return results;
}

function collectFromElements(
  elements: FormElement[],
  results: ValidatedCustomElement[]
): void {
  for (const element of elements) {
    collectFromElement(element, results);
  }
}

function collectFromElement(
  element: FormElement,
  results: ValidatedCustomElement[]
): void {
  if (isCustomElement(element)) {
    const componentProps =
      typeof element.componentProps === "object" &&
      element.componentProps !== null
        ? element.componentProps
        : {};
    results.push({
      ...element,
      componentProps: componentProps as Record<string, unknown>,
    });
    return;
  }

  if (isContainerElement(element)) {
    collectFromContainer(element, results);
    return;
  }

  if (isColumnElement(element)) {
    collectFromElements(element.elements, results);
  }
}

function collectFromContainer(
  container: ContainerElement,
  results: ValidatedCustomElement[]
): void {
  if (container.columns) {
    for (const column of container.columns) {
      collectFromElements(column.elements, results);
    }
  }
  if (container.children) {
    collectFromElements(container.children, results);
  }
}
