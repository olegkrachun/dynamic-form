import type { ColumnElement } from "../types";
import { ElementRenderer } from "./ElementRenderer";

/**
 * Props for the ColumnRenderer component.
 */
export interface ColumnRendererProps {
  /** Column element configuration */
  config: ColumnElement;
}

/**
 * Renders a column element with its nested form elements.
 *
 * The ColumnRenderer:
 * 1. Applies the configured width to the column wrapper
 * 2. Recursively renders nested elements via ElementRenderer
 *
 * Columns support nested containers, enabling complex layout hierarchies.
 *
 * @example
 * ```tsx
 * <ColumnRenderer
 *   config={{
 *     type: 'column',
 *     width: '50%',
 *     elements: [
 *       { type: 'text', name: 'firstName', label: 'First Name' },
 *       { type: 'text', name: 'lastName', label: 'Last Name' }
 *     ]
 *   }}
 * />
 * ```
 */
export const ColumnRenderer: React.FC<ColumnRendererProps> = ({ config }) => {
  // Check visibility (Phase 4 - for now all columns are visible)
  // In Phase 4, we'll evaluate config.visible using JSON Logic

  // Calculate width accounting for gaps in flex containers
  // Using calc() to subtract a portion of the expected gap
  const columnStyle: React.CSSProperties = {
    flex: `0 1 ${config.width}`,
    maxWidth: config.width,
    minWidth: 0,
    boxSizing: "border-box",
  };

  return (
    <div style={columnStyle}>
      {config.elements.map((element, index) => (
        <ElementRenderer
          config={element}
          key={"name" in element ? String(element.name) : `element-${index}`}
        />
      ))}
    </div>
  );
};

ColumnRenderer.displayName = "ColumnRenderer";
