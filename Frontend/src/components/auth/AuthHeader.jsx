import React from "react";

export default function AuthHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center gap-2 mb-6 text-center">
      <h1 className="text-[32px] leading-[38px] font-bold text-[#630ED4] font-['Poppins']">
        EventHub
      </h1>

      <h2 className="text-[20px] sm:text-[30px] leading-tight font-semibold text-[#0F172A] font-['Poppins']">
        {title}
      </h2>

      <p className="text-[14px] sm:text-[16px] leading-relaxed text-[#64748B] font-['Inter'] max-w-[300px]">
        {subtitle}
      </p>
    </div>
  );
}
