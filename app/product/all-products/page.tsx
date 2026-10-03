"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "../../component/layout/Layout";
import BreadCrumbs from "../../component/common/BreadCrumbs";
import { toast } from "../../component/common/Toast";
import ProductView from "../components/ProductView";
import {
  getProductCategoriesApi,
  getProductSubcategoriesApi,
  getProductsApi,
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  uploadProductTdsApi,
  deleteProductTdsApi,
} from "../../utils/product";
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
  Sliders,
  Sparkles,
  Loader2,
  FileUp,
  Eye,
} from "lucide-react";

// Types
export interface ProductItem {
  id: string | number;
  name: string;
  slug: string;
  mainCategory: string;
  mainCategoryId?: string | number;
  subcategory: string;
  subcategoryId?: string | number;
  shortDescription: string;
  fullDescription: string;
  applications: string;
  status: "active" | "inactive";
  lastUpdated: string;
  displayOrder: number;
  image?: string | null;
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
const initialProducts: ProductItem[] = [];

export default function AllProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [mainCategoriesList, setMainCategoriesList] = useState<any[]>([]);
  const [subcategoriesList, setSubcategoriesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Published and Inactive total counts state
  const [publishedCount, setPublishedCount] = useState<number | null>(null);
  const [inactiveCount, setInactiveCount] = useState<number | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    perPage: 10,
    currentPage: 1,
    lastPage: 1,
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Selection States
  const [selectedProductIds, setSelectedProductIds] = useState<(string | number)[]>([]);

  // Drawer / Form State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Single Product View Modal State
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoadingViewDetails, setIsLoadingViewDetails] = useState(false);

  // Delete Dialog State
  const [deleteModalId, setDeleteModalId] = useState<string | number | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Form Fields State (Matching exact backend fields)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    mainCategoryId: "" as string | number,
    mainCategory: "",
    subcategoryId: "" as string | number,
    subcategory: "",
    shortDescription: "",
    fullDescription: "",
    applications: "",
    status: "active" as "active" | "inactive",
    displayOrder: 1,
    seoTitle: "",
    seoDescription: "",
  });

  // File states for drawer upload
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

  // Fetch Main Categories for dropdown select
  const fetchMainCategoriesList = async () => {
    try {
      const res = await getProductCategoriesApi();
      const raw = res.data || res;
      if (Array.isArray(raw)) {
        setMainCategoriesList(raw.map((c: any) => ({ id: c.id, name: c.name })));
      }
    } catch (err) {
      console.error("Fetch main categories list error:", err);
    }
  };

  // Fetch Subcategories for dropdown select
  const fetchSubcategoriesList = async () => {
    try {
      const res = await getProductSubcategoriesApi();
      const raw = res.data || res;
      if (Array.isArray(raw)) {
        const mapped = raw.map((s: any) => ({
          id: s.id,
          name: s.name,
          mainCategoryId: s.product_category_id || (s.category ? s.category.id : ""),
          mainCategoryName: s.category ? s.category.name : "Main Category",
        }));
        setSubcategoriesList(mapped);
      }
    } catch (err) {
      console.error("Fetch subcategories list error:", err);
    }
  };

  // Fetch Products from API GET /v1/products with pagination and status counts
  const fetchProducts = async (page = currentPage, limit = perPage) => {
    setIsLoading(true);
    try {
      const [res, activeRes, inactiveRes] = await Promise.all([
        getProductsApi({ page, per_page: limit }),
        getProductsApi({ status: "active", per_page: 1 }).catch(() => null),
        getProductsApi({ status: "inactive", per_page: 1 }).catch(() => null),
      ]);

      const rawData = res.data || res;
      if (Array.isArray(rawData)) {
        const mapped: ProductItem[] = rawData.map((item: any, idx: number) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          mainCategoryId:
            item.product_category_id ||
            item.category_id ||
            (item.category ? item.category.id : item.subcategory?.category ? item.subcategory.category.id : ""),
          mainCategory:
            item.category ? item.category.name : item.subcategory?.category ? item.subcategory.category.name : "—",
          subcategoryId:
            item.product_subcategory_id || item.subcategory_id || (item.subcategory ? item.subcategory.id : ""),
          subcategory: item.subcategory ? item.subcategory.name : "—",
          shortDescription: item.short_description || "",
          fullDescription: item.description || item.short_description || "",
          applications: item.applications
            ? Array.isArray(item.applications)
              ? item.applications.join(", ")
              : String(item.applications)
            : "",
          status: item.status === "inactive" || item.status === "Inactive" ? "inactive" : "active",
          lastUpdated: item.updated_at
            ? new Date(item.updated_at).toLocaleDateString()
            : "—",
          displayOrder: item.sort_order || idx + 1,
          image: item.image_url
            ? item.image_url
            : item.image
            ? item.image.startsWith("http")
              ? item.image
              : `http://127.0.0.1:8000/storage/${item.image}`
            : null,
          seoTitle: item.seo_title || "",
          seoDescription: item.seo_description || "",
        }));
        setProducts(mapped);
      }

      if (res.pagination) {
        setPaginationInfo({
          total: Number(res.pagination.total || 0),
          perPage: Number(res.pagination.per_page || limit),
          currentPage: Number(res.pagination.current_page || page),
          lastPage: Number(res.pagination.last_page || 1),
        });
      } else {
        const totalItems = Array.isArray(rawData) ? rawData.length : 0;
        setPaginationInfo({
          total: totalItems,
          perPage: limit,
          currentPage: page,
          lastPage: Math.ceil(totalItems / limit) || 1,
        });
      }

      if (activeRes?.pagination?.total !== undefined) {
        setPublishedCount(Number(activeRes.pagination.total));
      } else if (Array.isArray(activeRes?.data)) {
        setPublishedCount(activeRes.data.length);
      }

      if (inactiveRes?.pagination?.total !== undefined) {
        setInactiveCount(Number(inactiveRes.pagination.total));
      } else if (Array.isArray(inactiveRes?.data)) {
        setInactiveCount(inactiveRes.data.length);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMainCategoriesList();
    fetchSubcategoriesList();
    fetchProducts(1, perPage);
  }, []);

  // Calculate Subcategory list based on selected Main Category in Filter bar
  const filterSubcategoryOptions = useMemo(() => {
    let list: string[] = [];
    if (selectedMainCategory === "All") {
      list = subcategoriesList.map((s) => s.name);
    } else {
      list = subcategoriesList
        .filter((s) => s.mainCategoryName === selectedMainCategory)
        .map((s) => s.name);
    }
    return Array.from(new Set(list));
  }, [selectedMainCategory, subcategoriesList]);

  // Main Categories list for Toolbar filter
  const filterMainCategoryOptions = useMemo(() => {
    const set = new Set<string>();
    subcategoriesList.forEach((s) => {
      if (s.mainCategoryName) set.add(s.mainCategoryName);
    });
    return Array.from(set);
  }, [subcategoriesList]);

  // Derived filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMainCat =
        selectedMainCategory === "All" || item.mainCategory === selectedMainCategory;

      const matchesSubCat =
        selectedSubcategory === "All" || item.subcategory === selectedSubcategory;

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      return matchesSearch && matchesMainCat && matchesSubCat && matchesStatus;
    });
  }, [products, searchQuery, selectedMainCategory, selectedSubcategory, selectedStatus]);

  // Statistics Summary Counts
  const stats = useMemo(() => {
    const total = paginationInfo.total > 0 ? paginationInfo.total : products.length;
    const published = publishedCount !== null ? publishedCount : products.filter((p) => p.status === "active").length;
    const inactive = inactiveCount !== null ? inactiveCount : products.filter((p) => p.status === "inactive").length;
    return { total, published, drafts: 0, inactive };
  }, [products, paginationInfo.total, publishedCount, inactiveCount]);

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

  const handleSelectRow = (id: string | number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Single View Modal using ProductView component
  const handleOpenViewDrawer = (item: ProductItem) => {
    setViewingProduct(item);
    setIsViewModalOpen(true);
  };

  // Open Drawer for Create
  const handleOpenCreateDrawer = () => {
    setEditingProduct(null);
    const defaultMainObj = mainCategoriesList.length > 0 ? mainCategoriesList[0] : null;
    const nextOrder = (paginationInfo.total > 0 ? paginationInfo.total : products.length) + 1;

    setFormData({
      name: "",
      slug: "",
      mainCategoryId: defaultMainObj ? defaultMainObj.id : "",
      mainCategory: defaultMainObj ? defaultMainObj.name : "",
      subcategoryId: "",
      subcategory: "—",
      shortDescription: "",
      fullDescription: "",
      applications: "",
      status: "active",
      displayOrder: nextOrder,
      seoTitle: "",
      seoDescription: "",
    });
    setProductImageFile(null);
    setIsDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEditDrawer = (product: ProductItem) => {
    setEditingProduct(product);
    const matchedCategory = mainCategoriesList.find(
      (c) => String(c.id) === String(product.mainCategoryId) || c.name === product.mainCategory
    );
    const mainCatId = product.mainCategoryId || (matchedCategory ? matchedCategory.id : (mainCategoriesList[0]?.id || ""));
    const mainCatName = product.mainCategory || (matchedCategory ? matchedCategory.name : (mainCategoriesList[0]?.name || ""));

    setFormData({
      name: product.name,
      slug: product.slug,
      mainCategoryId: mainCatId,
      mainCategory: mainCatName,
      subcategoryId: product.subcategoryId || "",
      subcategory: product.subcategory || "—",
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      applications: product.applications || "",
      status: product.status === "inactive" ? "inactive" : "active",
      displayOrder: product.displayOrder,
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
    });
    setProductImageFile(null);
    setIsDrawerOpen(true);
  };

  // Subcategory Change Handler in Form
  const handleFormSubcategoryChange = (subIdVal: string | number) => {
    if (!subIdVal) {
      setFormData((prev) => ({
        ...prev,
        subcategoryId: "",
        subcategory: "—",
      }));
      return;
    }
    const subObj = subcategoriesList.find((s) => String(s.id) === String(subIdVal));
    setFormData((prev) => ({
      ...prev,
      subcategoryId: subIdVal,
      subcategory: subObj ? subObj.name : "—",
    }));
  };

  // Name Change in Form (Auto-generates Slug)
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

  // Save Product Handler (Sends exact fields required by backend API)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("slug", formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"));
      
      // Send product_category_id (Main Category - Required by backend API)
      const catId = formData.mainCategoryId || (mainCategoriesList.find((c) => c.name === formData.mainCategory)?.id) || (mainCategoriesList[0]?.id);
      if (catId) {
        payload.append("product_category_id", String(catId));
      }

      // Send product_subcategory_id (Subcategory - Optional)
      if (formData.subcategoryId) {
        payload.append("product_subcategory_id", String(formData.subcategoryId));
      }

      payload.append("short_description", formData.shortDescription || "");
      payload.append("description", formData.fullDescription || "");
      payload.append("applications", formData.applications || "");
      payload.append("status", formData.status);
      payload.append("sort_order", String(formData.displayOrder));
      payload.append("seo_title", formData.seoTitle || `${formData.name} | Merchem India`);
      payload.append("seo_description", formData.seoDescription || formData.shortDescription || "");

      if (productImageFile) {
        payload.append("image", productImageFile);
      }

      if (editingProduct) {
        await updateProductApi(editingProduct.id, payload);
        toast.success(`Product "${formData.name}" updated successfully!`);
      } else {
        await createProductApi(payload);
        toast.success(`Product "${formData.name}" created successfully!`);
      }

      await fetchProducts();
      setIsDrawerOpen(false);
    } catch (err: any) {
      console.error("Save product error:", err);
      const errMsg =
        err?.message ||
        (err?.errors ? Object.values(err.errors).flat().join(" ") : null) ||
        "Failed to save product.";
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Single Product (Calls DELETE /v1/products/{id})
  const handleDeleteConfirm = async () => {
    if (deleteModalId === null || deleteModalId === undefined) return;
    const targetId = deleteModalId;
    setIsDeleting(true);

    const isMockId = typeof targetId === "string" && targetId.startsWith("prod-");

    try {
      if (!isMockId) {
        await deleteProductApi(targetId);
      }
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error("Failed to delete product");
    } finally {
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(targetId)));
      setSelectedProductIds((prev) => prev.filter((id) => String(id) !== String(targetId)));
      setDeleteModalId(null);
      setIsDeleting(false);
      if (!isMockId) {
        fetchProducts();
      }
    }
  };

  // Bulk Delete Confirm
  const handleBulkDeleteConfirm = async () => {
    if (selectedProductIds.length === 0) return;
    setIsDeleting(true);
    const idsToDelete = [...selectedProductIds];
    let hasRealIds = false;

    for (const id of idsToDelete) {
      const isMockId = typeof id === "string" && id.startsWith("prod-");
      if (!isMockId) {
        hasRealIds = true;
        try {
          await deleteProductApi(id);
        } catch (err) {
          console.error(`Bulk delete error for id ${id}:`, err);
        }
      }
    }
    setProducts((prev) => prev.filter((p) => !idsToDelete.map(String).includes(String(p.id))));
    setSelectedProductIds([]);
    setIsBulkDeleteModalOpen(false);
    setIsDeleting(false);
    toast.success("Selected products deleted!");
    if (hasRealIds) {
      fetchProducts();
    }
  };

  // Bulk Status Update
  const handleBulkStatusUpdate = async (status: "Published" | "Draft" | "Inactive") => {
    for (const id of selectedProductIds) {
      const prod = products.find((p) => p.id === id);
      if (prod) {
        try {
          const fd = new FormData();
          fd.append("name", prod.name);
          fd.append("status", status === "Published" ? "active" : "inactive");
          await updateProductApi(id, fd);
        } catch (err) {
          console.error("Bulk status update error:", err);
        }
      }
    }
    toast.success(`Bulk updated products to ${status}`);
    await fetchProducts();
    setSelectedProductIds([]);
  };

  return (
    <DashboardLayout activeNavId="products">
      <div className="space-y-6 w-full pb-12 select-none">
        {/* ========================================================================= */}
        {/* 1. PAGE HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <BreadCrumbs
              items={[
                { label: "Product Management" },
                { label: "All Products" },
              ]}
            />

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
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#980e27] hover:bg-[#7A0B1F] active:bg-[#600818] text-white text-xs font-semibold rounded-md transition-all cursor-pointer shadow-xs shrink-0"
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
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#172126] border border-[#E5E7EB]">
              <Package className="w-5 h-5 text-[#64748B]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Total Products
              </span>
            </div>
          </div>

          {/* Published */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#15803D] border border-[#E5E7EB]">
              <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.published}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Published
              </span>
            </div>
          </div>

          {/* Drafts */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#D97706] border border-[#E5E7EB]">
              <FileEdit className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.drafts}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Drafts
              </span>
            </div>
          </div>

          {/* Inactive */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]">
              <AlertCircle className="w-5 h-5 text-[#64748B]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.inactive}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
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
                  {filterMainCategoryOptions.map((cat, idx) => (
                    <option key={`main-cat-${cat}-${idx}`} value={cat}>
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
                  {filterSubcategoryOptions.map((sub, idx) => (
                    <option key={`sub-cat-${sub}-${idx}`} value={sub}>
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
                            <div
                              onClick={() => handleOpenViewDrawer(item)}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-[#E5E7EB] bg-[#F8FAFA] flex items-center justify-center shrink-0 relative cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                      const fallback = parent.querySelector(".fallback-icon");
                                      if (fallback) (fallback as HTMLElement).style.display = "flex";
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className={`fallback-icon w-full h-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center ${
                                  item.image ? "hidden" : ""
                                }`}
                              >
                                <Package className="w-5 h-5" />
                              </div>
                            </div>
                            <div>
                              <span
                                onClick={() => handleOpenViewDrawer(item)}
                                className="font-bold text-[#172126] hover:text-[#980e27] cursor-pointer block leading-snug transition-colors"
                              >
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
                              item.status === "active"
                                ? "bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/20"
                                : "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]"
                            }`}
                          >
                            {item.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Row Actions */}
                        <td className="py-4 px-5 text-sm text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenViewDrawer(item)}
                              className="p-1.5 text-[#718096] hover:text-[#0369A1] hover:bg-[#F0F9FF] rounded-md transition-colors cursor-pointer"
                              title="View product details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
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
                Showing {paginationInfo.total === 0 ? 0 : (paginationInfo.currentPage - 1) * paginationInfo.perPage + 1} to {Math.min(paginationInfo.currentPage * paginationInfo.perPage, paginationInfo.total)} of {paginationInfo.total} products
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">|</span>
                <span>Rows per page:</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    const newLimit = Number(e.target.value);
                    setPerPage(newLimit);
                    setCurrentPage(1);
                    fetchProducts(1, newLimit);
                  }}
                  className="bg-[#F3F5F6] text-xs font-medium text-[#172126] px-2 py-1 rounded-md outline-hidden border border-[#E5E7EB] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (currentPage > 1) {
                    const prevP = currentPage - 1;
                    setCurrentPage(prevP);
                    fetchProducts(prevP, perPage);
                  }
                }}
                disabled={currentPage <= 1 || isLoading}
                className="p-1.5 border border-[#E5E7EB] rounded-md hover:bg-[#F8FAFA] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: paginationInfo.lastPage }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => {
                    if (pNum !== currentPage) {
                      setCurrentPage(pNum);
                      fetchProducts(pNum, perPage);
                    }
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    pNum === currentPage
                      ? "bg-[#980e27] text-white"
                      : "bg-white text-[#172126] border border-[#E5E7EB] hover:bg-[#F8FAFA]"
                  }`}
                >
                  {pNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  if (currentPage < paginationInfo.lastPage) {
                    const nextP = currentPage + 1;
                    setCurrentPage(nextP);
                    fetchProducts(nextP, perPage);
                  }
                }}
                disabled={currentPage >= paginationInfo.lastPage || isLoading}
                className="p-1.5 border border-[#E5E7EB] rounded-md hover:bg-[#F8FAFA] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Next page"
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

                {/* Category & Subcategory Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F5F7F6] border border-[#E5E7EB]">
                  {/* Main Category Required Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Main Category *
                    </label>
                    <select
                      value={formData.mainCategory}
                      onChange={(e) => {
                        const selectedCatName = e.target.value;
                        const catObj = mainCategoriesList.find((c) => c.name === selectedCatName);
                        setFormData((prev) => ({
                          ...prev,
                          mainCategory: selectedCatName,
                          mainCategoryId: catObj ? catObj.id : "",
                          subcategoryId: "",
                          subcategory: "—",
                        }));
                      }}
                      className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-md border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20 cursor-pointer"
                    >
                      {mainCategoriesList.length === 0 ? (
                        <option value="">No categories available</option>
                      ) : (
                        mainCategoriesList.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Subcategory Optional Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Subcategory <span className="text-[#64748B] font-normal font-sans lowercase">(optional)</span>
                    </label>
                    <select
                      value={formData.subcategoryId}
                      onChange={(e) => handleFormSubcategoryChange(e.target.value)}
                      className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-md border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20 cursor-pointer"
                    >
                      {(() => {
                        const available = subcategoriesList.filter(
                          (s) => s.mainCategoryName === formData.mainCategory
                        );
                        if (available.length === 0) {
                          return <option value="">No subcategories available for this category</option>;
                        }
                        return (
                          <>
                            <option value="">No Subcategory (—)</option>
                            {available.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </>
                        );
                      })()}
                    </select>
                  </div>
                </div>

                {/* Product Image File Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Product Image
                  </label>
                  <label className="relative p-4 rounded-xl border border-dashed border-[#DDE3E0] hover:border-[#980e27] bg-[#F8FAFA] text-center cursor-pointer transition-colors block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setProductImageFile(f);
                      }}
                      className="hidden"
                    />
                    {productImageFile || editingProduct?.image ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={productImageFile ? URL.createObjectURL(productImageFile) : editingProduct!.image!}
                          alt="Product preview"
                          className="w-12 h-12 rounded-lg object-cover border border-[#E5E7EB] shrink-0"
                        />
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#172126] truncate">
                            {productImageFile ? productImageFile.name : "Current product image"}
                          </p>
                          <p className="text-[10px] text-[#980e27] font-semibold mt-0.5">
                            Click to replace image file
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 py-1">
                        <Upload className="w-6 h-6 text-[#980e27] mx-auto" />
                        <span className="text-xs font-semibold text-[#172126] block">
                          Upload Product Image
                        </span>
                        <span className="text-[10px] text-[#718096] block">
                          PNG, JPG or WEBP up to 2MB
                        </span>
                      </div>
                    )}
                  </label>
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

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Full Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Detailed chemical properties and product description..."
                    className="w-full p-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                </div>

                {/* Applications */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Applications
                  </label>
                  <input
                    type="text"
                    value={formData.applications}
                    onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
                    placeholder="Rubber processing and vulcanization applications."
                    className="w-full h-10 px-3.5 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
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
                          status: e.target.value as "active" | "inactive",
                        })
                      }
                      className="w-full h-10 px-3 bg-white text-sm text-[#172126] rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27] cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                      Sort Order
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
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
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
                disabled={isDeleting}
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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
                disabled={isDeleting}
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleBulkDeleteConfirm}
                className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Bulk Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SINGLE PRODUCT VIEW MODAL                                              */}
      {/* ========================================================================= */}
      <ProductView
        productId={viewingProduct?.id}
        productData={viewingProduct}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProduct(null);
        }}
        onEdit={(prod) => {
          setIsViewModalOpen(false);
          setViewingProduct(null);
          handleOpenEditDrawer(prod);
        }}
      />
    </DashboardLayout>
  );
}