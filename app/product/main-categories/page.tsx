"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "../../component/layout/Layout";
import {
  getProductCategoriesApi,
  createProductCategoryApi,
  updateProductCategoryApi,
  deleteProductCategoryApi,
} from "../../utils/product";
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  Search,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

export interface MainCategoryItem {
  id: string | number;
  order: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  subcategoryCount: number;
  status: "Active" | "Inactive";
  createdAt: string;
  image?: string | null;
}

const initialCategories: MainCategoryItem[] = [
  {
    id: "cat-1",
    order: 1,
    name: "Accelerators",
    slug: "accelerators",
    description: "Primary and secondary accelerators for rubber vulcanization including thiazoles and dithiocarbamates.",
    subcategoryCount: 12,
    status: "Active",
    createdAt: "15 Jan 2026",
  },
  {
    id: "cat-2",
    order: 2,
    name: "Antioxidants & Antiozonants",
    slug: "antioxidants-antiozonants",
    description: "Amine and phenolic degradation inhibitors protecting rubber products from heat, oxygen and ozone aging.",
    subcategoryCount: 8,
    status: "Active",
    createdAt: "20 Jan 2026",
  },
  {
    id: "cat-3",
    order: 3,
    name: "Processing Aids",
    slug: "processing-aids",
    description: "Internal and external lubricants, peptizers and viscosity modifiers for rubber compounding.",
    subcategoryCount: 5,
    status: "Active",
    createdAt: "02 Feb 2026",
  },
  {
    id: "cat-4",
    order: 4,
    name: "Agrochemical Intermediates",
    slug: "agrochemical-intermediates",
    description: "High-purity chemical intermediates and synthesis building blocks for crop protection formulations.",
    subcategoryCount: 4,
    status: "Active",
    createdAt: "12 Feb 2026",
  },
  {
    id: "cat-5",
    order: 5,
    name: "Specialty Solvents",
    slug: "specialty-solvents",
    description: "Aromatic and aliphatic reaction solvents for chemical extraction and industrial cleaning.",
    subcategoryCount: 6,
    status: "Active",
    createdAt: "01 Mar 2026",
  },
  {
    id: "cat-6",
    order: 6,
    name: "Polymerization Inhibitors",
    slug: "polymerization-inhibitors",
    description: "Monomer stabilizers and shortstopping agents preventing premature polymerization during storage.",
    subcategoryCount: 0,
    status: "Inactive",
    createdAt: "15 Mar 2026",
  },
];

export default function MainCategoriesPage() {
  const [categories, setCategories] = useState<MainCategoryItem[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"order" | "name" | "subcount">("order");

  // Selection States
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<(string | number)[]>([]);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MainCategoryItem | null>(null);

  // Delete & Prevention Modal State
  const [deleteTarget, setDeleteTarget] = useState<MainCategoryItem | null>(null);
  const [showBlockedDeleteModal, setShowBlockedDeleteModal] = useState<MainCategoryItem | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
    order: 1,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch categories from backend API GET /v1/product-categories
  const fetchCategories = async () => {
    setIsLoading(true);
    setApiError("");
    try {
      const res = await getProductCategoriesApi();
      const rawData = res.data || res;
      if (Array.isArray(rawData)) {
        const mapped: MainCategoryItem[] = rawData.map((item: any, idx: number) => ({
          id: item.id,
          order: item.sort_order || idx + 1,
          name: item.name,
          slug: item.slug,
          shortDescription: item.short_description || "",
          description: item.description || item.short_description || "",
          subcategoryCount: item.subcategories_count || 0,
          status:
            item.status === "active" || item.status === "Active"
              ? "Active"
              : "Inactive",
          createdAt: item.created_at
            ? new Date(item.created_at).toLocaleDateString()
            : "—",
          image: item.image || null,
        }));
        setCategories(mapped);
      }
    } catch (err: any) {
      console.error("Fetch product categories error:", err);
      // Fallback stays on initial mock data if API call is unfulfilled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Calculate Statistics
  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.status === "Active").length;
    const inactive = categories.filter((c) => c.status === "Inactive").length;
    const totalSubs = categories.reduce((sum, c) => sum + c.subcategoryCount, 0);
    return { total, active, inactive, totalSubs };
  }, [categories]);

  // Derived Filtered and Sorted list
  const filteredCategories = useMemo(() => {
    let result = categories.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "subcount") {
        return b.subcategoryCount - a.subcategoryCount;
      }
      return a.order - b.order;
    });

    return result;
  }, [categories, searchQuery, selectedStatus, sortBy]);

  // Filter Reset
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSortBy("order");
  };

  // Selection Toggle
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategoryIds(filteredCategories.map((c) => c.id));
    } else {
      setSelectedCategoryIds([]);
    }
  };

  const handleSelectRow = (id: string | number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle Status Switch directly from table
  const handleToggleStatus = async (id: string | number) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;

    const newStatus = target.status === "Active" ? "Inactive" : "Active";
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const fd = new FormData();
      fd.append("name", target.name);
      fd.append("status", newStatus.toLowerCase());
      await updateProductCategoryApi(id, fd);
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  // Drawer Open for Create
  const handleOpenCreateDrawer = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      status: "Active",
      order: categories.length + 1,
    });
    setImageFile(null);
    setIsDrawerOpen(true);
  };

  // Drawer Open for Edit
  const handleOpenEditDrawer = (category: MainCategoryItem) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      shortDescription: category.shortDescription || "",
      description: category.description,
      status: category.status,
      order: category.order,
    });
    setImageFile(null);
    setIsDrawerOpen(true);
  };

  // Form Name Change (Auto-generates Slug)
  const handleFormNameChange = (name: string) => {
    const slugified = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugified,
    }));
  };

  // Form Save Handler (Calls POST /v1/product-categories or POST /v1/product-categories/{id})
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("slug", formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"));
      payload.append("short_description", formData.shortDescription || "");
      payload.append("description", formData.description || "");
      payload.append("status", formData.status.toLowerCase());
      payload.append("sort_order", String(formData.order));
      if (imageFile) {
        payload.append("image", imageFile);
      }

      if (editingCategory) {
        // Edit category API
        await updateProductCategoryApi(editingCategory.id, payload);
      } else {
        // Create category API
        await createProductCategoryApi(payload);
      }

      await fetchCategories();
      setIsDrawerOpen(false);
    } catch (err: any) {
      console.error("Save category error:", err);
      // Fallback local update if API returns error
      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? {
                  ...c,
                  name: formData.name,
                  slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
                  shortDescription: formData.shortDescription,
                  description: formData.description,
                  status: formData.status,
                  order: Number(formData.order),
                }
              : c
          )
        );
      } else {
        const newCat: MainCategoryItem = {
          id: `cat-${Date.now()}`,
          order: Number(formData.order),
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
          shortDescription: formData.shortDescription,
          description: formData.description,
          subcategoryCount: 0,
          status: formData.status,
          createdAt: "Just now",
        };
        setCategories((prev) => [...prev, newCat]);
      }
      setIsDrawerOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Attempt Delete Handler (Triggers prevention if subcategories exist)
  const handleAttemptDelete = (category: MainCategoryItem) => {
    if (category.subcategoryCount > 0) {
      setShowBlockedDeleteModal(category);
    } else {
      setDeleteTarget(category);
    }
  };

  // Delete Confirm Handler (Calls DELETE /v1/product-categories/{id})
  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteProductCategoryApi(deleteTarget.id);
        await fetchCategories();
      } catch (err) {
        console.error("Delete category error:", err);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      } finally {
        setSelectedCategoryIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    }
  };

  return (
    <DashboardLayout activeNavId="main-categories">
      <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
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
              <span>Product Management</span>
              <span>/</span>
              <span className="text-[#980e27] font-semibold">Main Categories</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              Main Categories
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Organize and manage the main categories of Merchem&apos;s chemical product catalogue.
            </p>
          </div>

          {/* Add Category Button aligned right of heading */}
          <button
            type="button"
            onClick={handleOpenCreateDrawer}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] active:bg-[#600818] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs shadow-[#980e27]/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUMMARY CARDS                                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Categories */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Categories
              </span>
            </div>
          </div>

          {/* Active Categories */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/10">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.active}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Active Categories
              </span>
            </div>
          </div>

          {/* Inactive Categories */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.inactive}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Inactive Categories
              </span>
            </div>
          </div>

          {/* Total Subcategories */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.totalSubs}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Subcategories
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SEARCH AND FILTERS TOOLBAR                                            */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories by name or slug..."
                className="w-full h-10 pl-10 pr-4 bg-[#F3F5F6] text-sm text-[#172126] placeholder-[#718096] rounded-lg border border-transparent outline-hidden focus:border-[#980e27] focus:bg-white focus:ring-2 focus:ring-[#980e27]/20 transition-all"
              />
            </div>

            {/* Filter and Sort controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <span className="text-xs font-semibold text-[#718096]">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="order">Sort by Order</option>
                  <option value="name">Sort by Name</option>
                  <option value="subcount">Sort by Subcategories</option>
                </select>
              </div>

              {/* Reset Filter Button */}
              {(searchQuery || selectedStatus !== "All" || sortBy !== "order") && (
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
        </div>

        {/* ========================================================================= */}
        {/* 4. MAIN CATEGORIES TABLE                                                  */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          {filteredCategories.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center mx-auto border border-[#980e27]/20">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172126]">
                  No main categories found
                </h3>
                <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
                  No main categories matched your criteria. Create a new category or clear filters.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateDrawer}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#980e27] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer hover:bg-[#7A0B1F]"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFA] border-b border-[#E5E7EB]">
                    {/* Checkbox */}
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedCategoryIds.length === filteredCategories.length &&
                          filteredCategories.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                      />
                    </th>

                    {/* Order # */}
                    <th className="py-3.5 px-3 w-12 text-xs font-semibold text-[#718096] uppercase tracking-wider text-center">
                      #
                    </th>

                    {/* Image / Icon */}
                    <th className="py-3.5 px-4 w-14 text-xs font-semibold text-[#718096] uppercase tracking-wider text-center">
                      Image
                    </th>

                    {/* Category Name */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Category Name
                    </th>

                    {/* Slug */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Slug
                    </th>

                    {/* Description */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Description
                    </th>

                    {/* Subcategories Count */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-center">
                      Subcategories
                    </th>

                    {/* Status */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-center">
                      Status
                    </th>

                    {/* Actions */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredCategories.map((item) => {
                    const isSelected = selectedCategoryIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isSelected ? "bg-[#FFF5F7]/40" : "hover:bg-[#F8FAFA]/80"
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(item.id)}
                            className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                          />
                        </td>

                        {/* Order # */}
                        <td className="py-4 px-3 text-xs font-semibold text-[#718096] text-center font-mono">
                          {item.order}
                        </td>

                        {/* Thumbnail Image */}
                        <td className="py-4 px-4 text-center">
                          <div className="w-10 h-10 rounded-lg bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/15 flex items-center justify-center mx-auto shrink-0 shadow-2xs">
                            <Layers className="w-5 h-5" />
                          </div>
                        </td>

                        {/* Category Name */}
                        <td className="py-4 px-5 text-sm font-bold text-[#172126]">
                          {item.name}
                        </td>

                        {/* Slug */}
                        <td className="py-4 px-5 text-xs font-mono text-[#718096]">
                          /{item.slug}
                        </td>

                        {/* Description */}
                        <td className="py-4 px-5 text-sm text-[#475569] max-w-xs truncate">
                          {item.description}
                        </td>

                        {/* Clickable Subcategories Badge */}
                        <td className="py-4 px-5 text-center">
                          <Link
                            href={`/product/sub-categories?category=${encodeURIComponent(
                              item.name
                            )}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5F7] hover:bg-[#980e27] text-[#980e27] hover:text-white border border-[#980e27]/20 text-xs font-semibold transition-all cursor-pointer"
                            title="Click to manage subcategories"
                          >
                            <FolderTree className="w-3.5 h-3.5" />
                            <span>{item.subcategoryCount} subs</span>
                          </Link>
                        </td>

                        {/* Active/Inactive Toggle Switch */}
                        <td className="py-4 px-5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              item.status === "Active"
                                ? "bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/20"
                                : "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === "Active" ? "bg-[#087F5B]" : "bg-[#6B7280]"
                              }`}
                            />
                            {item.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-sm text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDrawer(item)}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors cursor-pointer"
                              title="Edit main category"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAttemptDelete(item)}
                              className="p-1.5 text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF5F5] rounded-md transition-colors cursor-pointer"
                              title="Delete main category"
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
            <span>
              Showing 1 to {filteredCategories.length} of {categories.length} main categories
            </span>

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
      {/* 5. ADD / EDIT CATEGORY SLIDE-OVER DRAWER                                  */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFA]">
                <div>
                  <h2 className="text-lg font-bold text-[#172126]">
                    {editingCategory ? "Edit Main Category" : "Add New Main Category"}
                  </h2>
                  <p className="text-xs text-[#718096] mt-0.5">
                    Top-level product category grouping for chemical products.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-[#718096] hover:text-[#172126] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Category Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleFormNameChange(e.target.value)}
                    placeholder="e.g. Rubber Accelerators"
                    className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20 transition-all"
                  />
                </div>

                {/* URL Slug */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    URL Slug *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-[#94A3B8] font-mono">/</span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="rubber-accelerators"
                      className="w-full h-10 pl-7 pr-3 bg-white text-sm font-mono text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of product types in this main category..."
                    className="w-full p-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                </div>

                {/* Category Image Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Category Thumbnail Image
                  </label>
                  <label className="relative p-5 rounded-xl border border-dashed border-[#DDE3E0] hover:border-[#980e27] bg-[#F8FAFA] text-center space-y-2 cursor-pointer transition-colors block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-[#980e27] mx-auto" />
                    <span className="text-xs font-semibold text-[#172126] block">
                      {imageFile ? imageFile.name : "Upload Category Banner / Icon"}
                    </span>
                    <span className="text-[10px] text-[#718096] block">
                      PNG, JPG or SVG up to 2MB
                    </span>
                  </label>
                </div>

                {/* Status & Display Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "Active" | "Inactive",
                        })
                      }
                      className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>
                </div>

                {/* Drawer Footer Actions */}
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    disabled={isSaving}
                    className="px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFA] text-sm font-semibold text-[#475569] rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-75"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : editingCategory ? (
                      "Save Category"
                    ) : (
                      "Create Category"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. UNSAFE DELETE PREVENTION MODAL                                         */}
      {/* ========================================================================= */}
      {showBlockedDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center border border-[#FDE68A]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#172126]">
                Cannot Delete Category
              </h3>
              <p className="text-xs text-[#718096] mt-1.5 leading-relaxed">
                The main category <strong className="text-[#172126]">&quot;{showBlockedDeleteModal.name}&quot;</strong> contains{" "}
                <strong className="text-[#980e27]">{showBlockedDeleteModal.subcategoryCount} active subcategories</strong>. Unsafe deletion is blocked. Please reassign or remove all child subcategories before deleting this main category.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href={`/product/sub-categories?category=${encodeURIComponent(
                  showBlockedDeleteModal.name
                )}`}
                className="px-4 py-2 bg-[#980e27] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#7A0B1F]"
              >
                Manage Subcategories
              </Link>
              <button
                type="button"
                onClick={() => setShowBlockedDeleteModal(null)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safe Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#E53E3E] flex items-center justify-center border border-[#FEB2B2]">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#172126]">
                Delete Main Category?
              </h3>
              <p className="text-xs text-[#718096] mt-1">
                Are you sure you want to delete <strong className="text-[#172126]">&quot;{deleteTarget.name}&quot;</strong>? This action cannot be undone.
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
    </DashboardLayout>
  );
}