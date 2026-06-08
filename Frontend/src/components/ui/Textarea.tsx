import { useCallback, type ChangeEvent, type FocusEvent } from "react";
import type { FieldError, UseFormRegister, RegisterOptions } from "react-hook-form";
import { Label } from "@/components/base/input/label";
import { HintText } from "@/components/base/input/hint-text";
import { cx } from "@/utils/cx";

interface TextareaProps {
  label?: string;
  name: string;
  rows?: number;
  placeholder?: string;
  error?: FieldError | string;
  hint?: string;
  register?: UseFormRegister<Record<string, unknown>>;
  registerOptions?: RegisterOptions;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
}

function buildChangeEvent(value: string, name: string): ChangeEvent<HTMLTextAreaElement> {
  return { target: { value, name } } as ChangeEvent<HTMLTextAreaElement>;
}

function buildBlurEvent(name: string): FocusEvent<HTMLTextAreaElement> {
  return { target: { name } } as FocusEvent<HTMLTextAreaElement>;
}

export default function Textarea({
  label,
  name,
  rows = 4,
  placeholder,
  error,
  hint,
  register: registerFn,
  registerOptions,
  value,
  onChange: externalOnChange,
  disabled = false,
  fullWidth = true,
  className = "",
  inputClassName = "",
}: TextareaProps) {
  const isInvalid = !!error;
  const errorMessage = typeof error === "string" ? error : error?.message;

  const registerResult = registerFn ? registerFn(name, registerOptions) : null;

  const handleChange = useCallback(
    (nextValue: string) => {
      const resolvedName = registerResult?.name ?? name;
      if (registerResult) {
        registerResult.onChange(buildChangeEvent(nextValue, resolvedName));
      }
      if (externalOnChange) {
        externalOnChange(buildChangeEvent(nextValue, resolvedName));
      }
    },
    [registerResult, externalOnChange, name],
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
      <textarea
        name={registerResult?.name || name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        value={registerResult ? undefined : value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={label || placeholder}
        className={cx(
          "w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm text-gray-900",
          "focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500",
          "placeholder:text-gray-400 transition-all resize-y",
          "disabled:cursor-not-allowed disabled:opacity-50",
          inputClassName,
        )}
      />
      <HintText isInvalid={isInvalid}>{errorMessage || hint}</HintText>
    </div>
  );
}
