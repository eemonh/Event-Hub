import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Loader2, type LucideIcon } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "icon" | "danger";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-sm hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/50",
  secondary:
    "bg-white text-text-primary border border-border-light shadow-sm hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary/50",
  ghost:
    "text-text-muted hover:text-text-primary hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary/50",
  icon: "text-text-muted hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary/50",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500/50",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-base gap-2",
  lg: "h-[50px] px-6 md:px-8 text-base gap-2",
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
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium leading-6 transition-all outline-none";
  const isDisabled = disabled || loading;

  const classes = [
    base,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    isDisabled && "opacity-70 cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading && <Loader2 size={20} className="animate-spin" />}
      {!loading && Icon && iconPosition === "left" && <Icon size={16} />}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon size={16} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {content}
    </button>
  );
}
