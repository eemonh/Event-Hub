import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import { loginSchema } from "../utils/authSchemas";
import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Logging in with:", data);

      toast.success("Successfully logged in!");
      navigate("/");
    } catch (err) {
      toast.error("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome Back"
        subtitle="Log in to manage your upcoming events."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <AuthInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@example.com"
          icon={Mail}
          register={register}
          error={errors.email}
          disabled={isLoading}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          register={register}
          error={errors.password}
          disabled={isLoading}
          rightElement={
            <Link
              to="/forgot-password"
              className="text-[14px] leading-[21px] text-[#630ED4] hover:underline transition-all"
            >
              Forgot?
            </Link>
          }
        />

        <div className="pt-2">
          <AuthButton
            isLoading={isLoading}
            icon={ArrowRight}
          >
            Sign In
          </AuthButton>
        </div>
      </form>

      <div className="pt-8 text-center border-t border-gray-100 mt-4 sm:border-none sm:mt-0">
        <p className="text-[14px] leading-[21px] text-[#64748B] font-['Inter']">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#630ED4] font-medium hover:underline transition-all">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
