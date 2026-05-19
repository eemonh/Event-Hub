import { Circle } from "lucide-react";
import { MIN_PASSWORD_LENGTH, PASSWORD_SPECIAL_CHAR_REGEX } from "../../utils/authSchemas";

export default function PasswordStrengthIndicator({ password = "" }) {
  const hasMinLength = password.length >= MIN_PASSWORD_LENGTH;
  const hasSpecialChar = PASSWORD_SPECIAL_CHAR_REGEX.test(password);

  return (
    <div className="flex flex-col gap-1 pt-1">
      <div className="flex items-center gap-2">
        <Circle size={12}
           className={hasMinLength ? "text-green-500 fill-green-500" : "text-slate-300"} />
        <p className={`text-[13px] leading-tight font-['Poppins'] ${hasMinLength ? "text-green-600" : "text-slate-500"}`}>
          Must be at least {MIN_PASSWORD_LENGTH} characters
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Circle size={12}
          className={hasSpecialChar ? "text-green-500 fill-green-500" : "text-slate-300"} />
        <p className={`text-[13px] leading-tight font-['Poppins'] ${hasSpecialChar ? "text-green-600" : "text-slate-500"}`}>
          Must contain one special character
        </p>
      </div>
    </div>
  );
}
