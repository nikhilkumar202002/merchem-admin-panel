"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Atom,
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
      // Simulate Backend Authentication API Request
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Demo credential validation
      setIsSuccess(true);
      
      // Redirect after brief success feedback
      setTimeout(() => {
        router.push("/");
      }, 600);
    } catch (err) {
      setErrorMessage("Incorrect login credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F5F7F6] font-sans antialiased text-[#172126] selection:bg-[#980e27]/20 selection:text-[#980e27]">
      {/* ========================================================================= */}
      {/* LEFT SECTION — Brand Visual (55% width on desktop, hidden on mobile)     */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden bg-[#7A0B1F] p-12 lg:p-16 text-white select-none">
        {/* Background Photorealistic Image with Deep Crimson #980e27 Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/chemical_bg.jpg"
            alt="Merchem Specialty Chemicals Laboratory"
            fill
            className="object-cover object-center opacity-30 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#600818] via-[#980e27]/90 to-[#7A0B1F]/80" />
        </div>

        {/* Abstract Molecular Pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Top Header Main Logo & Name */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center shadow-md">
            <Image
              src="/Main_logo.png"
              alt="Merchem India Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-wider uppercase text-white block leading-tight">
              MERCHEM
            </span>
            <span className="text-[11px] font-semibold text-white/80 tracking-widest uppercase block mt-0.5">
              India Pvt. Ltd.
            </span>
          </div>
        </div>

        {/* Middle Brand Content */}
        <div className="relative z-10 max-w-xl my-auto py-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white/90">
            <Atom className="w-4 h-4 text-white" />
            <span>Specialty Chemicals Admin Portal</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80">
              Merchem India
            </span>
          </h1>

          <p className="text-base lg:text-lg text-white/90 leading-relaxed max-w-lg font-normal">
            Your central workspace for managing products, categories, technical insights, and digital customer experiences.
          </p>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-white/80 font-semibold">
            Specialty Chemistry. Trusted Performance.
          </p>
          <span className="text-xs text-white/50 font-medium">v2.4.0</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION — Login Form (45% width on desktop, 100% on mobile)       */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between items-center px-4 py-8 sm:p-12 bg-white lg:bg-[#F5F7F6] overflow-y-auto">
        {/* Mobile Top Brand Header */}
        <div className="w-full max-w-[420px] flex items-center justify-center gap-3 lg:hidden mb-6 pt-4">
          <Image
            src="/Main_logo.png"
            alt="Merchem India Logo"
            width={36}
            height={36}
            className="h-9 w-auto object-contain"
          />
          <div className="text-left">
            <span className="text-base font-bold text-[#172126] tracking-wider uppercase block leading-tight">
              MERCHEM
            </span>
            <span className="text-[10px] font-semibold text-[#980e27] tracking-wider uppercase block">
              India Pvt. Ltd.
            </span>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="w-full max-w-[420px] my-auto bg-white p-7 sm:p-10 rounded-2xl sm:shadow-xl sm:shadow-black/5 border border-[#E5E7EB]">
          {/* Main Logo & Titles */}
          <div className="text-left mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF5F7] p-2.5 flex items-center justify-center border border-[#980e27]/20 mb-4 shadow-xs">
              <Image
                src="/Main_logo.png"
                alt="Merchem Main Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#172126] tracking-tight">
              Admin Login
            </h2>
            <p className="text-sm text-[#64748B] mt-1.5 leading-normal">
              Sign in to access your Merchem management dashboard.
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#FFF5F5] border border-[#FEB2B2] flex items-start gap-3 text-xs text-[#E53E3E]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Success Alert Box */}
          {isSuccess && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#F0FDF4] border border-[#86EFAC] flex items-center gap-3 text-xs text-[#166534]">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
              <span className="font-semibold">Authentication successful! Redirecting...</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                  className="w-full h-[48px] pl-11 pr-4 bg-white text-[#172126] text-sm font-normal placeholder-[#94A3B8] rounded-[8px] border border-[#DDE3E0] outline-hidden transition-all focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
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
                  className="w-full h-[48px] pl-11 pr-11 bg-white text-[#172126] text-sm font-normal placeholder-[#94A3B8] rounded-[8px] border border-[#DDE3E0] outline-hidden transition-all focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
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
              className="w-full h-[48px] mt-2 inline-flex items-center justify-center gap-2 px-6 bg-[#980e27] hover:bg-[#7A0B1F] active:bg-[#600818] text-white text-sm font-semibold rounded-[8px] transition-all duration-200 shadow-md shadow-[#980e27]/20 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed outline-hidden focus:ring-2 focus:ring-[#980e27]/40"
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
        <footer className="w-full text-center py-4">
          <p className="text-xs text-[#64748B]">
            © {new Date().getFullYear()} Merchem India Pvt. Ltd. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}