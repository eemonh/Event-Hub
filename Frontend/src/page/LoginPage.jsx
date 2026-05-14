import {
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[400px] bg-white rounded-lg shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <h1 className="text-[32px] leading-[38px] font-bold text-[#630ED4] font-['Poppins']">
            EventHub
          </h1>

          <h2 className="text-[20px] leading-7 font-semibold text-[#0F172A] font-['Poppins']">
            Welcome Back
          </h2>

          <p className="text-[14px] leading-[21px] text-[#64748B] text-center font-['Inter']">
            Log in to manage your upcoming events.
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] leading-3 font-semibold tracking-[0.6px] text-[#0F172A] font-['Inter']">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B7487]"
              />

              <input
                type="email"
                placeholder="name@example.com"
                className="w-full h-[50px] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 text-[16px] text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            
            <div className="flex items-center justify-between">
              <label className="text-[12px] leading-3 font-semibold tracking-[0.6px] text-[#0F172A] font-['Inter']">
                Password
              </label>

              <button
                type="button"
                className="text-[14px] leading-[21px] text-[#630ED4] hover:underline"
              >
                Forgot?
              </button>
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B7487]"
              />

              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-[50px] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 text-[16px] text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-[50px] rounded-lg bg-[#630ED4] text-white text-[16px] font-medium flex items-center justify-center gap-2 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:bg-[#5810b8] transition"
            >
              <span>Sign In</span>

              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="pt-8 text-center">
          <p className="text-[14px] leading-[21px] text-[#64748B] font-['Inter']">
            Don't have an account?{" "}
            <button className="text-[#630ED4] hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}