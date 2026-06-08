import { useCallback, type ComponentType, type HTMLAttributes, type ReactNode } from "react";
import type { FieldError, UseFormRegister, RegisterOptions } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import { Input as UntitledInput } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { cx } from "@/utils/cx";

interface InputProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: LucideIcon;
  error?: FieldError | string;
  hint?: string;
  register?: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  rightElement?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
}

export default function Input({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
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
}: InputProps) {
  const isInvalid = !!error;
  const errorMessage = typeof error === "string" ? error : error?.message;

  const registerResult = registerFn ? registerFn(name, registerOptions) : null;

  const handleChange = useCallback(
    (value: string) => {
      if (registerResult) {
        registerResult.onChange({ target: { value } });
      }
      if (externalOnChange) {
        externalOnChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
      }
    },
    [registerResult, externalOnChange],
  );

  const handleBlur = useCallback(() => {
    if (registerResult) {
      registerResult.onBlur?.({} as React.FocusEvent<HTMLInputElement>);
    }
  }, [registerResult]);

  return (
    <div className={cx(fullWidth && "w-full", className)}>
      {(label || rightElement) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <Label isInvalid={isInvalid}>{label}</Label>}
          {rightElement}
        </div>
      )}
      <UntitledInput
        name={registerResult?.name || name}
        type={type}
        placeholder={placeholder}
        icon={Icon as unknown as ComponentType<HTMLAttributes<HTMLOrSVGElement>>}
        isInvalid={isInvalid}
        isDisabled={disabled}
        hint={errorMessage || hint}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-label={label || placeholder}
        inputClassName={inputClassName}
        defaultValue={registerResult ? undefined : value}
      />
    </div>
  );
}
