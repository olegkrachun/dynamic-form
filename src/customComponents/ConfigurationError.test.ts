import { describe, expect, it } from "vitest";
import { ConfigurationError } from "./ConfigurationError";

describe("ConfigurationError", () => {
  describe("constructor", () => {
    it("stores path and component information", () => {
      const error = new ConfigurationError(
        "Invalid prop",
        "elements[0]",
        "RatingField"
      );

      expect(error.message).toBe("Invalid prop");
      expect(error.path).toBe("elements[0]");
      expect(error.component).toBe("RatingField");
      expect(error.name).toBe("ConfigurationError");
    });

    it("works without optional parameters", () => {
      const error = new ConfigurationError("Simple error");

      expect(error.message).toBe("Simple error");
      expect(error.path).toBeUndefined();
      expect(error.component).toBeUndefined();
    });

    it("is instanceof Error", () => {
      const error = new ConfigurationError("test");
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ConfigurationError);
    });
  });

  describe("formatMessage", () => {
    it("formats message with component and path", () => {
      const formatted = ConfigurationError.formatMessage(
        "must be positive",
        "elements[2]",
        "RatingField"
      );

      expect(formatted).toBe(
        'Component "RatingField" at elements[2]: must be positive'
      );
    });

    it("formats message with path only", () => {
      const formatted = ConfigurationError.formatMessage(
        "invalid",
        "elements[0]"
      );

      expect(formatted).toBe("at elements[0]: invalid");
    });

    it("formats message with component only", () => {
      const formatted = ConfigurationError.formatMessage(
        "invalid",
        undefined,
        "Rating"
      );

      expect(formatted).toBe('Component "Rating": invalid');
    });

    it("returns base message when no context", () => {
      const formatted = ConfigurationError.formatMessage("just message");

      expect(formatted).toBe("just message");
    });
  });
});
