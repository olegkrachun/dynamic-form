import type { ContainerComponent } from "../../src";

/**
 * Sample container component with card-like styling.
 * This demonstrates how custom containers can be used
 * to provide styled layout wrappers for form sections.
 */
export const Container: ContainerComponent = ({ children }) => {
  return <div className="container-wrapper">{children}</div>;
};

Container.displayName = "Container";
