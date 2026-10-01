"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "../../component/layout/Layout";
import {
  FolderTree,
  Layers,
  Package,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ArrowUpRight,
  Sliders,
} from "lucide-react";

export interface SubcategoryItem {
  id: string;
  order: number;
  name: string;
  slug: string;
  mainCategoryId: string;
  mainCategoryName: string;
  description: string;
  productCount: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

const mainCategoryOptions = [
  { id: "cat-1", name: "Rubber Accelerators" },
  { id: "cat-2", name: "Antioxidants & Antiozonants" },
  { id: "cat-3", name: "Processing Aids" },
  { id: "cat-4", name: "Agrochemical Intermediates" },
  { id: "cat-5", name: "Specialty Solvents" },
  { id: "cat-6", name: "Polymerization Inhibitors" },
];

const initialSubcategories: SubcategoryItem[] = [
  {
    id: "sub-1",
    order: 1,
    name: "Thiazoles",
    slug: "thiazoles",
    mainCategoryId: "cat-1",
    mainCategoryName: "Rubber Accelerators",
    description: "Semi-ultra primary accelerators giving fast cure rates and heat resistance in NR, SBR and NBR.",
    productCount: 14,
    status: "Active",
    createdAt: "10 Feb 2026",
  },
  {
    id: "sub-2",
    order: 2,
    name: "Sulphenamides",
    slug: "sulphenamides",
    mainCategoryId: "cat-1",
    mainCategoryName: "Rubber Accelerators",
    description: "Delayed action accelerators providing high scorch safety and fast vulcanization rate.",
    productCount: 10,
    status: "Active",
    createdAt: "12 Feb 2026",
  },
  {
    id: "sub-3",
    order: 3,
    name: "Thiurams",
    slug: "thiurams",
    mainCategoryId: "cat-1",
    mainCategoryName: "Rubber Accelerators",
    description: "Ultra accelerators and sulfur donors for heat resistant rubber compounds.",
    productCount: 8,
    status: "Active",
    createdAt: "15 Feb 2026",
  },
  {
    id: "sub-4",
    order: 4,
    name: "Dithiocarbamates",
    slug: "dithiocarbamates",
    mainCategoryId: "cat-1",
    mainCategoryName: "Rubber Accelerators",
    description: "Ultra accelerators for fast low temperature vulcanization and latex dipping.",
    productCount: 12,
    status: "Active",
    createdAt: "18 Feb 2026",
  },
  {
    id: "sub-5",
    order: 5,
    name: "Special Purpose",
    slug: "special-purpose",
    mainCategoryId: "cat-1",
    mainCategoryName: "Rubber Accelerators",
    description: "Custom formulated specialty accelerator blends for specific industrial requirements.",
    productCount: 4,
    status: "Active",
    createdAt: "22 Feb 2026",
  },
  {
    id: "sub-6",
    order: 6,
    name: "Amine-based",
    slug: "amine-based",
    mainCategoryId: "cat-2",
    mainCategoryName: "Antioxidants & Antiozonants",
    description: "High efficiency amine degradation inhibitors for dynamic flex and ozone protection.",
    productCount: 9,
    status: "Active",
    createdAt: "01 Mar 2026",
  },
  {
    id: "sub-7",
    order: 7,
    name: "Phenolic-based",
    slug: "phenolic-based",
    mainCategoryId: "cat-2",
    mainCategoryName: "Antioxidants & Antiozonants",
    description: "Non-staining sterically hindered phenolic antioxidants for light-colored rubber products.",
    productCount: 7,
    status: "Active",
    createdAt: "05 Mar 2026",
  },
  {
    id: "sub-8",
    order: 8,
    name: "Insoluble Sulfur",
    slug: "insoluble-sulfur",
    mainCategoryId: "cat-3",
    mainCategoryName: "Vulcanizing Agents",
    description: "Polymeric non-blooming sulfur vulcanizing agent for radial tyres and belt compounds.",
    productCount: 6,
    status: "Active",
    createdAt: "10 Mar 2026",
  },
  {
    id: "sub-9",
    order: 9,
    name: "Hydroquinone Derivatives",
    slug: "hydroquinone-derivatives",
    mainCategoryId: "cat-6",
    mainCategoryName: "Polymerization Inhibitors",
    description: "Shortstopping agents for synthetic rubber polymerization reactors.",
    productCount: 0,
    status: "Inactive",
    createdAt: "20 Mar 2026",
  },
];

function SubcategoriesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>(initialSubcategories);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Selection Checkbox State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryItem | null>(null);

  // Delete & Prevention Modal State
  const [deleteTarget, setDeleteTarget] = useState<SubcategoryItem | null>(null);
  const [showBlockedModal, setShowBlockedModal] = useState<SubcategoryItem | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    mainCategoryId: "cat-1",
    description: "",
    status: "Active" as "Active" | "Inactive",
    order: 1,
  });

  // Pre-select main category filter if URL query param exists
  useEffect(() => {
    if (categoryParam) {
      const match = mainCategoryOptions.find(
        (c) => c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (match) {
        setSelectedMainCategory(match.name);
      }
    }
  }, [categoryParam]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = subcategories.length;
    const active = subcategories.filter((s) => s.status === "Active").length;
    const inactive = subcategories.filter((s) => s.status === "Inactive").length;
    const totalProducts = subcategories.reduce((sum, s) => sum + s.productCount, 0);
    return { total, active, inactive, totalProducts };
  }, [subcategories]);

  // Filtered Subcategories List
  const filteredSubcategories = useMemo(() => {
    return subcategories.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMainCat =
        selectedMainCategory === "All" || item.mainCategoryName === selectedMainCategory;

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      return matchesSearch && matchesMainCat && matchesStatus;
    });
  }, [subcategories, searchQuery, selectedMainCategory, selectedStatus]);

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedMainCategory("All");
    setSelectedStatus("All");
  };

  // Checkbox Selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredSubcategories.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle Active/Inactive Status Switch
  const handleToggleStatus = (id: string) => {
    setSubcategories((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
          : item
      )
    );
  };

  // Open Drawer for Create
  const handleOpenCreateDrawer = () => {
    setEditingSubcategory(null);
    setFormData({
      name: "",
      slug: "",
      mainCategoryId: mainCategoryOptions[0].id,
      description: "",
      status: "Active",
      order: subcategories.length + 1,
    });
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEditDrawer = (sub: SubcategoryItem) => {
    setEditingSubcategory(sub);
    setFormData({
      name: sub.name,
      slug: sub.slug,
      mainCategoryId: sub.mainCategoryId,
      description: sub.description,
      status: sub.status,
      order: sub.order,
    });
    setIsDrawerOpen(true);
  };

  // Form Name Change (Auto Slug)
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

  // Save Subcategory Form Handler
  const handleSaveSubcategory = (e: React.FormEvent) => {
    e.preventDefault();

    const parentCategoryObj =
      mainCategoryOptions.find((c) => c.id === formData.mainCategoryId) ||
      mainCategoryOptions[0];

    if (editingSubcategory) {
      // Update
      setSubcategories((prev) =>
        prev.map((item) =>
          item.id === editingSubcategory.id
            ? {
                ...item,
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
                mainCategoryId: parentCategoryObj.id,
                mainCategoryName: parentCategoryObj.name,
                description: formData.description,
                status: formData.status,
                order: Number(formData.order),
              }
            : item
        )
      );
    } else {
      // Create
      const newSub: SubcategoryItem = {
        id: `sub-${Date.now()}`,
        order: Number(formData.order),
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        mainCategoryId: parentCategoryObj.id,
        mainCategoryName: parentCategoryObj.name,
        description: formData.description,
        productCount: 0,
        status: formData.status,
        createdAt: "Just now",
      };
      setSubcategories((prev) => [...prev, newSub]);
    }

    setIsDrawerOpen(false);
  };

  // Attempt Delete (Check product count)
  const handleAttemptDelete = (sub: SubcategoryItem) => {
    if (sub.productCount > 0) {
      setShowBlockedModal(sub);
    } else {
      setDeleteTarget(sub);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setSubcategories((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardLayout activeNavId="subcategories">
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
              <span className="text-[#980e27] font-semibold">Subcategories</span>
            </div>

            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              Subcategories
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Manage chemical subcategories and organize products under their respective main categories.
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleOpenCreateDrawer}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] active:bg-[#600818] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs shadow-[#980e27]/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Subcategory
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUMMARY CARDS                                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Subcategories */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Subcategories
              </span>
            </div>
          </div>

          {/* Active Subcategories */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/10">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.active}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Active Subcategories
              </span>
            </div>
          </div>

          {/* Inactive Subcategories */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.inactive}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Inactive Subcategories
              </span>
            </div>
          </div>

          {/* Total Assigned Products */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.totalProducts}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Assigned Products
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
                placeholder="Search subcategory name or slug..."
                className="w-full h-10 pl-10 pr-4 bg-[#F3F5F6] text-sm text-[#172126] placeholder-[#718096] rounded-lg border border-transparent outline-hidden focus:border-[#980e27] focus:bg-white focus:ring-2 focus:ring-[#980e27]/20 transition-all"
              />
            </div>

            {/* Filter Select Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Main Category Filter Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Layers className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedMainCategory}
                  onChange={(e) => setSelectedMainCategory(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Main Categories</option>
                  {mainCategoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Filter className="w-3.5 h-3.5 text-[#718096]" />
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

              {/* Clear Filters Button */}
              {(searchQuery ||
                selectedMainCategory !== "All" ||
                selectedStatus !== "All") && (
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
        {/* 4. SUBCATEGORIES DATA TABLE                                               */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          {filteredSubcategories.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center mx-auto border border-[#980e27]/20">
                <FolderTree className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172126]">
                  No subcategories found
                </h3>
                <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
                  No subcategories matched your criteria. Try adjusting your search query or clear filters.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateDrawer}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#980e27] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer hover:bg-[#7A0B1F]"
              >
                <Plus className="w-4 h-4" />
                Add Subcategory
              </button>
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
                          selectedIds.length === filteredSubcategories.length &&
                          filteredSubcategories.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                      />
                    </th>

                    {/* Subcategory Name */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Subcategory Name
                    </th>

                    {/* Main Category */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Main Category
                    </th>

                    {/* Slug */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Slug
                    </th>

                    {/* Description */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Description
                    </th>

                    {/* Products Count */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-center">
                      Products Count
                    </th>

                    {/* Status */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-center">
                      Status
                    </th>

                    {/* Sort Order */}
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#718096] uppercase tracking-wider text-center">
                      Order
                    </th>

                    {/* Actions */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredSubcategories.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
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

                        {/* Subcategory Name */}
                        <td className="py-4 px-5 text-sm font-bold text-[#172126]">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/15 flex items-center justify-center shrink-0">
                              <FolderTree className="w-4 h-4" />
                            </div>
                            <span>{item.name}</span>
                          </div>
                        </td>

                        {/* Main Category Badge */}
                        <td className="py-4 px-5 text-sm text-[#475569]">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F5F6] text-xs font-semibold text-[#172126]">
                            <Layers className="w-3.5 h-3.5 text-[#718096]" />
                            {item.mainCategoryName}
                          </span>
                        </td>

                        {/* Slug */}
                        <td className="py-4 px-5 text-xs font-mono text-[#718096]">
                          /{item.slug}
                        </td>

                        {/* Description */}
                        <td className="py-4 px-5 text-sm text-[#475569] max-w-xs truncate">
                          {item.description}
                        </td>

                        {/* Clickable Products Count Badge */}
                        <td className="py-4 px-5 text-center">
                          <Link
                            href={`/product/all-products?subcategory=${encodeURIComponent(
                              item.name
                            )}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5F7] hover:bg-[#980e27] text-[#980e27] hover:text-white border border-[#980e27]/20 text-xs font-semibold transition-all cursor-pointer"
                            title="Click to view all assigned products"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>{item.productCount} products</span>
                          </Link>
                        </td>

                        {/* Status Switch Toggle */}
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

                        {/* Sort Order */}
                        <td className="py-4 px-4 text-xs font-semibold text-[#718096] text-center font-mono">
                          {item.order}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-sm text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDrawer(item)}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors cursor-pointer"
                              title="Edit subcategory"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAttemptDelete(item)}
                              className="p-1.5 text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF5F5] rounded-md transition-colors cursor-pointer"
                              title="Delete subcategory"
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
              Showing 1 to {filteredSubcategories.length} of {subcategories.length} subcategories
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
      {/* 5. ADD / EDIT SUBCATEGORY SLIDE-OVER DRAWER                               */}
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
                    {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
                  </h2>
                  <p className="text-xs text-[#718096] mt-0.5">
                    Assign subcategory to its parent main category ID.
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
              <form onSubmit={handleSaveSubcategory} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Parent Main Category Dropdown (Required) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Parent Main Category *
                  </label>
                  <select
                    required
                    value={formData.mainCategoryId}
                    onChange={(e) => setFormData({ ...formData, mainCategoryId: e.target.value })}
                    className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                  >
                    {mainCategoryOptions.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Subcategory Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleFormNameChange(e.target.value)}
                    placeholder="e.g. Thiazoles"
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
                      placeholder="thiazoles"
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
                    placeholder="Brief summary of products in this subcategory..."
                    className="w-full p-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                </div>

                {/* Subcategory Image Upload */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Subcategory Image (Optional)
                  </label>
                  <div className="p-4 rounded-xl border border-dashed border-[#DDE3E0] hover:border-[#980e27] bg-[#F8FAFA] text-center space-y-2 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-[#980e27] mx-auto" />
                    <span className="text-xs font-semibold text-[#172126] block">
                      Upload Subcategory Image
                    </span>
                    <span className="text-[10px] text-[#718096] block">
                      PNG, JPG up to 2MB
                    </span>
                  </div>
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
                    className="px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFA] text-sm font-semibold text-[#475569] rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {editingSubcategory ? "Save Subcategory" : "Create Subcategory"}
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
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center border border-[#FDE68A]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#172126]">
                Cannot Delete Subcategory
              </h3>
              <p className="text-xs text-[#718096] mt-1.5 leading-relaxed">
                The subcategory <strong className="text-[#172126]">&quot;{showBlockedModal.name}&quot;</strong> has{" "}
                <strong className="text-[#980e27]">{showBlockedModal.productCount} assigned products</strong>. Please reassign or delete assigned products before deleting this subcategory.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href={`/product/all-products?subcategory=${encodeURIComponent(
                  showBlockedModal.name
                )}`}
                className="px-4 py-2 bg-[#980e27] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#7A0B1F]"
              >
                Manage Assigned Products
              </Link>
              <button
                type="button"
                onClick={() => setShowBlockedModal(null)}
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
                Delete Subcategory?
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

export default function SubcategoriesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#718096]">Loading subcategories...</div>}>
      <SubcategoriesContent />
    </Suspense>
  );
}