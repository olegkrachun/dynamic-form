import type React from "react";
import type { FormElement } from "../types";
import { isColumnElement, isContainerElement, isFieldElement } from "../types";
import { ContainerRenderer } from "./ContainerRenderer";
import { FieldRenderer } from "./FieldRenderer";

/**
 * Props for the ElementRenderer component.
 */
export interface ElementRendererProps {
  /** Form element configuration (field, container, or column) */
  element: FormElement;
}

/**
 * Dispatches rendering to the appropriate component based on element type.
 *
 * Supports field elements (Phase 1) and container/column layouts (Phase 2).
 *
 * @example
 * ```tsx
 * // Field element
 * <ElementRenderer element={{ type: 'text', name: 'name', label: 'Name' }} />
 *
 * // Container element with columns
 * <ElementRenderer element={{
 *   type: 'container',
 *   columns: [
 *     { type: 'column', width: '50%', elements: [...] }
 *   ]
 * }} />
 * ```
 */
export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
}) => {
  // Field elements - render with FieldRenderer
  if (isFieldElement(element)) {
    return <FieldRenderer config={element} />;
  }

  // Container elements - Phase 2
  if (isContainerElement(element)) {
    return <ContainerRenderer config={element} />;
  }

  // Column elements - Phase 2 (shouldn't be rendered directly)
  if (isColumnElement(element)) {
    console.warn(
      "Column elements should not be rendered directly. " +
        "They should be children of a container element."
    );
    return null;
  }

  // Unknown element type
  console.warn(`Unknown element type: ${(element as { type?: string }).type}`);
  return null;
};

ElementRenderer.displayName = "ElementRenderer";
