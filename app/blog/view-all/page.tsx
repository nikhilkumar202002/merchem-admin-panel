"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "../../component/layout/Layout";
import BreadCrumbs from "../../component/common/BreadCrumbs";
import { getBlogsApi, deleteBlogApi } from "../../utils/blog";
import {
  Newspaper,
  CheckCircle2,
  FileEdit,
  Clock,
  Search,
  Filter,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  Copy,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  User,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export interface BlogItem {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  status: "Published" | "Draft" | "Scheduled";
  isFeatured: boolean;
  publicationDate: string;
  lastUpdated: string;
  thumbnail?: string;
  views: number;
}

export default function AllBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch blogs from backend API
  const fetchBlogs = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res: any = await getBlogsApi();
      const rawData = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      
      const mapped: BlogItem[] = rawData.map((b: any) => ({
        id: b.id,
        title: b.title || "Untitled",
        slug: b.slug || "",
        excerpt: b.excerpt || "",
        author: b.author?.name || "Admin",
        category: b.category || "Technical",
        status: b.status?.toLowerCase() === "published" ? "Published" : b.status?.toLowerCase() === "scheduled" ? "Scheduled" : "Draft",
        isFeatured: Boolean(b.is_featured),
        publicationDate: b.published_at ? new Date(b.published_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Not published",
        lastUpdated: b.updated_at ? new Date(b.updated_at).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently",
        thumbnail: b.featured_image_url || b.featured_image || undefined,
        views: b.views || 0,
      }));
      setBlogs(mapped);
    } catch (err: any) {
      console.error("Failed to load blogs:", err);
      setErrorMsg(err.message || "Failed to load blogs from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Selection Checkbox States
  const [selectedBlogIds, setSelectedBlogIds] = useState<(string | number)[]>([]);

  // Action Menu & Modal States
  const [activeMenuId, setActiveMenuId] = useState<string | number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogItem | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Statistics Summary Counts
  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.status === "Published").length;
    const drafts = blogs.filter((b) => b.status === "Draft").length;
    const scheduled = blogs.filter((b) => b.status === "Scheduled").length;
    return { total, published, drafts, scheduled };
  }, [blogs]);

  // Derived Filtered List
  const filteredBlogs = useMemo(() => {
    return blogs.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      const matchesAuthor =
        selectedAuthor === "All" || item.author === selectedAuthor;

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesAuthor && matchesCategory;
    });
  }, [blogs, searchQuery, selectedStatus, selectedAuthor, selectedCategory]);

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedAuthor("All");
    setSelectedCategory("All");
  };

  // Selection Checkbox Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBlogIds(filteredBlogs.map((b) => b.id));
    } else {
      setSelectedBlogIds([]);
    }
  };

  const handleSelectRow = (id: string | number) => {
    setSelectedBlogIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Duplicate Blog Action
  const handleDuplicateBlog = (blog: BlogItem) => {
    const duplicated: BlogItem = {
      ...blog,
      id: `blog-${Date.now()}`,
      title: `${blog.title} (Copy)`,
      slug: `${blog.slug}-copy`,
      status: "Draft",
      publicationDate: "Not published",
      lastUpdated: "Just now",
      isFeatured: false,
      views: 0,
    };
    setBlogs((prev) => [duplicated, ...prev]);
    setActiveMenuId(null);
  };

  // Toggle Featured Status Action
  const handleToggleFeatured = (id: string | number) => {
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isFeatured: !b.isFeatured } : b))
    );
  };

  // Single Delete Handler connected to DELETE /v1/blogs/:id
  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteBlogApi(deleteTarget.id);
        setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
        setSelectedBlogIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      } catch (err: any) {
        console.error("Failed to delete blog:", err);
        alert(err.message || "Failed to delete blog article.");
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = (status: "Published" | "Draft") => {
    setBlogs((prev) =>
      prev.map((b) =>
        selectedBlogIds.includes(b.id)
          ? {
              ...b,
              status,
              lastUpdated: "Just now",
              publicationDate: status === "Published" ? "Just now" : b.publicationDate,
            }
          : b
      )
    );
    setSelectedBlogIds([]);
  };

  // Bulk Delete Confirm
  const handleBulkDeleteConfirm = () => {
    setBlogs((prev) => prev.filter((b) => !selectedBlogIds.includes(b.id)));
    setSelectedBlogIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  return (
    <DashboardLayout activeNavId="all-blogs">
      <div className="space-y-6 w-full pb-12 select-none">
        {/* ========================================================================= */}
        {/* 1. PAGE HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <BreadCrumbs
              items={[
                { label: "Blog Management" },
                { label: "All Blogs" },
              ]}
            />

            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              All Blogs
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Create, edit, publish, and manage Merchem&apos;s articles and industry updates.
            </p>
          </div>

          {/* Primary Action Button */}
          <Link
            href="/blog/add-blog"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#087F5B] hover:bg-[#066C4D] active:bg-[#05573E] text-white text-xs font-semibold rounded-md transition-all cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add New Blog
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUMMARY KPI CARDS                                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Blogs */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Blogs
              </span>
            </div>
          </div>

          {/* Card 2: Published */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/10">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.published}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Published
              </span>
            </div>
          </div>

          {/* Card 3: Drafts */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/10">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.drafts}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Drafts
              </span>
            </div>
          </div>

          {/* Card 4: Scheduled */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/10">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.scheduled}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Scheduled
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SEARCH AND FILTERS TOOLBAR                                            */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by title, slug or excerpt..."
                className="w-full h-10 pl-10 pr-4 bg-[#F3F5F6] text-sm text-[#172126] placeholder-[#718096] rounded-lg border border-transparent outline-hidden focus:border-[#980e27] focus:bg-white focus:ring-2 focus:ring-[#980e27]/20 transition-all"
              />
            </div>

            {/* Filter Dropdown Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Filter className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              {/* Author Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <User className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Authors</option>
                  <option value="Nikhil Kumar">Nikhil Kumar</option>
                  <option value="R&D Technical Team">R&D Technical Team</option>
                  <option value="Corporate Communications">Corporate Communications</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Technical Guide">Technical Guide</option>
                  <option value="Safety & Compliance">Safety & Compliance</option>
                  <option value="R&D Insights">R&D Insights</option>
                  <option value="Company News">Company News</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchQuery ||
                selectedStatus !== "All" ||
                selectedAuthor !== "All" ||
                selectedCategory !== "All") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-[#FFF5F7] text-[#980e27] hover:bg-[#980e27] hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#980e27]/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedBlogIds.length > 0 && (
            <div className="p-3 bg-[#FFF5F7] border border-[#980e27]/20 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
              <span className="text-xs font-semibold text-[#980e27]">
                {selectedBlogIds.length} blog(s) selected
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkStatusUpdate("Published")}
                  className="px-2.5 py-1 bg-white hover:bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/30 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Bulk Publish
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatusUpdate("Draft")}
                  className="px-2.5 py-1 bg-white hover:bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Move to Draft
                </button>
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-2.5 py-1 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. BLOGS DATA TABLE                                                       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          {filteredBlogs.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center mx-auto border border-[#980e27]/20">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172126]">
                  No blog articles found
                </h3>
                <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
                  No blog posts matched your search or filter options. Try adjusting your filters or create a new blog article.
                </p>
              </div>
              <Link
                href="/blog/add-blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#980e27] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer hover:bg-[#7A0B1F]"
              >
                <Plus className="w-4 h-4" />
                Create Your First Blog
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFA] border-b border-[#E5E7EB]">
                    {/* Checkbox Header */}
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedBlogIds.length === filteredBlogs.length &&
                          filteredBlogs.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                      />
                    </th>

                    {/* Blog Title & Thumbnail */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider min-w-[280px]">
                      Blog Article
                    </th>

                    {/* Author */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Author
                    </th>

                    {/* Status */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Status
                    </th>

                    {/* Featured */}
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#718096] uppercase tracking-wider text-center">
                      Featured
                    </th>

                    {/* Publication Date */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Publication Date
                    </th>

                    {/* Last Updated */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Last Updated
                    </th>

                    {/* Actions */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredBlogs.map((item) => {
                    const isSelected = selectedBlogIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isSelected ? "bg-[#FFF5F7]/40" : "hover:bg-[#F8FAFA]/80"
                        }`}
                      >
                        {/* Checkbox Row */}
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(item.id)}
                            className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                          />
                        </td>

                        {/* Blog Thumbnail & Info */}
                        <td className="py-4 px-5 text-sm font-medium text-[#172126]">
                          <div className="flex items-start gap-3">
                            {/* 64x48px Thumbnail or Fallback Icon */}
                            <div className="relative w-[64px] h-[48px] rounded-lg bg-[#FFF5F7] border border-[#980e27]/15 overflow-hidden shrink-0 flex items-center justify-center">
                              {item.thumbnail ? (
                                <Image
                                  src={item.thumbnail}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <Newspaper className="w-5 h-5 text-[#980e27]" />
                              )}
                            </div>

                            <div className="space-y-0.5 max-w-sm">
                              <span className="font-bold text-[#172126] block leading-snug line-clamp-1">
                                {item.title}
                              </span>
                              <span className="text-xs font-mono text-[#718096] block">
                                /blog/{item.slug}
                              </span>
                              <p className="text-xs text-[#64748B] line-clamp-1 font-normal">
                                {item.excerpt}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="py-4 px-5 text-xs font-semibold text-[#475569]">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#718096]" />
                            <span>{item.author}</span>
                          </div>
                        </td>

                        {/* Status Badges */}
                        <td className="py-4 px-5 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.status === "Published"
                                ? "bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/20"
                                : item.status === "Draft"
                                ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                                : "bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/20"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Featured Toggle Indicator */}
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(item.id)}
                            className="p-1 rounded-md hover:bg-[#F3F5F6] transition-colors cursor-pointer"
                            title={item.isFeatured ? "Unpin featured" : "Pin as featured"}
                          >
                            <Star
                              className={`w-4 h-4 mx-auto transition-colors ${
                                item.isFeatured
                                  ? "text-[#980e27] fill-[#980e27]"
                                  : "text-[#CBD5E1]"
                              }`}
                            />
                          </button>
                        </td>

                        {/* Publication Date */}
                        <td className="py-4 px-5 text-xs text-[#64748B]">
                          {item.publicationDate}
                        </td>

                        {/* Last Updated */}
                        <td className="py-4 px-5 text-xs text-[#64748B]">
                          {item.lastUpdated}
                        </td>

                        {/* Row Actions Menu */}
                        <td className="py-4 px-5 text-sm text-right">
                          <div className="flex items-center justify-end gap-1.5 relative">
                            {/* View Public Article Link */}
                            <a
                              href={`/blog/${item.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors"
                              title="View Article"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            {/* Edit Link */}
                            <Link
                              href={`/blog/edit-blog?id=${item.id}`}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors"
                              title="Edit Blog"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>

                            {/* Duplicate Button */}
                            <button
                              type="button"
                              onClick={() => handleDuplicateBlog(item)}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors cursor-pointer"
                              title="Duplicate Blog"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF5F5] rounded-md transition-colors cursor-pointer"
                              title="Delete Blog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="px-5 py-3.5 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#718096]">
            <div className="flex items-center gap-3">
              <span>
                Showing 1 to {filteredBlogs.length} of {blogs.length} blogs
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300">|</span>
                <span>Rows per page:</span>
                <select className="bg-[#F3F5F6] text-xs font-medium text-[#172126] px-2 py-1 rounded-md outline-hidden border border-[#E5E7EB] cursor-pointer">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1.5 border border-[#E5E7EB] rounded-md hover:bg-[#F8FAFA] disabled:opacity-50 cursor-pointer"
                disabled
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-[#980e27] text-white font-semibold rounded-md">
                1
              </span>
              <button
                type="button"
                className="p-1.5 border border-[#E5E7EB] rounded-md hover:bg-[#F8FAFA] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. CONFIRM DELETE MODALS                                                  */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#E53E3E] flex items-center justify-center border border-[#FEB2B2]">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#172126]">Delete Blog Article?</h3>
              <p className="text-xs text-[#718096] mt-1">
                Are you sure you want to delete <strong className="text-[#172126]">&quot;{deleteTarget.title}&quot;</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#E53E3E] flex items-center justify-center border border-[#FEB2B2]">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#172126]">
                Delete {selectedBlogIds.length} Selected Articles?
              </h3>
              <p className="text-xs text-[#718096] mt-1">
                Are you sure you want to remove all selected blog articles?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDeleteConfirm}
                className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Confirm Bulk Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}