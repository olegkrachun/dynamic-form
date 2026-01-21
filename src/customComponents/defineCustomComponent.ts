import type { CustomComponentDefinition } from "./types";

export function defineCustomComponent<
  TProps extends Record<string, unknown> = Record<string, unknown>,
>(
  definition: CustomComponentDefinition<TProps>
): CustomComponentDefinition<TProps> {
  return definition;
}
