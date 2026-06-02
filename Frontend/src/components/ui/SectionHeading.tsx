import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  showDots?: boolean;
  center?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function SectionHeading({
  title,
  subtitle,
  showDots = false,
  center = true,
  className = "",
  children,
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col items-${center ? "center" : "start"} gap-4 ${className}`}>
      <h2
        className={`text-3xl md:text-4xl lg:text-[42px] font-bold leading-[1.05] tracking-[-0.02em] text-text-primary ${center ? "text-center md:text-center" : "text-center md:text-left"}`}
      >
        {title}
      </h2>

      {showDots && (
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 rounded-full bg-primary" />
          <div className="h-1 w-2 rounded-full bg-gray-300" />
          <div className="h-1 w-2 rounded-full bg-gray-300" />
        </div>
      )}

      {subtitle && (
        <p
          className={`text-base md:text-lg leading-7 text-text-muted ${center ? "text-center md:text-center" : "text-center md:text-left"} max-w-[650px]`}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
