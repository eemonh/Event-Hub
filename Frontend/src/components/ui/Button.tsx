import { useCallback, isValidElement } from "react";
import type { ReactNode, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Button as UntitledButton } from "@/components/base/buttons/button";
import type { CommonProps } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { isReactComponent } from "@/utils/is-react-component";

/**
 * Button accepts `to` (React Router navigation) or `href` (anchor navigation).
 * If both are provided, `to` takes precedence and `href` is ignored.
 */

type Variant = "primary" | "secondary" | "ghost" | "tertiary" | "icon" | "danger" | "outline" | "outline-destructive" | "link";
type Size = "sm" | "md" | "lg" | "icon";

const colorMap: Record<Variant, NonNullable<CommonProps["color"]>> = {
  primary: "primary",
  secondary: "secondary",
  ghost: "tertiary",
  tertiary: "tertiary",
  danger: "primary-destructive",
  icon: "tertiary",
  outline: "secondary",
  "outline-destructive": "secondary-destructive",
  link: "link-color",
};

const sizeMap: Record<Size, NonNullable<CommonProps["size"]>> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  icon: "sm",
};

const variantClassMap: Partial<Record<Variant, string>> = {
  secondary: "[--color-primary:#f3f4f6] [--color-primary_hover:#e5e7eb]",
  outline: "[--color-primary:#ffffff] [--color-primary_hover:#f9fafb] ring-gray-200 shadow-none",
  "outline-destructive": "[--color-primary:#ffffff] [--color-primary_hover:#fef2f2] ring-red-200 shadow-none",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  showTextWhileLoading?: boolean;
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
  showTextWhileLoading,
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

  const iconLeading = Icon && iconPosition !== "right" && (isValidElement(Icon) || isReactComponent(Icon)) ? Icon : undefined;
  const iconTrailing = Icon && iconPosition === "right" && (isValidElement(Icon) || isReactComponent(Icon)) ? Icon : undefined;

  const combinedClassName = cx(
    variantClassMap[variant],
    fullWidth && "w-full",
    size === "icon" && "p-0",
    "[&_[data-icon]]:size-4",
    className,
  );

  const commonProps = {
    color: colorMap[variant] as "primary" | "secondary" | "tertiary" | "link-color" | "link-gray" | "primary-destructive" | "secondary-destructive" | "tertiary-destructive" | "link-destructive",
    size: sizeMap[size] as "xs" | "sm" | "md" | "lg" | "xl",
    isLoading: loading,
    isDisabled,
    showTextWhileLoading,
    iconLeading,
    iconTrailing,
    className: combinedClassName,
    children,
  } satisfies Partial<CommonProps>;

  if (href && !to) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <UntitledButton href={href} onClick={onClick} {...commonProps} {...(nativeProps as any)} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <UntitledButton onClick={handleClick} {...commonProps} {...(nativeProps as any)} />;
}
