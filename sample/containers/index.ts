import type { CustomContainerRegistry } from "../../src";
import { Container } from "./Container";

/**
 * Sample container registry.
 * Custom containers are registered by name and can be used
 * to provide styled layout wrappers for form sections.
 *
 * The 'default' key is used when no specific container type is specified.
 */
export const sampleContainerComponents: CustomContainerRegistry = {
  default: Container,
};

export { Column } from "./Column";
export { Container } from "./Container";
