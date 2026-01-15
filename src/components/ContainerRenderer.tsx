import { useDynamicFormContext } from "../hooks";
import type { ContainerComponent, ContainerElement } from "../types";
import { ColumnRenderer } from "./ColumnRenderer";

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
 * Renders a container element with its columns.
 *
 * The ContainerRenderer:
 * 1. Checks visibility (Phase 4 - currently all containers are visible)
 * 2. Looks up custom container component if specified
 * 3. Renders columns as children using ColumnRenderer
 *
 * @example
 * ```tsx
 * <ContainerRenderer
 *   config={{
 *     type: 'container',
 *     columns: [
 *       { type: 'column', width: '50%', elements: [...] },
 *       { type: 'column', width: '50%', elements: [...] }
 *     ]
 *   }}
 * />
 * ```
 */
export const ContainerRenderer: React.FC<ContainerRendererProps> = ({
  config,
}) => {
  const { customContainers } = useDynamicFormContext();

  // Check visibility (Phase 4 - for now all containers are visible)
  // In Phase 4, we'll evaluate config.visible using JSON Logic

  // Look for a custom container component
  // Custom containers can be specified via a containerType property (future enhancement)
  // For now, we use the default container
  const ContainerComponent = customContainers?.default ?? DefaultContainer;

  // Columns are static within a container config and don't get reordered at runtime
  const columns = config.columns.map((column, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: Columns don't have unique IDs in schema
    <ColumnRenderer config={column} key={`column-${index}`} />
  ));

  return <ContainerComponent config={config}>{columns}</ContainerComponent>;
};

ContainerRenderer.displayName = "ContainerRenderer";
