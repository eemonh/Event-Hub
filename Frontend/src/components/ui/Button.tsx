import { useCallback } from "react";
import type { FC, ReactNode, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Button as UntitledButton } from "@/components/base/buttons/button";
import type { CommonProps } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

type Variant = "primary" | "secondary" | "ghost" | "icon" | "danger";
type Size = "sm" | "md" | "lg";

const colorMap: Record<Variant, NonNullable<CommonProps["color"]>> = {
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
    (e: MouseEvent<HTMLButtonElement>): void => {
      if (to && !isDisabled) {
        navigate(to);
      }
      onClick?.(e);
    },
    [to, isDisabled, navigate, onClick],
  );

  const iconLeading = Icon && iconPosition === "left" ? (Icon as FC<{ className?: string }>) : undefined;
  const iconTrailing = Icon && iconPosition === "right" ? (Icon as FC<{ className?: string }>) : undefined;

  const combinedClassName = cx(
    variantClassMap[variant],
    fullWidth && "w-full",
    "[&_[data-icon]]:size-4",
    className,
  );

  const commonProps = {
    color: colorMap[variant] as "primary" | "secondary" | "tertiary" | "link-color" | "link-gray" | "primary-destructive" | "secondary-destructive" | "tertiary-destructive" | "link-destructive",
    size: sizeMap[size] as "xs" | "sm" | "md" | "lg" | "xl",
    isLoading: loading,
    isDisabled,
    iconLeading,
    iconTrailing,
    className: combinedClassName,
    children,
  } satisfies Partial<CommonProps>;

  if (href && !to) {
    return <UntitledButton href={href} onClick={onClick} {...commonProps} {...(nativeProps as any)} />;
  }

  return <UntitledButton onClick={handleClick} {...commonProps} {...(nativeProps as any)} />;
}
