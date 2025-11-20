import React from 'react';
import { useForm, UseFormReturn, FieldValues, SubmitHandler, DefaultValues } from 'react-hook-form';

interface FormProps<T extends FieldValues> {
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
  className?: string;
}

export function Form<T extends FieldValues>({
  children,
  onSubmit,
  defaultValues,
  className = '',
}: FormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
  });

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} className={`form ${className}`}>
      {children(methods)}
    </form>
  );
}

interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  required,
}) => {
  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};
