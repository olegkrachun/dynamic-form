export class ConfigurationError extends Error {
  readonly path?: string;
  readonly component?: string;

  constructor(message: string, path?: string, component?: string) {
    super(message);
    this.name = "ConfigurationError";
    this.path = path;
    this.component = component;

    const ErrorWithCapture = Error as unknown as {
      captureStackTrace?: (target: Error, constructorFn: unknown) => void;
    };
    if (ErrorWithCapture.captureStackTrace) {
      ErrorWithCapture.captureStackTrace(this, ConfigurationError);
    }
  }

  static formatMessage(
    baseMessage: string,
    path?: string,
    component?: string
  ): string {
    const parts: string[] = [];

    if (component) {
      parts.push(`Component "${component}"`);
    }

    if (path) {
      parts.push(`at ${path}`);
    }

    if (parts.length > 0) {
      return `${parts.join(" ")}: ${baseMessage}`;
    }

    return baseMessage;
  }
}
