interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 mb-6 text-center">
      <h1 className="text-[32px] leading-[38px] font-bold text-primary">EventHub</h1>

      <h2 className="text-[20px] sm:text-[30px] leading-tight font-semibold text-text-primary">
        {title}
      </h2>

      <p className="text-[14px] sm:text-[16px] leading-relaxed text-text-muted max-w-[300px]">
        {subtitle}
      </p>
    </div>
  );
}
