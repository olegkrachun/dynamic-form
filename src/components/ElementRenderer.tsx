import type { FC } from "react";
import type { FormElement } from "../types";
import { isColumnElement, isContainerElement, isFieldElement } from "../types";
import { ContainerRenderer } from "./ContainerRenderer";
import { FieldRenderer } from "./FieldRenderer";

/**
 * Props for the ElementRenderer component.
 */
export interface ElementRendererProps {
  /** Form element configuration (field, container, or column) */
  config: FormElement;
}

/**
 * Dispatches rendering to the appropriate component based on element type.
 *
 * Supports field elements (Phase 1) and container/column layouts (Phase 2).
 * Sections are handled as containers with variant: 'section'.
 *
 * @example
 * ```tsx
 * // Field element
 * <ElementRenderer config={{ type: 'text', name: 'name', label: 'Name' }} />
 *
 * // Container element with columns
 * <ElementRenderer config={{
 *   type: 'container',
 *   columns: [
 *     { type: 'column', width: '50%', elements: [...] }
 *   ]
 * }} />
 *
 * // Section container
 * <ElementRenderer config={{
 *   type: 'container',
 *   variant: 'section',
 *   id: 'case-info',
 *   title: 'Case Information',
 *   children: [...]
 * }} />
 * ```
 */
export const ElementRenderer: FC<ElementRendererProps> = ({ config }) => {
  // Field elements - render with FieldRenderer
  if (isFieldElement(config)) {
    return <FieldRenderer config={config} />;
  }

  // Container elements (including sections with variant)
  if (isContainerElement(config)) {
    return <ContainerRenderer config={config} />;
  }

  // Column elements (shouldn't be rendered directly)
  if (isColumnElement(config)) {
    console.warn(
      "Column elements should not be rendered directly. " +
        "They should be children of a container element."
    );
    return null;
  }

  // Unknown element type
  console.warn(`Unknown element type: ${(config as { type?: string }).type}`);
  return null;
};

ElementRenderer.displayName = "ElementRenderer";
