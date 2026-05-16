import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/useAuth";
import { loginSchema } from "../utils/authSchemas";
import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      await login(data.email, data.password);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Invalid email or password.");
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
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@example.com"
          icon={Mail}
          register={register}
          error={errors.email}
          disabled={isLoading}
        />

        <Input
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
          <Button
            type="submit"
            loading={isLoading}
            icon={ArrowRight}
            fullWidth
            size="lg"
          >
            Sign In
          </Button>
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
