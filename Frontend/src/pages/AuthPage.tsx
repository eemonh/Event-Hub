import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthHeader from "../components/auth/AuthHeader";
import AuthLayout from "../components/auth/AuthLayout";
import PasswordStrengthIndicator from "../components/auth/PasswordStrengthIndicator";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import type { LoginFormData, RegisterFormData } from "../types";
import { loginSchema, registerSchema } from "../utils/authSchemas";

const AUTH_MODES = {
  login: {
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
    header: {
      title: "Welcome Back",
      subtitle: "Log in to manage your upcoming events.",
    },
    button: { text: "Sign In", icon: ArrowRight },
    showName: false,
    showPasswordStrength: false,
    showForgotPassword: true,
    placeholder: { email: "name@example.com" },
    footer: {
      text: "Don't have an account?",
      linkText: "Sign up",
      to: "/register",
    },
  },
  register: {
    schema: registerSchema,
    defaultValues: { name: "", email: "", password: "" },
    header: {
      title: "Create an account",
      subtitle: "Join EventHub to discover and manage events.",
    },
    button: { text: "Sign Up", icon: null },
    showName: true,
    showPasswordStrength: true,
    showForgotPassword: false,
    placeholder: { email: "you@example.com" },
    footer: {
      text: "Already have an account?",
      linkText: "Log in",
      to: "/login",
    },
  },
};

export default function AuthPage() {
  const { pathname } = useLocation();
  const mode = pathname.endsWith("/register") ? "register" : "login";
  const config = AUTH_MODES[mode];


  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues,
  });

  const password = watch("password", "");

  const onSubmit = async (data: LoginFormData | RegisterFormData) => {
    setIsLoading(true);
    console.log("Form Data:", data);
    try {
      if (mode === "login") {
        await login(data.email, data.password);
        toast.success("Successfully logged in!");
      } else {
        const regData = data as RegisterFormData;
        await registerUser(regData.name, regData.email, regData.password);
        toast.success("Account created successfully!");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title={config.header.title}
        subtitle={config.header.subtitle}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {config.showName && (
          <Input
            label="Name"
            name="name"
            placeholder="Full name"
            icon={User}
            register={register}
            error={"name" in errors ? errors.name : undefined}
            disabled={isLoading}
          />
        )}

        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          }}
          render={({ field }) => (
            <Input
              label="Email Address"
              type="email"
              placeholder={config.placeholder.email}
              icon={Mail}
              {...field}
              error={errors.email?.message}
              disabled={isLoading}
            />
          )}
        />
        <div>

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            render={({ field }) => (
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={Lock}
                {...field}
                error={errors.password?.message}
                disabled={isLoading}
              />
            )}
          />
          
          {config.showPasswordStrength && (
            <PasswordStrengthIndicator password={password} />
          )}
        </div>
        <div className="pt-2">
          <Button
            type="submit"
            loading={isLoading}
            icon={config.button.icon ?? undefined}
            fullWidth
            size="lg"
          >
            {config.button.text}
          </Button>
        </div>
      </form>
      <div className="pt-8 text-center border-t border-gray-100 mt-4 sm:border-none sm:mt-0">
        <p className="text-[14px] leading-5.25 text-slate-500 font-['Poppins']">
          {config.footer.text}{" "}
          <Link
            to={config.footer.to}
            className="text-primary font-medium hover:underline transition-all"
          >
            {config.footer.linkText}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
