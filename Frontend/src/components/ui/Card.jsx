const shadowStyles = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
}

const radiusStyles = {
  sm: "rounded-lg",
  md: "rounded-2xl",
}

export default function Card({
  shadow = "md",
  radius = "md",
  padding = true,
  bordered = true,
  hover = false,
  className = "",
  children,
}) {
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
    .join(" ")

  return <div className={classes}>{children}</div>
}
