"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "../../component/layout/Layout";
import BreadCrumbs from "../../component/common/BreadCrumbs";
import { toast } from "../../component/common/Toast";
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
  // Tab 4: Security Settings State
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
  // Tab 5: Media & Storage State
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
      toast.success(`${sectionName} settings saved successfully!`);
    }, 600);
  };
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securitySettings.currentPassword || !securitySettings.newPassword) {
      toast.error("Please enter both current and new passwords.");
      return;
    }
    if (securitySettings.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error("New passwords do not match.");
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
      toast.success("Password updated successfully!");
    }, 800);
  };

  return (
    <DashboardLayout activeNavId="settings">
      <div className="space-y-6 w-full pb-16 select-none relative">
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
            <BreadCrumbs
              items={[
                { label: "Administration" },
                { label: "Settings" },
              ]}
            />

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


      </div>
    </DashboardLayout>
  );
}
