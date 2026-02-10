# Dynamic Forms

Configuration-driven form generation library for React with react-hook-form and Zod integration.

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration Reference](#configuration-reference)
  - [FormConfiguration](#formconfiguration)
  - [Field Types](#field-types)
  - [Validation Configuration](#validation-configuration)
  - [Container Layout](#container-layout)
  - [Section Containers](#section-containers)
- [Usage Examples](#usage-examples)
  - [Nested Field Paths](#nested-field-paths)
  - [Two-Column Layout](#two-column-layout)
  - [Section Layout](#section-layout)
  - [Custom Field Component](#custom-field-component)
  - [JSON Logic Conditional Validation](#json-logic-conditional-validation)
- [API Reference](#api-reference)
  - [DynamicForm Props](#dynamicform-props)
  - [Validation Options](#validation-options)
  - [Hooks](#hooks)
  - [Exports](#exports)
- [Creating Field Components](#creating-field-components)
- [Creating Custom Containers](#creating-custom-containers)
- [Development](#development)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Dynamic Forms enables rapid deployment of data collection forms by defining form structures, validations, and display logic through declarative JSON configurations. Instead of writing custom form components for each use case, describe your form as data and let the library handle rendering and validation.

**Key Benefits:**
- Define forms as JSON configuration
- Flexible validation: external resolver, Zod schema, or config-driven
- Full react-hook-form integration
- Nested field paths with dot notation
- Conditional visibility and validation with JSON Logic
- Field dependencies with cascading resets
- Select fields with static/dynamic options
- Array fields for repeatable groups
- Section containers with custom variants
- Extensible component architecture

## Installation

```bash
npm install rhf-dynamic-forms
# or
pnpm add rhf-dynamic-forms
# or
yarn add rhf-dynamic-forms
```

**Peer Dependencies:**

```bash
npm install react@^19 react-dom@^19
```

## Quick Start

```tsx
import { DynamicForm, type FormConfiguration, type FieldComponentRegistry } from 'rhf-dynamic-forms';

// 1. Define your form configuration
const config: FormConfiguration = {
  name: "Contact Form",
  elements: [
    {
      type: "text",
      name: "fullName",
      label: "Full Name",
      validation: { required: true, minLength: 2 },
    },
    {
      type: "email",
      name: "email",
      label: "Email Address",
      validation: { required: true },
    },
  ],
};

// 2. Create field components (or use a UI library)
const fieldComponents: FieldComponentRegistry = {
  text: ({ field, fieldState, config }) => (
    <div>
      <label>{config.label}</label>
      <input {...field} placeholder={config.placeholder} />
      {fieldState.error && <span>{fieldState.error.message}</span>}
    </div>
  ),
  email: ({ field, fieldState, config }) => (
    <div>
      <label>{config.label}</label>
      <input {...field} type="email" placeholder={config.placeholder} />
      {fieldState.error && <span>{fieldState.error.message}</span>}
    </div>
  ),
  boolean: ({ field, config }) => (
    <label>
      <input {...field} type="checkbox" checked={field.value} />
      {config.label}
    </label>
  ),
  phone: ({ field, config }) => (
    <div>
      <label>{config.label}</label>
      <input {...field} type="tel" />
    </div>
  ),
  date: ({ field, config }) => (
    <div>
      <label>{config.label}</label>
      <input {...field} type="date" />
    </div>
  ),
};

// 3. Render the form
function App() {
  return (
    <DynamicForm
      config={config}
      fieldComponents={fieldComponents}
      onSubmit={(data) => console.log('Submitted:', data)}
    >
      <button type="submit">Submit</button>
    </DynamicForm>
  );
}
```

## Configuration Reference

### FormConfiguration

The root configuration object that defines your form structure.

```typescript
interface FormConfiguration {
  name?: string;              // Optional form identifier
  elements: FormElement[];    // Array of fields and layouts
}
```

### Field Types

The library supports the following built-in field types:

| Type | Description | Default Value Type |
|------|-------------|-------------------|
| `text` | Single-line text input | `string` |
| `email` | Email input with validation | `string` |
| `boolean` | Checkbox or toggle | `boolean` |
| `phone` | Telephone number input | `string` |
| `date` | Date picker | `string` |
| `select` | Dropdown/multi-select with options | `string \| string[]` |
| `array` | Repeatable field groups | `array` |
| `custom` | User-defined component | `unknown` |
| `container` | Layout container (columns or sections) | N/A (layout element) |

### Field Element Structure

```typescript
interface FieldElement {
  type: "text" | "email" | "boolean" | "phone" | "date" | "custom";
  name: string;                    // Field path (supports dot notation)
  label?: string;                  // Display label
  placeholder?: string;            // Placeholder text
  defaultValue?: string | number | boolean | null;
  validation?: ValidationConfig;   // Validation rules
  visible?: JsonLogicRule;         // Conditional visibility
  dependsOn?: string;              // Field dependency for cascading
  resetOnParentChange?: boolean;   // Reset when parent changes
}
```

### Validation Configuration

```typescript
interface ValidationConfig {
  required?: boolean;              // Field must have a value
  minLength?: number;              // Minimum text length
  maxLength?: number;              // Maximum text length
  pattern?: string;                // Regex pattern
  message?: string;                // Custom error message
  condition?: JsonLogicRule;       // JSON Logic condition
}
```

### Container Layout

Create multi-column layouts with containers:

```typescript
interface ContainerElement {
  type: "container";
  variant?: string;                // Container variant (default, section, custom)
  columns?: ColumnElement[];       // For column-based layouts
  children?: FormElement[];        // For section-based layouts
  visible?: JsonLogicRule;         // Conditional visibility

  // Section-specific properties (when variant: 'section')
  id?: string;                     // Section identifier
  title?: string;                  // Section header title
  icon?: string;                   // Optional icon identifier
}

interface ColumnElement {
  type: "column";
  width: string;                   // Column width (e.g., "50%", "200px")
  elements: FormElement[];         // Fields within the column
  visible?: JsonLogicRule;         // Conditional visibility
}
```

**Column-based container example:**

```typescript
{
  type: "container",
  columns: [
    {
      type: "column",
      width: "50%",
      elements: [
        { type: "text", name: "firstName", label: "First Name" },
      ],
    },
    {
      type: "column",
      width: "50%",
      elements: [
        { type: "text", name: "lastName", label: "Last Name" },
      ],
    },
  ],
}
```

### Section Containers

Sections are containers with `variant: 'section'` that use `children` instead of `columns`:

```typescript
{
  type: "container",
  variant: "section",
  id: "personal-info",
  title: "Personal Information",
  icon: "faUser",
  children: [
    { type: "text", name: "firstName", label: "First Name" },
    { type: "text", name: "lastName", label: "Last Name" },
    { type: "email", name: "email", label: "Email" },
  ],
}
```

**Full form with sections:**

```typescript
const config: FormConfiguration = {
  elements: [
    {
      type: "container",
      variant: "section",
      id: "personal-info",
      title: "Personal Information",
      icon: "faUser",
      children: [
        {
          type: "container",
          columns: [
            { type: "column", width: "50%", elements: [
              { type: "text", name: "firstName", label: "First Name" }
            ]},
            { type: "column", width: "50%", elements: [
              { type: "text", name: "lastName", label: "Last Name" }
            ]},
          ],
        },
        { type: "email", name: "email", label: "Email" },
      ],
    },
    {
      type: "container",
      variant: "section",
      id: "address",
      title: "Address",
      icon: "faLocation",
      children: [
        { type: "text", name: "street", label: "Street" },
        { type: "text", name: "city", label: "City" },
      ],
    },
  ],
};
```

## Usage Examples

### Nested Field Paths

Use dot notation to create nested data structures:

```typescript
const config: FormConfiguration = {
  elements: [
    { type: "text", name: "contact.firstName", label: "First Name" },
    { type: "text", name: "contact.lastName", label: "Last Name" },
    { type: "email", name: "contact.email", label: "Email" },
    { type: "text", name: "address.street", label: "Street" },
    { type: "text", name: "address.city", label: "City" },
  ],
};

// Submitted data structure:
// {
//   contact: { firstName: "John", lastName: "Doe", email: "john@example.com" },
//   address: { street: "123 Main St", city: "New York" }
// }
```

### Two-Column Layout

```typescript
const config: FormConfiguration = {
  elements: [
    {
      type: "container",
      columns: [
        {
          type: "column",
          width: "50%",
          elements: [
            { type: "email", name: "email", label: "Email", validation: { required: true } },
            { type: "date", name: "birthDate", label: "Birth Date" },
          ],
        },
        {
          type: "column",
          width: "50%",
          elements: [
            { type: "phone", name: "phone", label: "Phone" },
            { type: "text", name: "company", label: "Company" },
          ],
        },
      ],
    },
  ],
};
```

### Section Layout

```typescript
import type { ContainerComponent, CustomContainerRegistry } from 'rhf-dynamic-forms';

// Custom section component
const MySection: ContainerComponent = ({ config, children }) => (
  <fieldset id={config.id} className="my-section">
    <legend>
      {config.icon && <Icon name={config.icon} />}
      <span>{config.title}</span>
    </legend>
    <div className="section-content">{children}</div>
  </fieldset>
);

// Default container (for column layouts)
const MyGridContainer: ContainerComponent = ({ config, children }) => (
  <div className="grid-container">{children}</div>
);

// Register containers by variant
const customContainers: CustomContainerRegistry = {
  default: MyGridContainer,  // Used for containers without variant
  section: MySection,        // Used for containers with variant: 'section'
};

<DynamicForm
  config={config}
  fieldComponents={fieldComponents}
  customContainers={customContainers}
  onSubmit={handleSubmit}
/>
```

### Custom Field Component

Register custom components for specialized inputs:

```tsx
import {
  defineCustomComponent,
  type CustomComponentRegistry,
  type CustomComponentRenderProps,
} from 'rhf-dynamic-forms';
import { z } from 'zod/v4';

// Option 1: Simple component
const SimpleRating = ({ field, config, componentProps }: CustomComponentRenderProps) => {
  const maxStars = (componentProps?.maxStars as number) ?? 5;
  return (
    <div>
      <label>{config.label}</label>
      <div>
        {Array.from({ length: maxStars }, (_, i) => (
          <button key={i} type="button" onClick={() => field.onChange(i + 1)}>
            {i < (field.value ?? 0) ? '★' : '☆'}
          </button>
        ))}
      </div>
    </div>
  );
};

// Option 2: Type-safe definition with Zod schema validation
const RatingField = defineCustomComponent({
  component: ({ field, componentProps }) => (
    <div className="rating">
      {Array.from({ length: componentProps.maxStars }, (_, i) => (
        <button key={i} type="button" onClick={() => field.onChange(i + 1)}>
          {i < (field.value as number ?? 0) ? '★' : '☆'}
        </button>
      ))}
    </div>
  ),
  propsSchema: z.object({
    maxStars: z.number().int().min(1).max(10).default(5),
  }),
  defaultProps: { maxStars: 5 },
  displayName: 'RatingField',
});

// Register custom components
const customComponents: CustomComponentRegistry = {
  SimpleRating,
  RatingField,
};

// Use in configuration
const config: FormConfiguration = {
  elements: [
    {
      type: "custom",
      name: "rating",
      label: "Rate our service",
      component: "RatingField",
      componentProps: { maxStars: 10 },
    },
  ],
};

<DynamicForm
  config={config}
  fieldComponents={fieldComponents}
  customComponents={customComponents}
  onSubmit={handleSubmit}
/>
```

### JSON Logic Conditional Validation

Use JSON Logic for complex validation rules that depend on other field values:

```typescript
const config: FormConfiguration = {
  elements: [
    {
      type: "boolean",
      name: "hasPhone",
      label: "I have a phone number",
    },
    {
      type: "phone",
      name: "phone",
      label: "Phone Number",
      validation: {
        condition: {
          or: [
            { "!": { var: "hasPhone" } },
            {
              and: [
                { var: "hasPhone" },
                { regex_match: ["^[0-9]{10}$", { var: "phone" }] },
              ],
            },
          ],
        },
        message: "Please enter a valid 10-digit phone number",
      },
    },
  ],
};
```

**Available JSON Logic Operations:**
- Standard operators: `var`, `and`, `or`, `!`, `==`, `!=`, `>`, `<`, `>=`, `<=`, `if`
- Custom: `regex_match` - `["pattern", { var: "fieldName" }]`

## API Reference

### DynamicForm Props

```typescript
interface DynamicFormProps {
  // Required
  config: FormConfiguration;                    // Form configuration
  fieldComponents: FieldComponentRegistry;      // Component implementations
  onSubmit: (data: FormData) => void;          // Submit handler

  // Optional - Components
  initialData?: FormData;                       // Pre-fill form values
  customComponents?: CustomComponentRegistry;   // Custom field components
  customContainers?: CustomContainerRegistry;   // Custom layout containers

  // Optional - Event handlers
  onChange?: (data: FormData, field: string) => void;
  onError?: (errors: unknown) => void;
  onReset?: () => void;
  onValidationChange?: (errors: unknown, isValid: boolean) => void;

  // Optional - Form behavior
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  invisibleFieldValidation?: "skip" | "validate" | "warn";
  fieldWrapper?: FieldWrapperFunction;          // Wrap each field

  // Optional - HTML attributes
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: React.ReactNode;
  ref?: React.Ref<DynamicFormRef>;
}
```

### Validation Options

The library supports three approaches to validation:

```tsx
// Option 1: External resolver (full control - Yup, Joi, Vest, custom)
import { yupResolver } from '@hookform/resolvers/yup';
<DynamicForm resolver={yupResolver(yupSchema)} ... />

// Option 2: External Zod schema (wrapped with visibility-aware resolver)
<DynamicForm schema={myZodSchema} invisibleFieldValidation="skip" ... />

// Option 3: Config-driven (auto-generated from field validation configs)
<DynamicForm config={configWithValidation} ... />

// Option 4: No validation (omit resolver, schema, and validation in config)
<DynamicForm config={simpleConfig} ... />
```

### Hooks

```typescript
// Access form context inside nested components
const { config, form } = useDynamicFormContext();

// Safe version that returns null outside form context
const context = useDynamicFormContextSafe();
```

### Field Component Props

All field components receive these props:

```typescript
interface BaseFieldProps {
  field: ControllerRenderProps;     // react-hook-form: value, onChange, onBlur, ref
  fieldState: ControllerFieldState; // error, invalid, isTouched, isDirty
  config: FieldElement;             // Field configuration
}
```

### Container Component Props

Custom container components receive:

```typescript
interface ContainerProps {
  config: ContainerElement;         // Container configuration (id, title, icon, etc.)
  children: React.ReactNode;        // Rendered children (columns or elements)
}
```

### Exports

```typescript
// Components & Context
export { DynamicForm, DynamicFormContext } from 'rhf-dynamic-forms';

// Hooks
export { useDynamicFormContext, useDynamicFormContextSafe } from 'rhf-dynamic-forms';

// Custom Components
export { defineCustomComponent } from 'rhf-dynamic-forms';

// Parser
export {
  parseConfiguration,
  safeParseConfiguration,
  ConfigurationError,
} from 'rhf-dynamic-forms';

// Types
export type {
  // Core configuration types
  FormConfiguration,
  FormElement,
  FieldElement,
  ContainerElement,
  ColumnElement,
  LayoutElement,
  ValidationConfig,
  FormData,

  // Component props
  DynamicFormProps,
  DynamicFormRef,
  DynamicFormContextValue,

  // Registry types
  FieldComponentRegistry,
  CustomComponentRegistry,
  CustomContainerRegistry,

  // Container types
  ContainerComponent,
  ContainerProps,
  ColumnComponent,
  ColumnProps,

  // Custom component types
  CustomComponentDefinition,
  CustomComponentRenderProps,

  // Field component types
  TextFieldComponent,
  EmailFieldComponent,
  BooleanFieldComponent,
  PhoneFieldComponent,
  DateFieldComponent,
  SelectFieldComponent,
  ArrayFieldComponent,
  CustomFieldComponent,

  // Field element types
  SelectFieldElement,
  ArrayFieldElement,
  SelectOption,
} from 'rhf-dynamic-forms';

// Utilities
export {
  generateZodSchema,
  createVisibilityAwareResolver,
  calculateVisibility,
  flattenFields,
  getFieldNames,
  mergeDefaults,
  getNestedValue,
  setNestedValue,
  applyJsonLogic,
  evaluateCondition,

  // Type guards
  isFieldElement,
  isContainerElement,
  isColumnElement,
  isCustomFieldElement,
  isArrayFieldElement,
  isSectionContainer,
} from 'rhf-dynamic-forms';
```

## Creating Field Components

Field components are React components that render form inputs:

```tsx
import type { TextFieldComponent } from 'rhf-dynamic-forms';

const TextField: TextFieldComponent = ({ field, fieldState, config }) => {
  return (
    <div className="field">
      {config.label && (
        <label htmlFor={field.name}>
          {config.label}
          {config.validation?.required && <span>*</span>}
        </label>
      )}

      <input
        id={field.name}
        type="text"
        placeholder={config.placeholder}
        aria-invalid={fieldState.invalid}
        {...field}
      />

      {fieldState.error && (
        <span role="alert">{fieldState.error.message}</span>
      )}
    </div>
  );
};
```

## Creating Custom Containers

Custom containers control layout for different container variants:

```tsx
import type { ContainerComponent, CustomContainerRegistry } from 'rhf-dynamic-forms';

// Section container with header
const Section: ContainerComponent = ({ config, children }) => (
  <section id={config.id} aria-labelledby={`${config.id}-title`}>
    <header>
      {config.icon && <Icon name={config.icon} />}
      <h2 id={`${config.id}-title`}>{config.title}</h2>
    </header>
    <div className="section-body">{children}</div>
  </section>
);

// Grid container for columns
const GridContainer: ContainerComponent = ({ config, children }) => {
  const gridTemplate = config.columns
    ?.map(col => col.width)
    .join(' ') ?? '1fr';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '1rem' }}>
      {children}
    </div>
  );
};

// Card container (custom variant)
const CardContainer: ContainerComponent = ({ config, children }) => (
  <div className="card">
    {config.title && <h3>{config.title}</h3>}
    {children}
  </div>
);

// Register by variant name
const customContainers: CustomContainerRegistry = {
  default: GridContainer,   // variant: undefined or 'default'
  section: Section,         // variant: 'section'
  card: CardContainer,      // variant: 'card'
};
```

## Redux Integration

The library handles frozen state objects from Redux automatically:

```tsx
const frozenData = useAppSelector(state => state.form.data);

// Safe to use directly - library handles cloning
<DynamicForm
  config={config}
  initialData={frozenData}
  onSubmit={handleSubmit}
/>
```

## Development

### Scripts

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Build library
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm typecheck    # TypeScript type checking
pnpm lint         # Check for lint errors
pnpm lint:fix     # Auto-fix lint errors
```

### Project Structure

```text
src/
├── components/          # React components
│   ├── FormRenderer     # Renders all elements
│   ├── ElementRenderer  # Routes to field/container
│   ├── FieldRenderer    # Renders fields via registry
│   ├── ContainerRenderer # Renders containers (columns/sections)
│   └── ColumnRenderer   # Renders columns
├── context/             # React context
├── hooks/               # useDynamicFormContext
├── parser/              # Config parsing
├── schema/              # Zod schema generation
├── resolver/            # Visibility-aware resolver
├── validation/          # JSON Logic evaluation
├── customComponents/    # Custom component utilities
├── types/               # TypeScript definitions
└── utils/               # Utilities

sample/                  # Sample application
├── App.tsx              # Demo form
├── fields/              # Sample field components
└── containers/          # Sample containers
```

## Tech Stack

- **React 19** - UI framework
- **react-hook-form** - Form state management
- **Zod v4** - Schema validation
- **TypeScript** - Type safety
- **Vitest** - Testing
- **tsdown** - Library bundling (ESM + CJS)
- **Vite** - Dev server

## Contributing

### Branch Naming Convention

Create branches using the format: `type/description`

| Type | Purpose | Example |
|------|---------|---------|
| `feat/` | New features | `feat/custom-validators` |
| `fix/` | Bug fixes | `fix/nested-path-resolution` |
| `refactor/` | Code refactoring | `refactor/schema-generation` |
| `docs/` | Documentation | `docs/api-reference` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |
| `test/` | Test additions/fixes | `test/array-field-coverage` |

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

**Format:**
```text
type(scope): description

[optional body]
```

**Examples:**
```bash
feat(schema): add support for custom validators
fix(components): resolve visibility calculation bug
refactor(parser): simplify configuration parsing logic
```

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor (1.0.0 → 1.1.0) |
| `fix` | Bug fix | Patch (1.0.0 → 1.0.1) |
| `feat!` or `BREAKING CHANGE` | Breaking change | Major (1.0.0 → 2.0.0) |
| `docs`, `chore`, `refactor`, `test` | Non-release changes | None |

### Pull Request Process

1. Create a branch from `main` using the naming convention above
2. Make your changes with conventional commit messages
3. Ensure all checks pass: `pnpm test && pnpm typecheck && pnpm lint`
4. Open a pull request to `main`
5. Address review feedback
6. Squash and merge when approved

## License

MIT
