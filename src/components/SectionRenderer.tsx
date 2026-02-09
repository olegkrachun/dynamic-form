import type React from "react";
import { useDynamicFormContext } from "../hooks/useDynamicFormContext";
import type { SectionElement, SectionProps } from "../types";
import { FormRenderer } from "./FormRenderer";

/**
 * Props for the SectionRenderer component.
 */
export interface SectionRendererProps {
  /** Section element configuration */
  config: SectionElement;
}

/**
 * Default section component that renders a simple wrapper.
 * Users should provide their own section component via sectionComponent prop.
 */
const DefaultSectionComponent: React.FC<SectionProps> = ({
  config,
  children,
}) => (
  <section aria-label={config.title} id={config.id}>
    <h2>{config.title}</h2>
    {children}
  </section>
);

/**
 * Renders a section element with its children.
 *
 * Uses the registered section component from context, or falls back to default.
 * Section elements wrap groups of fields with a header.
 *
 * @example
 * ```tsx
 * <SectionRenderer config={{
 *   type: 'section',
 *   id: 'contact',
 *   title: 'Contact Information',
 *   children: [
 *     { type: 'text', name: 'name', label: 'Name' },
 *     { type: 'email', name: 'email', label: 'Email' },
 *   ]
 * }} />
 * ```
 */
export const SectionRenderer: React.FC<SectionRendererProps> = ({ config }) => {
  const { sectionComponent } = useDynamicFormContext();

  const SectionComponent = sectionComponent ?? DefaultSectionComponent;

  return (
    <SectionComponent config={config}>
      <FormRenderer elements={config.children} />
    </SectionComponent>
  );
};

SectionRenderer.displayName = "SectionRenderer";
