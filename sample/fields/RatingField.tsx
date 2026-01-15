import type { CustomFieldComponent } from "../../src";

/**
 * Custom Rating Field - demonstrates custom component integration.
 *
 * Renders a 1-5 star rating selector that integrates with react-hook-form
 * via the standard field/fieldState props pattern.
 */
export const RatingField: CustomFieldComponent = ({
  field,
  fieldState,
  config,
}) => {
  const { error } = fieldState;
  const currentValue = (field.value as number) || 0;

  const handleClick = (rating: number) => {
    // Toggle off if clicking the same rating
    field.onChange(currentValue === rating ? 0 : rating);
  };

  return (
    <fieldset className="field rating-field">
      {config.label && <legend className="field__label">{config.label}</legend>}
      <div className="rating-field__buttons">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            className={`rating-field__star ${star <= currentValue ? "rating-field__star--filled" : ""}`}
            key={star}
            onBlur={field.onBlur}
            onClick={() => handleClick(star)}
            type="button"
          >
            {star <= currentValue ? "★" : "☆"}
          </button>
        ))}
        <span className="rating-field__value">
          {currentValue > 0 ? `${currentValue}/5` : "No rating"}
        </span>
      </div>
      {error && <span className="field__error">{error.message as string}</span>}
    </fieldset>
  );
};

export default RatingField;
