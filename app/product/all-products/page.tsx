"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "../../component/layout/Layout";
import {
  Package,
  CheckCircle2,
  FileEdit,
  AlertCircle,
  Search,
  Filter,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Layers,
  FolderTree,
  X,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  Globe,
  Sliders,
  Sparkles,
} from "lucide-react";

// Types
export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  mainCategory: string;
  subcategory: string;
  shortDescription: string;
  fullDescription: string;
  applications: string[];
  status: "Published" | "Draft" | "Inactive";
  lastUpdated: string;
  displayOrder: number;
  tdsFile?: string;
  sdsFile?: string;
  seoTitle?: string;
  seoDescription?: string;
}

// Subcategory to Main Category mapping dictionary
const CATEGORY_MAP: Record<string, { main: string; subs: string[] }> = {
  "Rubber Accelerators": {
    main: "Rubber Accelerators",
    subs: ["Thiazoles", "Dithiocarbamates", "Thiurams", "Sulfenamides"],
  },
  "Antioxidants & Antiozonants": {
    main: "Antioxidants & Antiozonants",
    subs: ["Amine-based", "Phenolic-based", "Phosphites"],
  },
  "Vulcanizing Agents": {
    main: "Vulcanizing Agents",
    subs: ["Insoluble Sulfur", "Organic Peroxides"],
  },
  "Specialty Solvents": {
    main: "Specialty Solvents",
    subs: ["Aromatic Solvents", "Aliphatic Solvents"],
  },
  "Polymerization Inhibitors": {
    main: "Polymerization Inhibitors",
    subs: ["Hydroquinone Derivatives", "Nitroxides"],
  },
};

// Initial Mock Product Data
const initialProducts: ProductItem[] = [
  {
    id: "prod-1",
    name: "VULCURE MBT",
    slug: "vulcure-mbt",
    mainCategory: "Rubber Accelerators",
    subcategory: "Thiazoles",
    shortDescription: "Primary fast-curing accelerator for NR, SBR and NBR rubbers.",
    fullDescription: "VULCURE MBT (2-Mercaptobenzothiazole) is a versatile semi-ultra accelerator giving excellent physical properties and heat resistance in vulcanized rubber compounds.",
    applications: ["Tyres", "Conveyor Belts", "Footwear", "Latex Dipping"],
    status: "Published",
    lastUpdated: "01 Oct 2026",
    displayOrder: 1,
    tdsFile: "Vulcure_MBT_TDS.pdf",
    sdsFile: "Vulcure_MBT_SDS.pdf",
    seoTitle: "VULCURE MBT - Rubber Accelerator | Merchem India",
    seoDescription: "High-quality 2-Mercaptobenzothiazole rubber accelerator manufactured by Merchem India Pvt Ltd.",
  },
  {
    id: "prod-2",
    name: "VULCURE MBTS",
    slug: "vulcure-mbts",
    mainCategory: "Rubber Accelerators",
    subcategory: "Thiazoles",
    shortDescription: "Delayed action accelerator giving safe processing behavior.",
    fullDescription: "VULCURE MBTS (Dibenzothiazole Disulfide) provides flat curing cure curves with good scorch resistance in natural and synthetic rubbers.",
    applications: ["Automotive Hoses", "Industrial Mouldings", "Tyres"],
    status: "Published",
    lastUpdated: "30 Sep 2026",
    displayOrder: 2,
    tdsFile: "Vulcure_MBTS_TDS.pdf",
    sdsFile: "Vulcure_MBTS_SDS.pdf",
  },
  {
    id: "prod-3",
    name: "VULCURE ZMBT",
    slug: "vulcure-zmbt",
    mainCategory: "Rubber Accelerators",
    subcategory: "Thiazoles",
    shortDescription: "Zinc salt of MBT designed for latex foam and dipped goods.",
    fullDescription: "VULCURE ZMBT is recommended for latex processing as it imparts non-staining properties and fast cure rates in latex compounds.",
    applications: ["Latex Gloves", "Foam Mattresses", "Medical Dipped Goods"],
    status: "Draft",
    lastUpdated: "28 Sep 2026",
    displayOrder: 3,
  },
  {
    id: "prod-4",
    name: "VULCURE ZDC",
    slug: "vulcure-zdc",
    mainCategory: "Rubber Accelerators",
    subcategory: "Dithiocarbamates",
    shortDescription: "Ultra-accelerator for fast curing at low temperatures.",
    fullDescription: "VULCURE ZDC (Zinc Diethyldithiocarbamate) functions as a secondary ultra accelerator in combination with thiazoles or sulfenamides.",
    applications: ["Adhesives", "Latex Thread", "Proofed Fabrics"],
    status: "Published",
    lastUpdated: "25 Sep 2026",
    displayOrder: 4,
  },
  {
    id: "prod-5",
    name: "VULCURE ZDBC",
    slug: "vulcure-zdbc",
    mainCategory: "Rubber Accelerators",
    subcategory: "Dithiocarbamates",
    shortDescription: "Fast curing ultra-accelerator with superior solubility in EPDM.",
    fullDescription: "VULCURE ZDBC (Zinc Dibutyldithiocarbamate) offers high solubility in non-polar elastomers and eliminates blooming in EPDM profiles.",
    applications: ["Weatherstrips", "EPDM Seals", "Cable Insulation"],
    status: "Published",
    lastUpdated: "24 Sep 2026",
    displayOrder: 5,
  },
  {
    id: "prod-6",
    name: "VULCURE TMT",
    slug: "vulcure-tmt",
    mainCategory: "Rubber Accelerators",
    subcategory: "Thiurams",
    shortDescription: "Powerful ultra-accelerator and vulcanizing donor.",
    fullDescription: "VULCURE TMT (Tetramethylthiuram Disulfide) acts as a primary or secondary accelerator and sulfur donor for heat-resistant rubber goods.",
    applications: ["Heat Resistant Tubes", "Cable Compounds", "Bladders"],
    status: "Published",
    lastUpdated: "22 Sep 2026",
    displayOrder: 6,
  },
];

export default function AllProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Selection & Selection States
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Delete Dialog State
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    subcategory: "",
    mainCategory: "",
    shortDescription: "",
    fullDescription: "",
    applications: "",
    status: "Published" as "Published" | "Draft" | "Inactive",
    displayOrder: 1,
    seoTitle: "",
    seoDescription: "",
  });

  // Calculate Subcategory list based on selected Main Category in Filter bar
  const filterSubcategoryOptions = useMemo(() => {
    if (selectedMainCategory === "All") {
      return Object.values(CATEGORY_MAP).flatMap((c) => c.subs);
    }
    return CATEGORY_MAP[selectedMainCategory]?.subs || [];
  }, [selectedMainCategory]);

  // Derived filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search by Name or Slug
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase());

      // Main Category Filter
      const matchesMainCat =
        selectedMainCategory === "All" || item.mainCategory === selectedMainCategory;

      // Subcategory Filter
      const matchesSubCat =
        selectedSubcategory === "All" || item.subcategory === selectedSubcategory;

      // Status Filter
      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      return matchesSearch && matchesMainCat && matchesSubCat && matchesStatus;
    });
  }, [products, searchQuery, selectedMainCategory, selectedSubcategory, selectedStatus]);

  // Statistics Summary Counts
  const stats = useMemo(() => {
    const total = products.length;
    const published = products.filter((p) => p.status === "Published").length;
    const drafts = products.filter((p) => p.status === "Draft").length;
    const inactive = products.filter((p) => p.status === "Inactive").length;
    return { total, published, drafts, inactive };
  }, [products]);

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedMainCategory("All");
    setSelectedSubcategory("All");
    setSelectedStatus("All");
  };

  // Selection Checkbox Toggle
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Drawer for Create
  const handleOpenCreateDrawer = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      subcategory: "Thiazoles",
      mainCategory: "Rubber Accelerators",
      shortDescription: "",
      fullDescription: "",
      applications: "Tyres, Rubber Mouldings",
      status: "Published",
      displayOrder: products.length + 1,
      seoTitle: "",
      seoDescription: "",
    });
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEditDrawer = (product: ProductItem) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      subcategory: product.subcategory,
      mainCategory: product.mainCategory,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      applications: product.applications.join(", "),
      status: product.status,
      displayOrder: product.displayOrder,
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
    });
    setIsDrawerOpen(true);
  };

  // Subcategory Change Handler in Form (Auto-derives Main Category)
  const handleFormSubcategoryChange = (sub: string) => {
    let derivedMain = "";
    for (const key in CATEGORY_MAP) {
      if (CATEGORY_MAP[key].subs.includes(sub)) {
        derivedMain = CATEGORY_MAP[key].main;
        break;
      }
    }
    setFormData((prev) => ({
      ...prev,
      subcategory: sub,
      mainCategory: derivedMain,
    }));
  };

  // Name Change in Form (Auto-generates Slug if empty or matching)
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

  // Save Product Handler (Create / Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedApps = formData.applications
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    if (editingProduct) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
                subcategory: formData.subcategory,
                mainCategory: formData.mainCategory,
                shortDescription: formData.shortDescription,
                fullDescription: formData.fullDescription,
                applications: formattedApps,
                status: formData.status,
                displayOrder: Number(formData.displayOrder),
                lastUpdated: "Just now",
              }
            : p
        )
      );
    } else {
      // Create new
      const newProd: ProductItem = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        subcategory: formData.subcategory || "Thiazoles",
        mainCategory: formData.mainCategory || "Rubber Accelerators",
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        applications: formattedApps,
        status: formData.status,
        lastUpdated: "Just now",
        displayOrder: Number(formData.displayOrder),
      };
      setProducts((prev) => [newProd, ...prev]);
    }

    setIsDrawerOpen(false);
  };

  // Delete Single Product
  const handleDeleteConfirm = () => {
    if (deleteModalId) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteModalId));
      setSelectedProductIds((prev) => prev.filter((id) => id !== deleteModalId));
      setDeleteModalId(null);
    }
  };

  // Bulk Delete Confirm
  const handleBulkDeleteConfirm = () => {
    setProducts((prev) => prev.filter((p) => !selectedProductIds.includes(p.id)));
    setSelectedProductIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = (status: "Published" | "Draft" | "Inactive") => {
    setProducts((prev) =>
      prev.map((p) =>
        selectedProductIds.includes(p.id) ? { ...p, status, lastUpdated: "Just now" } : p
      )
    );
    setSelectedProductIds([]);
  };

  return (
    <DashboardLayout activeNavId="products">
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
              <span className="text-[#980e27] font-semibold">All Products</span>
            </div>

            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              All Products
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Manage Merchem&apos;s chemical product catalogue across all categories and subcategories.
            </p>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleOpenCreateDrawer}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] active:bg-[#600818] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs shadow-[#980e27]/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUMMARY CARDS                                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Products */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Products
              </span>
            </div>
          </div>

          {/* Published */}
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

          {/* Drafts */}
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

          {/* Inactive */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.inactive}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Inactive
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
                placeholder="Search by product name or slug..."
                className="w-full h-10 pl-10 pr-4 bg-[#F3F5F6] text-sm text-[#172126] placeholder-[#718096] rounded-lg border border-transparent outline-hidden focus:border-[#980e27] focus:bg-white focus:ring-2 focus:ring-[#980e27]/20 transition-all"
              />
            </div>

            {/* Filter Select Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Main Category Select */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Layers className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedMainCategory}
                  onChange={(e) => {
                    setSelectedMainCategory(e.target.value);
                    setSelectedSubcategory("All");
                  }}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Main Categories</option>
                  {Object.keys(CATEGORY_MAP).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Select */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <FolderTree className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Subcategories</option>
                  {filterSubcategoryOptions.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Select */}
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
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchQuery ||
                selectedMainCategory !== "All" ||
                selectedSubcategory !== "All" ||
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

          {/* Bulk Actions Bar (Shown when items are selected) */}
          {selectedProductIds.length > 0 && (
            <div className="p-3 bg-[#FFF5F7] border border-[#980e27]/20 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
              <span className="text-xs font-semibold text-[#980e27]">
                {selectedProductIds.length} product(s) selected
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkStatusUpdate("Published")}
                  className="px-2.5 py-1 bg-white hover:bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/30 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Publish Selected
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatusUpdate("Draft")}
                  className="px-2.5 py-1 bg-white hover:bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Draft Selected
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
        {/* 4. PRODUCTS DATA TABLE                                                    */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center mx-auto border border-[#980e27]/20">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172126]">
                  No chemical products found
                </h3>
                <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
                  No products matched your search or filter options. Try clearing filters or add a new product.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateDrawer}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#980e27] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer hover:bg-[#7A0B1F]"
              >
                <Plus className="w-4 h-4" />
                Add Product
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
                          selectedProductIds.length === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Main Category
                    </th>
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredProducts.map((item) => {
                    const isSelected = selectedProductIds.includes(item.id);
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

                        {/* Product Thumbnail & Name */}
                        <td className="py-4 px-5 text-sm font-medium text-[#172126]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/15 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-bold text-[#172126] block leading-snug">
                                {item.name}
                              </span>
                              <span className="text-xs font-mono text-[#718096] block">
                                /{item.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Main Category */}
                        <td className="py-4 px-5 text-sm text-[#475569]">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F5F6] text-xs font-medium text-[#172126]">
                            <Layers className="w-3 h-3 text-[#718096]" />
                            {item.mainCategory}
                          </span>
                        </td>

                        {/* Subcategory */}
                        <td className="py-4 px-5 text-sm text-[#475569]">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F5F6] text-xs font-medium text-[#475569]">
                            <FolderTree className="w-3 h-3 text-[#718096]" />
                            {item.subcategory}
                          </span>
                        </td>

                        {/* Last Updated */}
                        <td className="py-4 px-5 text-xs text-[#64748B]">
                          {item.lastUpdated}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-5 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.status === "Published"
                                ? "bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10"
                                : item.status === "Draft"
                                ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                                : "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Row Actions */}
                        <td className="py-4 px-5 text-sm text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDrawer(item)}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteModalId(item.id)}
                              className="p-1.5 text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF5F5] rounded-md transition-colors cursor-pointer"
                              title="Delete product"
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
                Showing 1 to {filteredProducts.length} of {products.length} products
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">|</span>
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
      {/* 5. ADD / EDIT PRODUCT SLIDE-OVER DRAWER                                   */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFA]">
                <div>
                  <h2 className="text-lg font-bold text-[#172126]">
                    {editingProduct ? "Edit Chemical Product" : "Add New Chemical Product"}
                  </h2>
                  <p className="text-xs text-[#718096] mt-0.5">
                    Assigned to subcategories with automatic main category derivation.
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
              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Product Name & Slug Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleFormNameChange(e.target.value)}
                      placeholder="e.g. VULCURE MBT"
                      className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20 transition-all"
                    />
                  </div>

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
                        placeholder="vulcure-mbt"
                        className="w-full h-10 pl-7 pr-3 bg-white text-sm font-mono text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Subcategory (Primary Selector) & Derived Main Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAFA] border border-[#E5E7EB]">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Subcategory *
                    </label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => handleFormSubcategoryChange(e.target.value)}
                      className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                    >
                      {Object.values(CATEGORY_MAP)
                        .flatMap((c) => c.subs)
                        .map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                    </select>
                    <p className="text-[11px] text-[#718096]">
                      Selecting subcategory auto-assigns main category.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Main Category (Auto-derived)
                    </label>
                    <div className="h-10 px-3.5 bg-white text-sm font-semibold text-[#980e27] rounded-lg border border-[#E5E7EB] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#980e27]" />
                      <span>{formData.mainCategory || "Rubber Accelerators"}</span>
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief summary of the chemical product..."
                    className="w-full p-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                </div>

                {/* Full Technical Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Full Description & Technical Specifications
                  </label>
                  <textarea
                    rows={4}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Detailed chemical properties, reaction curves, heat resistance specs..."
                    className="w-full p-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                </div>

                {/* Applications Tags */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Applications (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.applications}
                    onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
                    placeholder="Tyres, Conveyor Belts, Footwear, Latex Dipping"
                    className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                </div>

                {/* Technical Documents Upload (TDS / SDS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-dashed border-[#DDE3E0] hover:border-[#980e27] bg-[#F8FAFA] text-center space-y-2 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-[#980e27] mx-auto" />
                    <span className="text-xs font-semibold text-[#172126] block">
                      Upload TDS (PDF)
                    </span>
                    <span className="text-[10px] text-[#718096] block">
                      Technical Data Sheet
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-dashed border-[#DDE3E0] hover:border-[#980e27] bg-[#F8FAFA] text-center space-y-2 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-[#980e27] mx-auto" />
                    <span className="text-xs font-semibold text-[#172126] block">
                      Upload SDS (PDF)
                    </span>
                    <span className="text-[10px] text-[#718096] block">
                      Safety Data Sheet
                    </span>
                  </div>
                </div>

                {/* SEO Metadata Fields */}
                <div className="p-4 rounded-xl bg-[#F8FAFA] border border-[#E5E7EB] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#172126] uppercase tracking-wider">
                    <Globe className="w-4 h-4 text-[#980e27]" />
                    <span>SEO Settings</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#718096] uppercase">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="VULCURE MBT - Rubber Accelerator | Merchem India"
                      className="w-full h-9 px-3 bg-white text-xs text-[#172126] rounded-md border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-[#718096] uppercase">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      placeholder="Meta description for search engine results..."
                      className="w-full p-2.5 bg-white text-xs text-[#172126] rounded-md border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>
                </div>

                {/* Status & Display Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "Published" | "Draft" | "Inactive",
                        })
                      }
                      className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
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
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CONFIRM DELETE MODALS                                                  */}
      {/* ========================================================================= */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#E53E3E] flex items-center justify-center border border-[#FEB2B2]">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#172126]">Delete Product?</h3>
              <p className="text-xs text-[#718096] mt-1">
                Are you sure you want to delete this chemical product? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
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
                Delete {selectedProductIds.length} Selected Products?
              </h3>
              <p className="text-xs text-[#718096] mt-1">
                Are you sure you want to remove all selected chemical product records?
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