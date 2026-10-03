"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/app/utils/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic Validation
    if (!email || !password) {
      setErrorMessage("Please enter both email address and password.");
      return;
    }

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      // Call actual backend authentication API: POST /v1/auth/login
      const { loginApi } = await import("@/app/utils/auth");
      await loginApi({ email, password });

      setIsSuccess(true);

      // Smooth full navigation into dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (err: any) {
      const msg =
        err?.message ||
        err?.error ||
        "Incorrect login credentials or server unreachable. Please try again.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white font-sans antialiased text-[#172126] p-4">
      {/* Centered Login Card */}
      <div className="w-full max-w-[420px] bg-white p-8 sm:p-10 rounded-2xl border border-[#E5E7EB] shadow-lg shadow-black/5 space-y-6">
        {/* Main Logo & Titles */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF5F7] p-3 flex items-center justify-center border border-[#980e27]/20 mx-auto mb-4 shadow-xs">
            <Image
              src="/Main_logo.png"
              alt="Merchem Main Logo"
              width={56}
              height={56}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
            Admin Login
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Sign in to access your Merchem management dashboard
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-[#FFF5F5] border border-[#FEB2B2] flex items-start gap-3 text-xs text-[#E53E3E]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {isSuccess && (
          <div className="p-3.5 rounded-lg bg-[#F0FDF4] border border-[#86EFAC] flex items-center gap-3 text-xs text-[#166534]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
            <span className="font-semibold">Authentication successful! Redirecting...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#172126] uppercase tracking-wider"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full h-[48px] pl-11 pr-4 bg-white text-[#172126] text-sm font-normal placeholder-[#94A3B8] rounded-lg border border-[#DDE3E0] outline-hidden transition-all focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#172126] uppercase tracking-wider"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-[48px] pl-11 pr-11 bg-white text-[#172126] text-sm font-normal placeholder-[#94A3B8] rounded-lg border border-[#DDE3E0] outline-hidden transition-all focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-[#94A3B8] hover:text-[#172126] transition-colors rounded-md cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
              />
              <span className="text-xs font-medium text-[#475569]">
                Remember me
              </span>
            </label>

            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset instructions have been sent to your administrator.");
              }}
              className="text-xs font-semibold text-[#980e27] hover:text-[#7A0B1F] hover:underline transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full h-[48px] mt-2 inline-flex items-center justify-center gap-2 px-6 bg-[#980e27] hover:bg-[#7A0B1F] active:bg-[#600818] text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md shadow-[#980e27]/20 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed outline-hidden focus:ring-2 focus:ring-[#980e27]/40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Authenticated</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Copyright */}
      <footer className="mt-8 text-center">
        <p className="text-xs text-[#64748B]">
          © {new Date().getFullYear()} Merchem India Pvt. Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
}