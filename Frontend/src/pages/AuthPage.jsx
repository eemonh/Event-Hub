import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { loginSchema, registerSchema } from "../utils/authSchemas";
import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import PasswordStrengthIndicator from "../components/auth/PasswordStrengthIndicator";

const AUTH_MODES = {
  login: {
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
    header: { title: "Welcome Back", subtitle: "Log in to manage your upcoming events." },
    button: { text: "Sign In", icon: ArrowRight },
    showName: false,
    showPasswordStrength: false,
    showForgotPassword: true,
    placeholder: { email: "name@example.com" },
    footer: { text: "Don't have an account?", linkText: "Sign up", to: "/register" },
  },
  register: {
    schema: registerSchema,
    defaultValues: { name: "", email: "", password: "" },
    header: { title: "Create an account", subtitle: "Join EventHub to discover and manage events." },
    button: { text: "Sign Up", icon: null },
    showName: true,
    showPasswordStrength: true,
    showForgotPassword: false,
    placeholder: { email: "you@example.com" },
    footer: { text: "Already have an account?", linkText: "Log in", to: "/login" },
  },
};

export default function AuthPage() {
  const { pathname } = useLocation();
  const mode = pathname.endsWith("/register") ? "register" : "login";
  const config = AUTH_MODES[mode];

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues,
  });

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (mode === "login") {
        await login(data.email, data.password);
        toast.success("Successfully logged in!");
      } else {
        await registerUser(data.name, data.email, data.password);
        toast.success("Account created successfully!");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader title={config.header.title} subtitle={config.header.subtitle} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {config.showName && (
          <Input label="Name" name="name" placeholder="Full name" icon={User}
            register={register} error={errors.name} disabled={isLoading} />
        )}
        <Input label="Email Address" name="email" type="email"
          placeholder={config.placeholder.email}
          icon={Mail} register={register} error={errors.email} disabled={isLoading} />
        <div>
          <Input label="Password" name="password" type="password" placeholder="••••••••"
            icon={Lock} register={register} error={errors.password} disabled={isLoading}
            rightElement={
              config.showForgotPassword ? (
                <Link to="/forgot-password"
                  className="text-[14px] leading-[21px] text-[#630ED4] hover:underline transition-all">
                  Forgot?
                </Link>
              ) : undefined
            } />
          {config.showPasswordStrength && <PasswordStrengthIndicator password={password} />}
        </div>
        <div className="pt-2">
          <Button type="submit" loading={isLoading} icon={config.button.icon} fullWidth size="lg">
            {config.button.text}
          </Button>
        </div>
      </form>
      <div className="pt-8 text-center border-t border-gray-100 mt-4 sm:border-none sm:mt-0">
        <p className="text-[14px] leading-[21px] text-[#64748B] font-['Poppins']">
          {config.footer.text}{" "}
          <Link to={config.footer.to} className="text-[#630ED4] font-medium hover:underline transition-all">
            {config.footer.linkText}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
