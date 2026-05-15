import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Validation checks
  const isLengthValid = formData.password.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    if (!formData.name.trim()) {
      return toast.error("Name is required");
    }
    if (!isEmailValid) {
      return toast.error("Please enter a valid email address");
    }
    if (!isLengthValid || !hasSpecialChar) {
      return toast.error("Password does not meet requirements");
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-16">
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
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
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="w-full h-[50px] rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-4 text-[16px] text-[#0F172A] placeholder:text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4]"
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
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  formData.email && !isEmailValid ? "text-red-500" : "text-[#7B7487]"
                }`}
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className={`w-full h-[50px] rounded-lg border bg-white pl-10 pr-4 text-[16px] text-[#0F172A] placeholder:text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4] ${
                  formData.email && !isEmailValid ? "border-red-500" : "border-[#E2E8F0]"
                }`}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full h-[50px] rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-10 text-[16px] text-[#0F172A] placeholder:text-[#6B7280] outline-none focus:ring-2 focus:ring-[#630ED4]"
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
                {isLengthValid ? (
                  <CheckCircle2 size={13} className="text-green-500" />
                ) : (
                  <Circle size={13} className="text-[#CCC3D8]" />
                )}
                <p className={`text-[14px] leading-[21px] ${isLengthValid ? "text-green-600" : "text-[#64748B]"}`}>
                  Must be at least 8 characters
                </p>
              </div>

              <div className="flex items-center gap-2">
                {hasSpecialChar ? (
                  <CheckCircle2 size={13} className="text-green-500" />
                ) : (
                  <Circle size={13} className="text-[#CCC3D8]" />
                )}
                <p className={`text-[14px] leading-[21px] ${hasSpecialChar ? "text-green-600" : "text-[#64748B]"}`}>
                  Must contain one special character
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 w-full h-[50px] rounded-lg bg-[#7C3AED] text-white text-[16px] font-medium shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#6D28D9]"
            }`}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
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