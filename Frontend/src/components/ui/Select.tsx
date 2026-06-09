import { useCallback, type ChangeEvent, type FocusEvent } from "react";
import type { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { Label } from "@/components/base/input/label";
import { HintText } from "@/components/base/input/hint-text";
import { cx } from "@/utils/cx";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps<TFieldValues extends FieldValues = FieldValues> {
  label?: string;
  name?: Path<TFieldValues>;
  options: SelectOption[];
  placeholder?: string;
  error?: FieldError | string;
  hint?: string;
  register?: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

function buildChangeEvent(value: string, name: string): ChangeEvent<HTMLSelectElement> {
  return { target: { value, name } } as ChangeEvent<HTMLSelectElement>;
}

function buildBlurEvent(name: string): FocusEvent<HTMLSelectElement> {
  return { target: { name } } as FocusEvent<HTMLSelectElement>;
}

export default function Select<TFieldValues extends FieldValues = FieldValues>({
  label,
  name = "" as Path<TFieldValues>,
  options,
  placeholder = "Select...",
  error,
  hint,
  register: registerFn,
  registerOptions,
  value,
  onChange: externalOnChange,
  disabled = false,
  fullWidth = true,
  className = "",
}: SelectProps<TFieldValues>) {
  const isInvalid = !!error;
  const errorMessage = typeof error === "string" ? error : error?.message;

  const registerResult = registerFn ? registerFn(name, registerOptions) : null;

  const handleValueChange = useCallback(
    (nextValue: string) => {
      const resolvedName = registerResult?.name ?? name;
      if (registerResult) {
        registerResult.onChange(buildChangeEvent(nextValue, resolvedName));
      }
      if (externalOnChange) {
        externalOnChange(nextValue);
      }
    },
    [registerResult, externalOnChange, name],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      handleValueChange(event.target.value);
    },
    [handleValueChange],
  );

  const handleBlur = useCallback(() => {
    if (registerResult) {
      registerResult.onBlur?.(buildBlurEvent(registerResult.name ?? name));
    }
  }, [registerResult, name]);

  return (
    <div className={cx(
      "[--color-primary:#f3f4f6] [--color-primary_hover:#e5e7eb] [--color-brand:#6200ea]",
      fullWidth && "w-full",
      className,
    )}>
      {label && <Label isInvalid={isInvalid}>{label}</Label>}
      <div className="relative">
        <select
          name={registerResult?.name || name || undefined}
          disabled={disabled}
          value={registerResult ? undefined : value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label={label || placeholder}
          className={cx(
            "w-full appearance-none rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 pr-10 text-sm text-gray-900",
            "focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500",
            "disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer",
          )}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      <HintText isInvalid={isInvalid}>{errorMessage || hint}</HintText>
    </div>
  );
}
