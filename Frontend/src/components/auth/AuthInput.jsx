import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthInput({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  register,
  rightElement,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className="text-[12px] sm:text-[14px] leading-tight font-semibold tracking-[0.6px] text-[#0F172A] font-['Inter']"
        >
          {label}
        </label>
        {rightElement}
      </div>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B7487]"
          />
        )}

        <input
          id={name}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          {...register(name)}
          className={`w-full h-[50px] rounded-lg border bg-[#F8FAFC] pl-10 pr-10 text-[16px] text-[#0F172A] outline-none focus:ring-2 focus:ring-[#630ED4] transition-all placeholder:text-[#6B7280] ${
            error ? "border-red-500 ring-1 ring-red-500" : "border-[#E2E8F0]"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B7487] hover:text-[#0F172A] transition-colors"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[12px] text-red-500 font-medium mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
