import type { ColumnProps } from "../../src";

/**
 * Sample column component with basic styling.
 * This demonstrates how custom column components could be used
 * if the column rendering were customizable (future enhancement).
 *
 * Note: Currently columns are rendered by the internal ColumnRenderer.
 * This sample serves as a reference for potential future customization.
 */
export const Column: React.FC<ColumnProps> = ({ config, children }) => {
  return (
    <div
      className="column-wrapper"
      style={{
        width: config.width,
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
};

Column.displayName = "Column";
