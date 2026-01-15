import type { FieldComponentRegistry } from "../../src";
import { BooleanField } from "./BooleanField";
import { DateField } from "./DateField";
import { EmailField } from "./EmailField";
import { PhoneField } from "./PhoneField";
import { TextField } from "./TextField";

/**
 * Sample field component registry.
 * These are basic, unstyled implementations for testing and reference.
 */
export const sampleFieldComponents: FieldComponentRegistry = {
  text: TextField,
  email: EmailField,
  boolean: BooleanField,
  phone: PhoneField,
  date: DateField,
};

export { BooleanField } from "./BooleanField";
export { DateField } from "./DateField";
export { EmailField } from "./EmailField";
export { PhoneField } from "./PhoneField";
export { TextField } from "./TextField";
