import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

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
  onChange,
  rightElement,
  disabled = false,
  fullWidth = true,
  className = "",
  inputClassName = "",
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  const inputProps = registerFn
    ? registerFn(name, registerOptions)
    : { value, onChange }

  return (
    <div
      className={`flex flex-col gap-1 ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {(label || rightElement) && (
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={name}
              className="text-[12px] sm:text-[14px] leading-tight font-semibold tracking-[0.6px] text-text-primary font-['Poppins']"
            >
              {label}
            </label>
          )}
          {rightElement}
        </div>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
        )}

        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          {...inputProps}
          className={`w-full h-[50px] rounded-lg border bg-gray-50 text-[16px] text-text-primary outline-none focus:ring-2 transition-all placeholder:text-text-muted ${
            Icon ? "pl-10" : "pl-4"
          } ${
            isPassword ? "pr-10" : "pr-4"
          } ${
            error
              ? "border-red-500 ring-1 ring-red-500"
              : "border-border-light focus:ring-primary/50"
          } ${inputClassName}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[12px] text-red-500 font-medium">
          {typeof error === "string" ? error : error.message}
        </p>
      )}
      {hint && !error && (
        <p className="text-[12px] text-text-muted">{hint}</p>
      )}
    </div>
  )
}
