import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-white sm:bg-[#F8FAFC] flex items-center justify-center px-4 py-8 sm:py-10">
      <div className="w-full max-w-[400px] bg-white sm:border border-[#E2E8F0] rounded-lg shadow-none sm:shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
