import type { ReactNode } from "react";

type Shadow = "sm" | "md" | "lg";
type Radius = "sm" | "md";

const shadowStyles: Record<Shadow, string> = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

const radiusStyles: Record<Radius, string> = {
  sm: "rounded-lg",
  md: "rounded-2xl",
};

interface CardProps {
  shadow?: Shadow;
  radius?: Radius;
  padding?: boolean;
  bordered?: boolean;
  hover?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function Card({
  shadow = "md",
  radius = "md",
  padding = true,
  bordered = true,
  hover = false,
  className = "",
  children,
}: CardProps) {
  const classes = [
    "bg-white",
    shadowStyles[shadow],
    radiusStyles[radius],
    bordered && "border border-border-light",
    padding && "p-6",
    hover && "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
