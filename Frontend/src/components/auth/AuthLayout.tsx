import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white sm:bg-gray-50 flex items-center justify-center px-4 py-8 sm:py-10">
      <div className="w-full max-w-[400px] bg-white sm:border border-border-light rounded-lg shadow-none sm:shadow-md p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
