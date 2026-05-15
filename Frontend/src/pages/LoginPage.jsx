import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In a real app, you would handle authentication here
      console.log("Logging in with:", { email, password });
      navigate("/");
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 sm:py-16">
      <div className="w-full max-w-[400px] bg-white rounded-lg shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] p-6 sm:p-8">
        
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[12px] leading-3 font-semibold tracking-[0.6px] text-[#0F172A] font-['Inter']">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B7487]"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-[50px] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-4 text-[16px] text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4] transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[12px] leading-3 font-semibold tracking-[0.6px] text-[#0F172A] font-['Inter']">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-[14px] leading-[21px] text-[#630ED4] hover:underline transition-all"
              >
                Forgot?
              </Link>
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B7487]"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[50px] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-10 text-[16px] text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4] transition-all"
                disabled={isLoading}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B7487] hover:text-[#0F172A] transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] rounded-lg bg-[#630ED4] text-white text-[16px] font-medium flex items-center justify-center gap-2 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] hover:bg-[#5810b8] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="pt-8 text-center">
          <p className="text-[14px] leading-[21px] text-[#64748B] font-['Inter']">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#630ED4] font-medium hover:underline transition-all">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}