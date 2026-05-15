import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Circle } from "lucide-react";
import toast from "react-hot-toast";

import { registerSchema } from "../utils/authSchemas";
import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const passwordValue = watch("password", "");
  const hasMinLength = passwordValue.length >= 8;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<> ]/.test(passwordValue);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Registering with:", data);

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Create an account"
        subtitle="Join EventHub to discover and manage events."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <AuthInput
          label="Name"
          name="name"
          placeholder="Full name"
          icon={User}
          register={register}
          error={errors.name}
          disabled={isLoading}
        />

        <AuthInput
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          register={register}
          error={errors.email}
          disabled={isLoading}
        />

        <div className="flex flex-col gap-2">
          <AuthInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            register={register}
            error={errors.password}
            disabled={isLoading}
          />

          {/* Validation Hints */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-2">
              <Circle
                size={12}
                className={hasMinLength ? "text-green-500 fill-green-500" : "text-[#CCC3D8]"}
              />
              <p className={`text-[13px] leading-tight font-['Inter'] ${hasMinLength ? "text-green-600" : "text-[#64748B]"}`}>
                Must be at least 8 characters
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Circle
                size={12}
                className={hasSpecialChar ? "text-green-500 fill-green-500" : "text-[#CCC3D8]"}
              />
              <p className={`text-[13px] leading-tight font-['Inter'] ${hasSpecialChar ? "text-green-600" : "text-[#64748B]"}`}>
                Must contain one special character
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <AuthButton isLoading={isLoading}>
            Sign Up
          </AuthButton>
        </div>
      </form>

      <div className="pt-8 sm:pt-6 text-center border-t border-gray-100 mt-4 sm:border-none sm:mt-0">
        <p className="text-[14px] leading-[21px] text-[#64748B] font-['Inter']">
          Already have an account?{" "}
          <Link to="/login" className="text-[#630ED4] font-medium hover:underline transition-all">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

