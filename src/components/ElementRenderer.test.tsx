/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DynamicForm } from "../DynamicForm";
import type { FieldComponentRegistry, FormConfiguration } from "../types";

const mockFieldComponents: FieldComponentRegistry = {
  text: ({ config, field }) => (
    <div data-testid={`field-${config.name}`}>
      <label htmlFor={field.name}>{config.label}</label>
      <input id={field.name} {...field} />
    </div>
  ),
  email: ({ config, field }) => (
    <div data-testid={`field-${config.name}`}>
      <label htmlFor={field.name}>{config.label}</label>
      <input id={field.name} type="email" {...field} />
    </div>
  ),
  boolean: ({ config, field }) => (
    <div data-testid={`field-${config.name}`}>
      <label>
        <input type="checkbox" {...field} />
        {config.label}
      </label>
    </div>
  ),
  phone: ({ config, field }) => (
    <div data-testid={`field-${config.name}`}>
      <label htmlFor={field.name}>{config.label}</label>
      <input id={field.name} type="tel" {...field} />
    </div>
  ),
  date: ({ config, field }) => (
    <div data-testid={`field-${config.name}`}>
      <label htmlFor={field.name}>{config.label}</label>
      <input id={field.name} type="date" {...field} />
    </div>
  ),
  select: ({ config, field }) => (
    <div data-testid={`field-${config.name}`}>
      <label htmlFor={field.name}>{config.label}</label>
      <select id={field.name} {...field} />
    </div>
  ),
  array: ({ config }) => (
    <div data-testid={`field-${config.name}`}>
      <span>{config.label} (array)</span>
    </div>
  ),
};

describe("ElementRenderer", () => {
  it("renders field elements via FieldRenderer", () => {
    const config: FormConfiguration = {
      elements: [{ type: "text", name: "username", label: "Username" }],
    };

    render(
      <DynamicForm
        config={config}
        fieldComponents={mockFieldComponents}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByTestId("field-username")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
  });

  it("renders container elements via ContainerRenderer", () => {
    const config: FormConfiguration = {
      elements: [
        {
          type: "container",
          columns: [
            {
              type: "column",
              width: "100%",
              elements: [
                { type: "text", name: "nested", label: "Nested Field" },
              ],
            },
          ],
        },
      ],
    };

    render(
      <DynamicForm
        config={config}
        fieldComponents={mockFieldComponents}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByTestId("field-nested")).toBeInTheDocument();
  });

  it("handles all standard field types", () => {
    const config: FormConfiguration = {
      elements: [
        { type: "text", name: "text", label: "Text" },
        { type: "email", name: "email", label: "Email" },
        { type: "boolean", name: "bool", label: "Boolean" },
        { type: "phone", name: "phone", label: "Phone" },
        { type: "date", name: "date", label: "Date" },
      ],
    };

    render(
      <DynamicForm
        config={config}
        fieldComponents={mockFieldComponents}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByTestId("field-text")).toBeInTheDocument();
    expect(screen.getByTestId("field-email")).toBeInTheDocument();
    expect(screen.getByTestId("field-bool")).toBeInTheDocument();
    expect(screen.getByTestId("field-phone")).toBeInTheDocument();
    expect(screen.getByTestId("field-date")).toBeInTheDocument();
  });

  it("renders multiple elements in order", () => {
    const config: FormConfiguration = {
      elements: [
        { type: "text", name: "first", label: "First" },
        { type: "email", name: "second", label: "Second" },
        { type: "boolean", name: "third", label: "Third" },
      ],
    };

    render(
      <DynamicForm
        config={config}
        fieldComponents={mockFieldComponents}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByTestId("field-first")).toBeInTheDocument();
    expect(screen.getByTestId("field-second")).toBeInTheDocument();
    expect(screen.getByTestId("field-third")).toBeInTheDocument();
  });
});
