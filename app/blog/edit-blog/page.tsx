"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "../../component/layout/Layout";
import BreadCrumbs from "../../component/common/BreadCrumbs";
import { getBlogByIdApi, updateBlogApi } from "../../utils/blog";
import { getStoredUser, getMeApi } from "../../utils/auth";
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
  Lock,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

function EditBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Logged-in User State
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Loading & Data Fetch States
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeBlogId, setActiveBlogId] = useState<string | null>(null);

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
  const [publishDate, setPublishDate] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [category, setCategory] = useState("Technical Guide");
  const [authorName, setAuthorName] = useState("");

  // UI Feedback States
  const [isSaving, setIsSaving] = useState(false);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    } else {
      getMeApi()
        .then((res: any) => {
          const userObj = res?.user || res?.data?.user || res?.data || res;
          if (userObj) setCurrentUser(userObj);
        })
        .catch(() => null);
    }
  }, []);

  // Fetch Blog Data by ID from query params or window location
  useEffect(() => {
    let targetId = searchParams.get("id");
    if (!targetId && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      targetId = urlParams.get("id");
    }

    if (!targetId) {
      setIsFetching(false);
      setFetchError("No blog ID provided in the URL.");
      return;
    }

    setActiveBlogId(targetId);

    const loadBlog = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const res: any = await getBlogByIdApi(targetId);
        console.log("Fetched Blog Details:", res);

        // Safely extract blog object from API response
        const data = res?.data?.data || res?.data || res?.blog || res;

        if (data && typeof data === "object") {
          setTitle(data.title || data.name || "");
          setSlug(data.slug || "");
          setExcerpt(data.excerpt || data.short_description || data.description || "");
          setContent(data.content || data.body || data.details || data.article || "");

          const catVal = typeof data.category === "object" ? data.category?.name : data.category;
          if (catVal) setCategory(catVal);

          const rawStatus = (data.status || "").toString().toLowerCase();
          if (rawStatus === "published") setStatus("Published");
          else if (rawStatus === "scheduled") setStatus("Scheduled");
          else setStatus("Draft");

          setIsFeatured(Boolean(data.is_featured ?? data.isFeatured ?? data.featured));

          const imgUrl = data.featured_image_url || data.featured_image || data.image || data.thumbnail || null;
          setFeaturedImage(imgUrl);
          setImageAltText(data.image_alt_text || data.alt_text || "");

          const pubAt = data.published_at || data.publication_date;
          if (pubAt) {
            try {
              const dt = new Date(pubAt);
              if (!isNaN(dt.getTime())) {
                const iso = dt.toISOString().slice(0, 16);
                setPublishDate(iso);
              }
            } catch {
              setPublishDate("");
            }
          }

          if (data.author?.name) {
            setAuthorName(data.author.name);
          } else if (typeof data.author === "string") {
            setAuthorName(data.author);
          }
        } else {
          setFetchError("Blog post data not found in response.");
        }
      } catch (err: any) {
        console.error("Failed to load blog details:", err);
        setFetchError(err?.message || "Failed to load blog post from server.");
      } finally {
        setIsFetching(false);
      }
    };

    loadBlog();
  }, [searchParams]);

  // Handle Title input change
  const handleTitleChange = (val: string) => {
    setTitle(val);
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

  // Submit Handler connected to backend PUT /v1/blogs/:id API
  const handleUpdate = async (publishMode: boolean) => {
    const targetId = activeBlogId || searchParams.get("id") || (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("id") : null);

    if (!targetId) {
      alert("Invalid Blog ID.");
      return;
    }

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
      formData.append("category", category);
      formData.append("is_featured", isFeatured ? "1" : "0");

      if (imageAltText.trim()) {
        formData.append("image_alt_text", imageAltText.trim());
      }

      if (featuredImageFile) {
        formData.append("featured_image", featuredImageFile);
      }

      if (status === "Scheduled" && publishDate) {
        formData.append("published_at", publishDate);
      }

      const res: any = await updateBlogApi(targetId, formData);

      if (res?.success || res?.data) {
        const actionText = publishMode ? "updated and published successfully!" : "updated and saved as draft!";
        setSuccessAlert(`Blog article "${title}" ${actionText}`);
        setTimeout(() => {
          router.push("/blog/view-all");
        }, 1500);
      } else {
        setErrorAlert(res?.message || "Failed to update blog article.");
      }
    } catch (err: any) {
      const errorMsg =
        err?.message ||
        (err?.errors ? Object.values(err.errors).flat().join(", ") : "An error occurred while updating the blog.");
      setErrorAlert(String(errorMsg));
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout activeNavId="all-blogs">
        <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
          <Loader2 className="w-10 h-10 text-[#980e27] animate-spin" />
          <p className="text-sm font-semibold text-[#475569]">Loading blog details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout activeNavId="all-blogs">
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto text-[#DC2626]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#172126]">Unable to Load Blog</h2>
          <p className="text-sm text-[#718096]">{fetchError}</p>
          <div className="pt-2">
            <Link
              href="/blog/view-all"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#980e27] text-white text-xs font-semibold rounded-xl hover:bg-[#7A0B1F] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Blogs</span>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeNavId="all-blogs">
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
                { label: `Edit Blog #${activeBlogId || ""}` },
              ]}
            />

            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight flex items-center gap-2">
              <span>Edit Blog Post</span>
              {activeBlogId && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/20 font-mono font-normal">
                  ID: {activeBlogId}
                </span>
              )}
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Update article details, content, featured media, and publishing settings.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleUpdate(false)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFA] text-[#172126] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#718096]" /> : <Save className="w-4 h-4 text-[#718096]" />}
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleUpdate(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <RefreshCw className="w-4 h-4" />}
              <span>Update & Publish</span>
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
                      onClick={() => {
                        setFeaturedImage(null);
                        setFeaturedImageFile(null);
                      }}
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

              {/* Author */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                  Author
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#980e27] absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    readOnly
                    value={authorName || (currentUser?.name ? `${currentUser.name}${currentUser.email ? ` (${currentUser.email})` : ""}` : "Merchem Admin")}
                    className="w-full h-10 pl-9 pr-9 bg-[#F8FAFA] text-xs font-semibold text-[#172126] rounded-lg border border-[#DDE3E0] cursor-not-allowed outline-hidden"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#94A3B8] absolute right-3 pointer-events-none" />
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
                  <option value="Technical Papers">Technical Papers</option>
                  <option value="Technical Guide">Technical Guide</option>
                  <option value="Safety & Compliance">Safety & Compliance</option>
                  <option value="R&D Insights">R&D Insights</option>
                  <option value="Company News">Company News</option>
                  <option value="Technical">Technical</option>
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
              onClick={() => handleUpdate(false)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFA] text-[#172126] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#718096]" /> : <Save className="w-4 h-4 text-[#718096]" />}
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleUpdate(true)}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <RefreshCw className="w-4 h-4" />}
              <span>Update & Publish</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function EditBlogPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout activeNavId="all-blogs">
          <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
            <Loader2 className="w-10 h-10 text-[#980e27] animate-spin" />
            <p className="text-sm font-semibold text-[#475569]">Loading page...</p>
          </div>
        </DashboardLayout>
      }
    >
      <EditBlogContent />
    </Suspense>
  );
}
