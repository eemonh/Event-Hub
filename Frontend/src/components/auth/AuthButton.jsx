import React from "react";
import { Loader2 } from "lucide-react";

export default function AuthButton({ 
  children, 
  isLoading, 
  icon: Icon, 
  type = "submit", 
  className = "" 
}) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`w-full h-[50px] rounded-lg bg-[#630ED4] text-white text-[16px] font-medium flex items-center justify-center gap-2 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:bg-[#5810b8] transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <>
          {children}
          {Icon && <Icon size={16} />}
        </>
      )}
    </button>
  );
}
