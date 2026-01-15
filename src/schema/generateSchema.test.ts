import { describe, expect, it } from "vitest";
import type { FormConfiguration } from "../types";
import { generateZodSchema } from "./generateSchema";

describe("generateZodSchema", () => {
  it("should generate schema for simple text field", () => {
    const config: FormConfiguration = {
      elements: [{ type: "text", name: "name" }],
    };

    const schema = generateZodSchema(config);
    const result = schema.safeParse({ name: "John" });

    expect(result.success).toBe(true);
  });

  it("should generate schema for nested field paths", () => {
    const config: FormConfiguration = {
      elements: [
        { type: "text", name: "source.name" },
        { type: "email", name: "source.email" },
      ],
    };

    const schema = generateZodSchema(config);
    const result = schema.safeParse({
      source: {
        name: "John",
        email: "john@example.com",
      },
    });

    expect(result.success).toBe(true);
  });

  it("should validate required fields", () => {
    const config: FormConfiguration = {
      elements: [
        {
          type: "text",
          name: "name",
          validation: { required: true },
        },
      ],
    };

    const schema = generateZodSchema(config);

    // Empty string should fail
    const failResult = schema.safeParse({ name: "" });
    expect(failResult.success).toBe(false);

    // Non-empty string should pass
    const passResult = schema.safeParse({ name: "John" });
    expect(passResult.success).toBe(true);
  });

  it("should validate minLength", () => {
    const config: FormConfiguration = {
      elements: [
        {
          type: "text",
          name: "name",
          validation: { minLength: 3 },
        },
      ],
    };

    const schema = generateZodSchema(config);

    // Too short should fail
    const failResult = schema.safeParse({ name: "Jo" });
    expect(failResult.success).toBe(false);

    // Long enough should pass
    const passResult = schema.safeParse({ name: "John" });
    expect(passResult.success).toBe(true);
  });

  it("should validate maxLength", () => {
    const config: FormConfiguration = {
      elements: [
        {
          type: "text",
          name: "name",
          validation: { maxLength: 5 },
        },
      ],
    };

    const schema = generateZodSchema(config);

    // Too long should fail
    const failResult = schema.safeParse({ name: "Jonathan" });
    expect(failResult.success).toBe(false);

    // Short enough should pass
    const passResult = schema.safeParse({ name: "John" });
    expect(passResult.success).toBe(true);
  });

  it("should validate pattern", () => {
    const config: FormConfiguration = {
      elements: [
        {
          type: "text",
          name: "code",
          validation: { pattern: "^[A-Z]{3}$" },
        },
      ],
    };

    const schema = generateZodSchema(config);

    // Non-matching should fail
    const failResult = schema.safeParse({ code: "abc" });
    expect(failResult.success).toBe(false);

    // Matching should pass
    const passResult = schema.safeParse({ code: "ABC" });
    expect(passResult.success).toBe(true);
  });

  it("should validate email fields", () => {
    const config: FormConfiguration = {
      elements: [{ type: "email", name: "email" }],
    };

    const schema = generateZodSchema(config);

    // Invalid email should fail
    const failResult = schema.safeParse({ email: "notanemail" });
    expect(failResult.success).toBe(false);

    // Valid email should pass
    const passResult = schema.safeParse({ email: "test@example.com" });
    expect(passResult.success).toBe(true);
  });

  it("should generate schema for boolean fields", () => {
    const config: FormConfiguration = {
      elements: [{ type: "boolean", name: "active" }],
    };

    const schema = generateZodSchema(config);

    // Boolean should pass
    const result = schema.safeParse({ active: true });
    expect(result.success).toBe(true);

    // String should fail (strict typing)
    const failResult = schema.safeParse({ active: "true" });
    expect(failResult.success).toBe(false);
  });

  it("should handle required boolean (must be true)", () => {
    const config: FormConfiguration = {
      elements: [
        {
          type: "boolean",
          name: "acceptTerms",
          validation: { required: true },
        },
      ],
    };

    const schema = generateZodSchema(config);

    // false should fail for required boolean
    const failResult = schema.safeParse({ acceptTerms: false });
    expect(failResult.success).toBe(false);

    // true should pass
    const passResult = schema.safeParse({ acceptTerms: true });
    expect(passResult.success).toBe(true);
  });

  it("should generate schema for all field types together", () => {
    const config: FormConfiguration = {
      elements: [
        { type: "text", name: "source.name" },
        { type: "email", name: "source.email" },
        { type: "phone", name: "source.phone" },
        { type: "boolean", name: "source.active" },
        { type: "date", name: "source.birthDate" },
      ],
    };

    const schema = generateZodSchema(config);
    const result = schema.safeParse({
      source: {
        name: "John",
        email: "john@example.com",
        phone: "1234567890",
        active: true,
        birthDate: "1990-01-01",
      },
    });

    expect(result.success).toBe(true);
  });
});
