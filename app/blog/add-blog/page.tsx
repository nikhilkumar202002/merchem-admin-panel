"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../component/layout/Layout";
import BreadCrumbs from "../../component/common/BreadCrumbs";
import { createBlogApi } from "../../utils/blog";
import {
  FileText,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
  Upload,
  CheckCircle2,
  Globe,
  Calendar,
  User,
  Star,
  X,
  Save,
  Send,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AddBlogPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  // Featured Image State
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [imageAltText, setImageAltText] = useState("");

  // Publishing Settings State
  const [status, setStatus] = useState<"Draft" | "Published" | "Scheduled">("Published");
  const [author, setAuthor] = useState("Nikhil Kumar");
  const [publishDate, setPublishDate] = useState("2026-10-01T10:00");
  const [isFeatured, setIsFeatured] = useState(false);
  const [category, setCategory] = useState("Technical Guide");

  // UI Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  // Auto-generate Slug from Title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");
    setSlug(autoSlug);
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImage(imageUrl);
    }
  };

  // Submit Handler connected to backend POST /v1/blogs API
  const handleSave = async (publishMode: boolean) => {
    if (!title.trim()) {
      alert("Please enter a blog title.");
      return;
    }

    if (!content.trim()) {
      alert("Please enter article content.");
      return;
    }

    setIsSaving(true);
    setSuccessAlert(null);
    setErrorAlert(null);

    try {
      const targetStatus = publishMode ? "published" : "draft";

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("slug", slug.trim());
      formData.append("excerpt", excerpt.trim());
      formData.append("content", content);
      formData.append("status", targetStatus);

      if (featuredImageFile) {
        formData.append("featured_image", featuredImageFile);
      }

      const res: any = await createBlogApi(formData);

      if (res?.success || res?.data) {
        const actionText = publishMode ? "published successfully!" : "saved as draft!";
        setSuccessAlert(`Blog article "${title}" ${actionText}`);
        setTimeout(() => {
          router.push("/blog/view-all");
        }, 1500);
      } else {
        setErrorAlert(res?.message || "Failed to create blog article.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.message ||
        (err?.errors ? Object.values(err.errors).flat().join(", ") : "An error occurred while saving the blog.");
      setErrorAlert(String(errorMsg));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout activeNavId="add-blog">
      <div className="space-y-6 w-full pb-16 select-none">
        {/* ========================================================================= */}
        {/* 1. PAGE HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
          <div>
            {/* Breadcrumb */}
            <BreadCrumbs
              items={[
                { label: "Blog Management", href: "/blog/view-all" },
                { label: "Add New Blog" },
              ]}
            />

            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              Add New Blog
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Create and publish articles, industry insights, and company updates for the Merchem website.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFA] text-[#172126] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#718096]" />
              <span>Save as Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#087F5B] hover:bg-[#066C4D] active:bg-[#05573E] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish Blog</span>
            </button>
          </div>
        </div>

        {/* Success Alert Feedback */}
        {successAlert && (
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-[#166534] flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
              <span>{successAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessAlert(null)}
              className="p-1 text-[#166534] hover:bg-[#DCFCE7] rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Alert Feedback */}
        {errorAlert && (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 text-[#DC2626]" />
              <span>{errorAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorAlert(null)}
              className="p-1 text-[#991B1B] hover:bg-[#FEE2E2] rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. MAIN TWO-COLUMN LAYOUT (Left 70% / Right 30%)                           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================================= */}
          {/* LEFT COLUMN — BLOG CONTENT EDITOR (70% / 8 Cols on lg)                 */}
          {/* ======================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card: Blog Content */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-6 space-y-6">
              <div className="pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
                <h2 className="text-base font-bold text-[#172126] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#980e27]" />
                  <span>Blog Content</span>
                </h2>
                <span className="text-xs text-[#718096]">Required fields *</span>
              </div>

              {/* Blog Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Blog Title *
                  </label>
                  <span className="text-[11px] text-[#718096]">
                    {title.length} / 100 characters
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={100}
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter an engaging blog title e.g. Specialty Chemicals for Rubber Industry"
                  className="w-full h-12 px-4 bg-white text-base font-semibold text-[#172126] placeholder-[#94A3B8] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20 transition-all"
                />
              </div>

              {/* URL Slug & Public Link Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                  URL Slug *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs text-[#94A3B8] font-mono">
                    merchem.com/blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="specialty-chemicals-for-rubber-industry"
                    className="w-full h-10 pl-[135px] pr-4 bg-white text-xs font-mono text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20 transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#718096] flex items-center gap-1">
                  <Globe className="w-3 h-3 text-[#980e27]" />
                  <span>Public URL: https://merchem.com/blog/{slug || "your-blog-slug"}</span>
                </p>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Short Description / Excerpt
                  </label>
                  <span className="text-[11px] text-[#718096]">
                    {excerpt.length} / 200 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Write a brief summary of the article. This excerpt will appear on blog cards and search engine previews."
                  className="w-full p-3.5 bg-white text-sm text-[#172126] placeholder-[#94A3B8] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20 transition-all"
                />
              </div>

              {/* Blog Content Rich Editor */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                  Article Content *
                </label>

                {/* Rich Editor Component */}
                <div className="rounded-xl border border-[#DDE3E0] overflow-hidden focus-within:border-[#980e27] focus-within:ring-2 focus-within:ring-[#980e27]/20 transition-all">
                  {/* Rich Text Toolbar */}
                  <div className="bg-[#F8FAFA] p-2 border-b border-[#E5E7EB] flex flex-wrap items-center gap-1 text-[#475569]">
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Heading 2"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Heading 3"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-[1px] bg-[#E5E7EB] mx-1" />
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-[1px] bg-[#E5E7EB] mx-1" />
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Bulleted List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Quote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-[1px] bg-[#E5E7EB] mx-1" />
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Insert Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Insert Image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-[1px] bg-[#E5E7EB] mx-1" />
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Undo"
                    >
                      <Undo className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-white hover:text-[#980e27] rounded-md transition-colors cursor-pointer"
                      title="Redo"
                    >
                      <Redo className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Editing Canvas Area */}
                  <textarea
                    rows={14}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your article content here..."
                    className="w-full p-4 bg-white text-sm text-[#172126] leading-relaxed outline-hidden border-0 resize-y"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN — SETTINGS & SEO (30% / 4 Cols on lg)                       */}
          {/* ======================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: Featured Image */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#172126] uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#980e27]" />
                <span>Featured Image</span>
              </h2>

              {featuredImage ? (
                /* Image Preview Mode */
                <div className="space-y-3">
                  <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#E5E7EB]">
                    <Image
                      src={featuredImage}
                      alt="Featured image preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 text-center py-1.5 px-3 bg-[#F8FAFA] hover:bg-[#FFF5F7] hover:text-[#980e27] border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#475569] cursor-pointer transition-colors">
                      Replace Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage(null)}
                      className="py-1.5 px-3 bg-white hover:bg-[#FFF5F5] border border-[#FEB2B2] text-[#E53E3E] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* Upload Dropzone Mode */
                <label className="block p-6 rounded-xl border-2 border-dashed border-[#DDE3E0] hover:border-[#980e27] bg-[#F8FAFA] hover:bg-[#FFF5F7]/30 text-center cursor-pointer transition-all">
                  <Upload className="w-6 h-6 text-[#980e27] mx-auto mb-2" />
                  <span className="text-xs font-semibold text-[#172126] block">
                    Drag and drop an image here
                  </span>
                  <span className="text-[11px] text-[#718096] block mt-0.5">
                    or browse files (JPG, PNG, WebP)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Alt Text Field */}
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-semibold text-[#718096] uppercase">
                  Image Alt Text
                </label>
                <input
                  type="text"
                  value={imageAltText}
                  onChange={(e) => setImageAltText(e.target.value)}
                  placeholder="Describe image for accessibility & SEO"
                  className="w-full h-8 px-3 bg-white text-xs text-[#172126] rounded-md border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                />
              </div>
            </div>

            {/* Card 2: Publishing Settings */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#172126] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#980e27]" />
                <span>Publishing Settings</span>
              </h2>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white text-xs font-medium text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              {/* Author Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                  Author
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 pointer-events-none" />
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white text-xs font-medium text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                  >
                    <option value="Nikhil Kumar">Nikhil Kumar (Administrator)</option>
                    <option value="R&D Technical Team">R&D Technical Team</option>
                    <option value="Corporate Communications">Corporate Communications</option>
                  </select>
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                  Blog Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-xs font-medium text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                >
                  <option value="Technical Guide">Technical Guide</option>
                  <option value="Safety & Compliance">Safety & Compliance</option>
                  <option value="R&D Insights">R&D Insights</option>
                  <option value="Company News">Company News</option>
                </select>
              </div>

              {/* Publication Date & Time (Enabled when Scheduled) */}
              {status === "Scheduled" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full h-10 px-3 bg-white text-xs text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                  />
                </div>
              )}

              {/* Featured Article Toggle */}
              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#172126] block">
                    Featured Post
                  </span>
                  <span className="text-[10px] text-[#718096]">
                    Pin article on blog homepage
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    isFeatured ? "bg-[#980e27]" : "bg-[#DDE3E0]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isFeatured ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM ACTIONS BAR                                                     */}
        {/* ========================================================================= */}
        <div className="p-4 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center justify-between gap-4">
          <Link
            href="/blog/view-all"
            className="px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFA] text-sm font-semibold text-[#475569] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFA] text-[#172126] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#718096]" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish Blog</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}