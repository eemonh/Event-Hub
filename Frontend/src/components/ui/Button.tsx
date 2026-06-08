import { useCallback } from "react";
import type { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Button as UntitledButton } from "@/components/base/buttons/button";
import type { CommonProps } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

type Variant = "primary" | "secondary" | "ghost" | "icon" | "danger";
type Size = "sm" | "md" | "lg";

const colorMap: Record<Variant, CommonProps["color"]> = {
  primary: "primary",
  secondary: "secondary",
  ghost: "tertiary",
  danger: "primary-destructive",
  icon: "tertiary",
};

const sizeMap: Record<Size, NonNullable<CommonProps["size"]>> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const variantClassMap: Partial<Record<Variant, string>> = {
  secondary: "[--color-primary:#f3f4f6] [--color-primary_hover:#e5e7eb]",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
  to?: string;
  href?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  children,
  to,
  href,
  disabled,
  onClick,
  ...nativeProps
}: ButtonProps) {
  const navigate = useNavigate();
  const isDisabled = disabled || loading;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (to && !isDisabled) {
        navigate(to);
      }
      onClick?.(e);
    },
    [to, isDisabled, navigate, onClick],
  );

  const iconLeading = Icon && iconPosition === "left" ? (Icon as unknown as FC<{ className?: string }>) : undefined;
  const iconTrailing = Icon && iconPosition === "right" ? (Icon as unknown as FC<{ className?: string }>) : undefined;

  const combinedClassName = cx(
    variantClassMap[variant],
    fullWidth && "w-full",
    className,
  );

  if (href && !to) {
    return (
      <UntitledButton
        color={colorMap[variant]}
        size={sizeMap[size]}
        isLoading={loading}
        isDisabled={isDisabled}
        iconLeading={iconLeading}
        iconTrailing={iconTrailing}
        className={combinedClassName}
        href={href}
        onClick={onClick}
        {...(nativeProps as Record<string, unknown>)}
      >
        {children}
      </UntitledButton>
    );
  }

  return (
    <UntitledButton
      color={colorMap[variant]}
      size={sizeMap[size]}
      isLoading={loading}
      isDisabled={isDisabled}
      iconLeading={iconLeading}
      iconTrailing={iconTrailing}
      className={combinedClassName}
      onClick={handleClick}
      {...(nativeProps as Record<string, unknown>)}
    >
      {children}
    </UntitledButton>
  );
}
