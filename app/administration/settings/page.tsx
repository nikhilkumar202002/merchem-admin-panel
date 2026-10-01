"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "../../component/layout/Layout";
import {
  Sliders,
  Building,
  Globe,
  Mail,
  Shield,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Save,
  Send,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  FileText,
  Clock,
  RotateCcw,
  Check,
  Server,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

type SettingsTab =
  | "general"
  | "company"
  | "seo"
  | "email"
  | "security"
  | "media";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // Tab 1: General Settings State
  // ---------------------------------------------------------------------------
  const [generalSettings, setGeneralSettings] = useState({
    websiteName: "Merchem India Admin Panel",
    websiteUrl: "https://merchem.com",
    defaultLanguage: "English (US)",
    timeZone: "(GMT+05:30) India Standard Time (IST)",
    dateFormat: "DD MMM YYYY (e.g. 01 Oct 2026)",
  });

  // ---------------------------------------------------------------------------
  // Tab 2: Company Information State
  // ---------------------------------------------------------------------------
  const [companySettings, setCompanySettings] = useState({
    companyName: "Merchem India Pvt. Ltd.",
    logoUrl: "/Main_logo.png",
    companyEmail: "info@merchem.com",
    salesEmail: "sales@merchem.com",
    phone: "+91 484 2555 123",
    address: "Merchem House, Industrial Estate, Kalamassery, Kochi, Kerala 683109, India",
    websiteUrl: "https://merchem.com",
  });

  // ---------------------------------------------------------------------------
  // Tab 3: Website & SEO State
  // ---------------------------------------------------------------------------
  const [seoSettings, setSeoSettings] = useState({
    defaultMetaTitle: "Merchem India Pvt. Ltd. | Specialty Chemicals & Rubber Accelerators",
    defaultMetaDescription: "Leading manufacturer of rubber chemicals, vulcanization accelerators, antioxidants, latex chemicals and industrial specialty chemicals.",
    defaultSeoImage: "/chemical_bg.jpg",
    allowIndexing: true,
  });

  // ---------------------------------------------------------------------------
  // Tab 4: Email Configuration State
  // ---------------------------------------------------------------------------
  const [emailSettings, setEmailSettings] = useState({
    provider: "SendGrid Transactional API",
    senderName: "Merchem India Support",
    senderEmail: "noreply@merchem.com",
    replyToEmail: "sales@merchem.com",
    apiKeyMasked: "SG.****************************************************",
    connectionStatus: "Connected & Verified (TLS 1.3)",
  });

  const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
  const [testRecipientEmail, setTestRecipientEmail] = useState("nikhil.kumar@merchem.com");
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  // ---------------------------------------------------------------------------
  // Tab 5: Security Settings State
  // ---------------------------------------------------------------------------
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    sessionTimeout: "30 Minutes",
    lockFailedAttempts: true,
    mfaEnabled: true,
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ---------------------------------------------------------------------------
  // Tab 6: Media & Storage State
  // ---------------------------------------------------------------------------
  const [mediaSettings, setMediaSettings] = useState({
    maxUploadSizeMb: 10,
    allowedImageFormats: "JPG, PNG, WEBP, SVG",
    allowedDocumentFormats: "PDF, DOCX, XLSX",
    tdsUploadLimitMb: 10,
    storageProvider: "Local Volume / Cloud Storage (Active)",
  });

  // Generic Save Handler with feedback simulation
  const handleSave = (sectionName: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      showToast(`${sectionName} settings saved successfully!`);
    }, 600);
  };

  // Test Email Execution
  const handleSendTestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipientEmail) return;
    setIsSendingTestEmail(true);

    setTimeout(() => {
      setIsSendingTestEmail(false);
      setIsTestEmailModalOpen(false);
      showToast(`Test email sent successfully to ${testRecipientEmail}!`);
    }, 1200);
  };

  // Handle Password Change Submission
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securitySettings.currentPassword || !securitySettings.newPassword) {
      alert("Please enter both current and new passwords.");
      return;
    }
    if (securitySettings.newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecuritySettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      showToast("Password updated successfully!");
    }, 800);
  };

  return (
    <DashboardLayout activeNavId="settings">
      <div className="space-y-6 max-w-7xl mx-auto pb-16 select-none relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-[#172126] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. PAGE HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#718096] mb-1 font-medium">
              <Link href="/" className="hover:text-[#980e27] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span>Administration</span>
              <span>/</span>
              <span className="text-[#980e27] font-semibold">Settings</span>
            </div>

            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              System Settings
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Manage your website configuration, company information, and administrative preferences.
            </p>
          </div>

          {/* Unsaved Changes Banner */}
          {hasUnsavedChanges && (
            <div className="px-3 py-1.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>You have unsaved changes!</span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. TWO-COLUMN LAYOUT (Nav Left 25% / Content Right 75%)                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================================= */}
          {/* LEFT SIDEBAR NAVIGATION (3 Cols on lg)                                  */}
          {/* ======================================================================= */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-2 space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "general"
                  ? "bg-[#980e27] text-white shadow-xs"
                  : "text-[#475569] hover:bg-[#FFF5F7] hover:text-[#980e27]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4" />
                <span>General Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("company")}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "company"
                  ? "bg-[#980e27] text-white shadow-xs"
                  : "text-[#475569] hover:bg-[#FFF5F7] hover:text-[#980e27]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4" />
                <span>Company Info</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "seo"
                  ? "bg-[#980e27] text-white shadow-xs"
                  : "text-[#475569] hover:bg-[#FFF5F7] hover:text-[#980e27]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" />
                <span>Website & SEO</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "email"
                  ? "bg-[#980e27] text-white shadow-xs"
                  : "text-[#475569] hover:bg-[#FFF5F7] hover:text-[#980e27]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>Email Configuration</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-[#980e27] text-white shadow-xs"
                  : "text-[#475569] hover:bg-[#FFF5F7] hover:text-[#980e27]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4" />
                <span>Security</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === "media"
                  ? "bg-[#980e27] text-white shadow-xs"
                  : "text-[#475569] hover:bg-[#FFF5F7] hover:text-[#980e27]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4" />
                <span>Media & Documents</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT CONTENT PANEL (9 Cols on lg)                                      */}
          {/* ======================================================================= */}
          <div className="lg:col-span-9 space-y-6">
            {/* ------------------------------------------------------------------- */}
            {/* TAB 1: GENERAL SETTINGS                                             */}
            {/* ------------------------------------------------------------------- */}
            {activeTab === "general" && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-6 space-y-6">
                <div className="pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#172126] flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#980e27]" />
                    <span>General Website Settings</span>
                  </h2>
                  <span className="text-xs text-[#718096]">System Defaults</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Website Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.websiteName}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, websiteName: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Website Public URL
                    </label>
                    <input
                      type="url"
                      value={generalSettings.websiteUrl}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, websiteUrl: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        Default Language
                      </label>
                      <select
                        value={generalSettings.defaultLanguage}
                        onChange={(e) => {
                          setGeneralSettings({ ...generalSettings, defaultLanguage: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                      >
                        <option value="English (US)">English (US)</option>
                        <option value="English (UK)">English (UK)</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        Time Zone
                      </label>
                      <select
                        value={generalSettings.timeZone}
                        onChange={(e) => {
                          setGeneralSettings({ ...generalSettings, timeZone: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                      >
                        <option value="(GMT+05:30) India Standard Time (IST)">
                          (GMT+05:30) India Standard Time (IST)
                        </option>
                        <option value="(GMT+00:00) UTC / GMT">(GMT+00:00) UTC / GMT</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave("General")}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save General Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 2: COMPANY INFORMATION                                          */}
            {/* ------------------------------------------------------------------- */}
            {activeTab === "company" && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-6 space-y-6">
                <div className="pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#172126] flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#980e27]" />
                    <span>Company Information</span>
                  </h2>
                  <span className="text-xs text-[#718096]">Official Branding & Contact</span>
                </div>

                {/* Company Logo Row */}
                <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-16 h-16 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden p-2 flex items-center justify-center shrink-0">
                    <Image
                      src={companySettings.logoUrl}
                      alt="Company Logo"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <span className="text-sm font-bold text-[#172126] block">
                      Company Logo Branding
                    </span>
                    <span className="text-xs text-[#718096] block">
                      Displayed on website header, admin panel, and transactional emails.
                    </span>
                  </div>
                  <label className="px-4 py-2 bg-white hover:bg-[#FFF5F7] border border-[#E5E7EB] hover:border-[#980e27]/30 text-xs font-semibold text-[#980e27] rounded-xl cursor-pointer transition-colors shadow-2xs">
                    Change Logo
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companySettings.companyName}
                        onChange={(e) => {
                          setCompanySettings({ ...companySettings, companyName: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3.5 bg-white text-sm font-bold text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={companySettings.phone}
                        onChange={(e) => {
                          setCompanySettings({ ...companySettings, phone: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        General Email Address
                      </label>
                      <input
                        type="email"
                        value={companySettings.companyEmail}
                        onChange={(e) => {
                          setCompanySettings({ ...companySettings, companyEmail: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        Sales Inquiry Email
                      </label>
                      <input
                        type="email"
                        value={companySettings.salesEmail}
                        onChange={(e) => {
                          setCompanySettings({ ...companySettings, salesEmail: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Registered Headquarters Address
                    </label>
                    <textarea
                      rows={3}
                      value={companySettings.address}
                      onChange={(e) => {
                        setCompanySettings({ ...companySettings, address: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full p-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave("Company Info")}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Company Info</span>
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 3: WEBSITE & SEO                                                */}
            {/* ------------------------------------------------------------------- */}
            {activeTab === "seo" && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-6 space-y-6">
                <div className="pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#172126] flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#980e27]" />
                    <span>Website & Sitewide SEO Defaults</span>
                  </h2>
                  <span className="text-xs text-[#718096]">Search Engine Settings</span>
                </div>

                {/* Explanatory Info Notice */}
                <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] flex items-start gap-3 text-xs text-[#475569]">
                  <Info className="w-5 h-5 text-[#980e27] shrink-0 mt-0.5" />
                  <p>
                    These metadata values serve as standard global defaults for your website. Specific products, main categories, or individual blog articles can override these fields with their own customized titles and descriptions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Default Sitewide Meta Title
                    </label>
                    <input
                      type="text"
                      value={seoSettings.defaultMetaTitle}
                      onChange={(e) => {
                        setSeoSettings({ ...seoSettings, defaultMetaTitle: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Default Sitewide Meta Description
                    </label>
                    <textarea
                      rows={3}
                      value={seoSettings.defaultMetaDescription}
                      onChange={(e) => {
                        setSeoSettings({ ...seoSettings, defaultMetaDescription: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full p-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>

                  {/* Robots Indexing Toggle */}
                  <div className="p-4 rounded-xl border border-[#E5E7EB] bg-white flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-[#172126] block">
                        Search Engine Indexing (robots.txt)
                      </span>
                      <span className="text-xs text-[#718096]">
                        Allow search engines (Google, Bing) to crawl and index your website.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSeoSettings({ ...seoSettings, allowIndexing: !seoSettings.allowIndexing });
                        setHasUnsavedChanges(true);
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        seoSettings.allowIndexing ? "bg-[#980e27]" : "bg-[#DDE3E0]"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          seoSettings.allowIndexing ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave("SEO")}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save SEO Preferences</span>
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 4: EMAIL CONFIGURATION                                          */}
            {/* ------------------------------------------------------------------- */}
            {activeTab === "email" && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-6 space-y-6">
                <div className="pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#172126] flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#980e27]" />
                    <span>Email & Transactional Delivery</span>
                  </h2>
                  <span className="text-xs font-semibold text-[#087F5B] bg-[#E6F4EA] px-2.5 py-1 rounded-full border border-[#087F5B]/20">
                    {emailSettings.connectionStatus}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Email Delivery Service Provider
                    </label>
                    <select
                      value={emailSettings.provider}
                      onChange={(e) => {
                        setEmailSettings({ ...emailSettings, provider: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full h-10 px-3 bg-white text-sm font-semibold text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                    >
                      <option value="SendGrid Transactional API">SendGrid Transactional API</option>
                      <option value="Amazon SES">Amazon SES (Simple Email Service)</option>
                      <option value="Postmark">Postmark App</option>
                      <option value="SMTP Server">Custom SMTP Server</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        Sender Display Name
                      </label>
                      <input
                        type="text"
                        value={emailSettings.senderName}
                        onChange={(e) => {
                          setEmailSettings({ ...emailSettings, senderName: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        Sender Email Address
                      </label>
                      <input
                        type="email"
                        value={emailSettings.senderEmail}
                        onChange={(e) => {
                          setEmailSettings({ ...emailSettings, senderEmail: e.target.value });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>
                  </div>

                  {/* Masked Secret API Key Indicator */}
                  <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        API Key Secret (Masked)
                      </label>
                      <span className="text-[11px] text-[#087F5B] font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Encrypted on Server
                      </span>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={emailSettings.apiKeyMasked}
                      className="w-full h-9 px-3 bg-white text-xs font-mono text-[#718096] rounded-lg border border-[#E5E7EB] outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setIsTestEmailModalOpen(true)}
                    className="px-4 py-2.5 bg-white hover:bg-[#FFF5F7] border border-[#E5E7EB] hover:border-[#980e27]/30 text-xs font-semibold text-[#980e27] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Test Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave("Email Configuration")}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Email Config</span>
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 5: SECURITY                                                     */}
            {/* ------------------------------------------------------------------- */}
            {activeTab === "security" && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-6 space-y-6">
                <div className="pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#172126] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#980e27]" />
                    <span>Security & Account Protection</span>
                  </h2>
                  <span className="text-xs font-semibold text-[#087F5B] bg-[#E6F4EA] px-2.5 py-1 rounded-full border border-[#087F5B]/20">
                    2FA Enabled
                  </span>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-4">
                  <span className="text-xs font-bold text-[#172126] uppercase tracking-wider block">
                    Change Administrator Password
                  </span>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126]">
                      Current Password *
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={securitySettings.currentPassword}
                        onChange={(e) =>
                          setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })
                        }
                        placeholder="Enter current password"
                        className="w-full h-10 pl-3 pr-10 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 text-[#718096] hover:text-[#172126]"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126]">
                        New Password *
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={securitySettings.newPassword}
                          onChange={(e) =>
                            setSecuritySettings({ ...securitySettings, newPassword: e.target.value })
                          }
                          placeholder="Min 8 characters"
                          className="w-full h-10 pl-3 pr-10 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 text-[#718096] hover:text-[#172126]"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126]">
                        Confirm New Password *
                      </label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={securitySettings.confirmPassword}
                        onChange={(e) =>
                          setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })
                        }
                        placeholder="Re-enter new password"
                        className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>

                {/* Session Timeout Preference */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Inactivity Session Timeout
                    </label>
                    <select
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => {
                        setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                    >
                      <option value="15 Minutes">15 Minutes</option>
                      <option value="30 Minutes">30 Minutes (Recommended)</option>
                      <option value="1 Hour">1 Hour</option>
                      <option value="4 Hours">4 Hours</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave("Security Preferences")}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Security Preferences</span>
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* TAB 6: MEDIA & DOCUMENTS                                            */}
            {/* ------------------------------------------------------------------- */}
            {activeTab === "media" && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-6 space-y-6">
                <div className="pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#172126] flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-[#980e27]" />
                    <span>Media Storage & File Upload Limits</span>
                  </h2>
                  <span className="text-xs text-[#718096]">File Volume Limits</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        Maximum Image Upload Limit (MB)
                      </label>
                      <input
                        type="number"
                        value={mediaSettings.maxUploadSizeMb}
                        onChange={(e) => {
                          setMediaSettings({ ...mediaSettings, maxUploadSizeMb: Number(e.target.value) });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                        Maximum TDS PDF Document Limit (MB)
                      </label>
                      <input
                        type="number"
                        value={mediaSettings.tdsUploadLimitMb}
                        onChange={(e) => {
                          setMediaSettings({ ...mediaSettings, tdsUploadLimitMb: Number(e.target.value) });
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Allowed Image Formats
                    </label>
                    <input
                      type="text"
                      value={mediaSettings.allowedImageFormats}
                      onChange={(e) => {
                        setMediaSettings({ ...mediaSettings, allowedImageFormats: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Allowed Document Formats
                    </label>
                    <input
                      type="text"
                      value={mediaSettings.allowedDocumentFormats}
                      onChange={(e) => {
                        setMediaSettings({ ...mediaSettings, allowedDocumentFormats: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave("Media & Document Storage")}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Storage Limits</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. TEST EMAIL MODAL                                                       */}
        {/* ========================================================================= */}
        {isTestEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center border border-[#980e27]/20 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172126]">Send Test Email</h3>
                  <p className="text-xs text-[#718096]">
                    Verify configured transactional email API connection.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendTestEmail} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126]">
                    Recipient Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={testRecipientEmail}
                    onChange={(e) => setTestRecipientEmail(e.target.value)}
                    className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTestEmailModalOpen(false)}
                    disabled={isSendingTestEmail}
                    className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-xl hover:bg-[#F8FAFA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingTestEmail}
                    className="px-5 py-2 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    {isSendingTestEmail ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Test Email...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Test Email</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
