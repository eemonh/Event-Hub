import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Circle,
} from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-screen bg-[#F8FAFC] flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-[400px] bg-white border border-[#E2E8F0] rounded-lg shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] px-8 pt-8 pb-8">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-[6px] mb-6">
          
          <h1 className="text-[32px] leading-[38px] font-bold text-[#630ED4] font-['Poppins']">
            EventHub
          </h1>

          <h2 className="text-[30px] leading-[39px] font-semibold text-[#0F172A] text-center font-['Poppins']">
            Create an account
          </h2>

          <p className="max-w-[296px] text-center text-[16px] leading-[26px] text-[#64748B] font-['Inter']">
            Join EventHub to discover and manage events.
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] leading-[21px] text-[#4A4455] font-['Inter']">
              Name
            </label>

            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B7487]"
              />

              <input
                type="text"
                placeholder="Full name"
                className="w-full h-[50px] rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-4 text-[16px] text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] leading-[21px] text-[#4A4455] font-['Inter']">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B7487]"
              />

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-[50px] rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-4 text-[16px] text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] leading-[21px] text-[#4A4455] font-['Inter']">
              Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B7487]"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full h-[50px] rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-10 text-[16px] text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B7487]"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* Validation Hints */}
            <div className="flex flex-col gap-1 pt-1">
              
              <div className="flex items-center gap-2">
                <Circle
                  size={13}
                  className="text-[#CCC3D8]"
                />

                <p className="text-[14px] leading-[21px] text-[#64748B]">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Circle
                  size={13}
                  className="text-[#CCC3D8]"
                />

                <p className="text-[14px] leading-[21px] text-[#64748B]">
                  Must contain one special character
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full h-[50px] rounded-lg bg-[#7C3AED] text-white text-[16px] font-medium shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:bg-[#6D28D9] transition"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <div className="pt-6 text-center">
          <p className="text-[14px] leading-[21px] text-[#64748B]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#630ED4] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}