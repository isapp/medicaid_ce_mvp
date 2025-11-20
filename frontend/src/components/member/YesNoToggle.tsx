import React from 'react';

interface YesNoToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const YesNoToggle: React.FC<YesNoToggleProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`yes-no-toggle ${className}`}>
      <button
        type="button"
        className={`yes-no-toggle-option ${value === true ? 'yes-no-toggle-option-selected' : ''}`}
        onClick={() => onChange(true)}
        disabled={disabled}
      >
        Yes
      </button>
      <button
        type="button"
        className={`yes-no-toggle-option ${value === false ? 'yes-no-toggle-option-selected' : ''}`}
        onClick={() => onChange(false)}
        disabled={disabled}
      >
        No
      </button>
    </div>
  );
};
