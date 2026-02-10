import { useDynamicFormContext } from "../hooks";
import type { ContainerComponent, ContainerElement } from "../types";
import { ColumnRenderer } from "./ColumnRenderer";
import { ElementRenderer } from "./ElementRenderer";

/**
 * Props for the ContainerRenderer component.
 */
export interface ContainerRendererProps {
  /** Container element configuration */
  config: ContainerElement;
}

/**
 * Default container styles using flexbox.
 */
const defaultContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
};

/**
 * Default container component used when no custom container is provided.
 * Receives config and children props as per ContainerProps interface.
 */
const DefaultContainer: ContainerComponent = ({ children }) => {
  return <div style={defaultContainerStyle}>{children}</div>;
};

/**
 * Renders a container element with its columns or children.
 *
 * The ContainerRenderer:
 * 1. Checks visibility (Phase 4 - currently all containers are visible)
 * 2. Looks up custom container component by variant (default, section, etc.)
 * 3. Renders columns or children based on container type
 *
 * @example
 * ```tsx
 * // Column-based container (default)
 * <ContainerRenderer
 *   config={{
 *     type: 'container',
 *     columns: [
 *       { type: 'column', width: '50%', elements: [...] },
 *       { type: 'column', width: '50%', elements: [...] }
 *     ]
 *   }}
 * />
 *
 * // Section container with children
 * <ContainerRenderer
 *   config={{
 *     type: 'container',
 *     variant: 'section',
 *     id: 'case-information',
 *     title: 'Case Information',
 *     icon: 'faFileAlt',
 *     children: [...]
 *   }}
 * />
 * ```
 */
export const ContainerRenderer: React.FC<ContainerRendererProps> = ({
  config,
}) => {
  const { customContainers } = useDynamicFormContext();

  // Look for a custom container component by variant
  // Falls back to 'default' if variant not specified or not found
  const variant = config.variant ?? "default";
  const ContainerComponent =
    customContainers?.[variant] ??
    customContainers?.default ??
    DefaultContainer;

  // Render children based on container type
  let renderedChildren: React.ReactNode;

  if (config.children && config.children.length > 0) {
    renderedChildren = config.children.map((element, idx) => {
      const key =
        "name" in element && element.name
          ? String(element.name)
          : `element-${idx}`;
      return <ElementRenderer config={element} key={key} />;
    });
  } else if (config.columns && config.columns.length > 0) {
    renderedChildren = config.columns.map((column, idx) => {
      const key = `column-${idx}`;
      return <ColumnRenderer config={column} key={key} />;
    });
  } else {
    renderedChildren = null;
  }

  return (
    <ContainerComponent config={config}>{renderedChildren}</ContainerComponent>
  );
};

ContainerRenderer.displayName = "ContainerRenderer";
