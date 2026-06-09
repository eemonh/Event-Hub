import { useCallback, isValidElement, type ChangeEvent, type FocusEvent, type ReactNode } from "react";
import type { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import { Input as UntitledInput } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

interface InputProps<TFieldValues extends FieldValues = FieldValues> {
  label?: string;
  name: Path<TFieldValues>;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg";
  error?: FieldError | string;
  hint?: string;
  register?: UseFormRegister<TFieldValues>;
  registerOptions?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  rightElement?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
}

function buildChangeEvent(value: string, name: string): ChangeEvent<HTMLInputElement> {
  return { target: { value, name } } as ChangeEvent<HTMLInputElement>;
}

function buildBlurEvent(name: string): FocusEvent<HTMLInputElement> {
  return { target: { name } } as FocusEvent<HTMLInputElement>;
}

export default function Input<TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  size = "md",
  error,
  hint,
  register: registerFn,
  registerOptions,
  value,
  onChange: externalOnChange,
  rightElement,
  disabled = false,
  fullWidth = true,
  className = "",
  inputClassName = "",
}: InputProps<TFieldValues>) {
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
      {(label || rightElement) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <Label isInvalid={isInvalid}>{label}</Label>}
          {rightElement}
        </div>
      )}
      <UntitledInput
        name={registerResult?.name || name}
        type={type}
        size={size}
        placeholder={placeholder}
        icon={Icon && (isValidElement(Icon) || isReactComponent(Icon)) ? Icon : undefined}
        isInvalid={isInvalid}
        isDisabled={disabled}
        hint={errorMessage || hint}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={label || placeholder}
        inputClassName={cx(inputClassName, "text-secondary")}
        value={registerResult ? undefined : value}
      />
    </div>
  );
}
