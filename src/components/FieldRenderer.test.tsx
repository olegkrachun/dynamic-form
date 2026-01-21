/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DynamicForm } from "../DynamicForm";
import type {
  CustomComponentRegistry,
  FieldComponentRegistry,
  FormConfiguration,
} from "../types";

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

describe("FieldRenderer", () => {
  describe("standard field rendering", () => {
    it("renders text field with label", () => {
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

    it("renders email field", () => {
      const config: FormConfiguration = {
        elements: [{ type: "email", name: "email", label: "Email Address" }],
      };

      render(
        <DynamicForm
          config={config}
          fieldComponents={mockFieldComponents}
          onSubmit={vi.fn()}
        />
      );

      expect(screen.getByTestId("field-email")).toBeInTheDocument();
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    });

    it("renders boolean field", () => {
      const config: FormConfiguration = {
        elements: [{ type: "boolean", name: "agree", label: "I agree" }],
      };

      render(
        <DynamicForm
          config={config}
          fieldComponents={mockFieldComponents}
          onSubmit={vi.fn()}
        />
      );

      expect(screen.getByTestId("field-agree")).toBeInTheDocument();
    });
  });

  describe("custom field rendering", () => {
    it("renders custom component with componentProps", () => {
      const customComponents: CustomComponentRegistry = {
        RatingField: ({ componentProps }) => (
          <div data-testid="custom-rating">
            Stars: {(componentProps as { maxStars: number }).maxStars}
          </div>
        ),
      };

      const config: FormConfiguration = {
        elements: [
          {
            type: "custom",
            name: "rating",
            component: "RatingField",
            componentProps: { maxStars: 5 },
          },
        ],
      };

      render(
        <DynamicForm
          config={config}
          customComponents={customComponents}
          fieldComponents={mockFieldComponents}
          onSubmit={vi.fn()}
        />
      );

      expect(screen.getByTestId("custom-rating")).toBeInTheDocument();
      expect(screen.getByText("Stars: 5")).toBeInTheDocument();
    });
  });

  describe("visibility", () => {
    it("hides field when visibility is false", () => {
      const config: FormConfiguration = {
        elements: [
          {
            type: "text",
            name: "hidden",
            label: "Hidden Field",
            visible: { "===": [1, 0] }, // Always false
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

      expect(screen.queryByTestId("field-hidden")).not.toBeInTheDocument();
    });

    it("shows field when visibility is true", () => {
      const config: FormConfiguration = {
        elements: [
          {
            type: "text",
            name: "visible",
            label: "Visible Field",
            visible: { "===": [1, 1] }, // Always true
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

      expect(screen.getByTestId("field-visible")).toBeInTheDocument();
    });
  });

  describe("field wrapper", () => {
    it("wraps field with custom wrapper", () => {
      const config: FormConfiguration = {
        elements: [{ type: "text", name: "wrapped", label: "Wrapped Field" }],
      };

      const fieldWrapper = (
        props: { name: string },
        children: React.ReactNode
      ) => (
        <div className="custom-wrapper" data-testid={`wrapper-${props.name}`}>
          {children}
        </div>
      );

      render(
        <DynamicForm
          config={config}
          fieldComponents={mockFieldComponents}
          fieldWrapper={fieldWrapper}
          onSubmit={vi.fn()}
        />
      );

      expect(screen.getByTestId("wrapper-wrapped")).toBeInTheDocument();
      expect(screen.getByTestId("field-wrapped")).toBeInTheDocument();
    });

    it("passes field state to wrapper", () => {
      const config: FormConfiguration = {
        elements: [{ type: "text", name: "stateful", label: "Stateful Field" }],
      };

      const fieldWrapper = (
        props: { name: string; value: unknown },
        children: React.ReactNode
      ) => (
        <div data-testid={`wrapper-${props.name}`}>
          <span data-testid="wrapper-value">{String(props.value ?? "")}</span>
          {children}
        </div>
      );

      render(
        <DynamicForm
          config={config}
          fieldComponents={mockFieldComponents}
          fieldWrapper={fieldWrapper}
          initialData={{ stateful: "test-value" }}
          onSubmit={vi.fn()}
        />
      );

      expect(screen.getByTestId("wrapper-stateful")).toBeInTheDocument();
      expect(screen.getByTestId("wrapper-value")).toHaveTextContent(
        "test-value"
      );
    });
  });
});
