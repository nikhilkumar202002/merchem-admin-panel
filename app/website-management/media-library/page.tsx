"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardLayout from "../../component/layout/Layout";
import BreadCrumbs from "../../component/common/BreadCrumbs";
import {
  ImageIcon,
  FileText,
  Upload,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Trash2,
  Copy,
  Download,
  Edit2,
  Eye,
  X,
  Check,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileCode,
  HardDrive,
  Calendar,
  Layers,
  Info,
  ExternalLink,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Link as LinkIcon,
} from "lucide-react";

export interface MediaItem {
  id: string;
  name: string;
  type: "Image" | "PDF" | "Document";
  format: string; // e.g., 'PNG', 'PDF', 'WEBP', 'JPG'
  sizeBytes: number;
  sizeFormatted: string;
  dimensions?: string; // e.g. '1920 × 1080 px'
  url: string;
  altText: string;
  uploadDate: string;
  timestamp: number;
  referencedCount: number;
  referencedLocations?: string[];
  thumbnailUrl?: string;
}

const initialMediaFiles: MediaItem[] = [
  {
    id: "media-1",
    name: "vulcanization-accelerator-chart.png",
    type: "Image",
    format: "PNG",
    sizeBytes: 1468006,
    sizeFormatted: "1.4 MB",
    dimensions: "1920 × 1080 px",
    url: "https://merchem.com/uploads/vulcanization-accelerator-chart.png",
    altText: "Rheometer cure curve comparison chart for CBS and TMTD accelerators",
    uploadDate: "28 Sep 2026",
    timestamp: 1790600000000,
    referencedCount: 3,
    referencedLocations: ["Product: Merchem CBS Accelerator", "Product: Merchem TMTD", "Blog: Understanding Vulcanization"],
    thumbnailUrl: "/chemical_bg.jpg",
  },
  {
    id: "media-2",
    name: "merchem-iso-9001-certificate.pdf",
    type: "PDF",
    format: "PDF",
    sizeBytes: 2936012,
    sizeFormatted: "2.8 MB",
    url: "https://merchem.com/documents/merchem-iso-9001-certificate.pdf",
    altText: "ISO 9001:2015 Quality Management Certificate for Merchem India",
    uploadDate: "25 Sep 2026",
    timestamp: 1790400000000,
    referencedCount: 1,
    referencedLocations: ["Company Profile Page"],
  },
  {
    id: "media-3",
    name: "latex-dipping-process-diagram.webp",
    type: "Image",
    format: "WEBP",
    sizeBytes: 911360,
    sizeFormatted: "890 KB",
    dimensions: "2400 × 1600 px",
    url: "https://merchem.com/uploads/latex-dipping-process-diagram.webp",
    altText: "Continuous latex glove dipping line schematic layout",
    uploadDate: "20 Sep 2026",
    timestamp: 1790000000000,
    referencedCount: 2,
    referencedLocations: ["Blog: Specialty Chemicals in Latex Applications", "Application: Medical Gloves"],
    thumbnailUrl: "/chemical_bg.jpg",
  },
  {
    id: "media-4",
    name: "tds-merchem-cbs-accelerator.pdf",
    type: "PDF",
    format: "PDF",
    sizeBytes: 1258291,
    sizeFormatted: "1.2 MB",
    url: "https://merchem.com/documents/tds-merchem-cbs-accelerator.pdf",
    altText: "Technical Data Sheet for Merchem CBS Rubber Accelerator",
    uploadDate: "15 Sep 2026",
    timestamp: 1789500000000,
    referencedCount: 1,
    referencedLocations: ["Product Downloads: Merchem CBS"],
  },
  {
    id: "media-5",
    name: "rubber-antioxidant-heat-resistance.jpg",
    type: "Image",
    format: "JPG",
    sizeBytes: 2202009,
    sizeFormatted: "2.1 MB",
    dimensions: "1280 × 720 px",
    url: "https://merchem.com/uploads/rubber-antioxidant-heat-resistance.jpg",
    altText: "Heat ageing test results of rubber compounds with Merchem 6PPD",
    uploadDate: "10 Sep 2026",
    timestamp: 1789000000000,
    referencedCount: 0,
    thumbnailUrl: "/chemical_bg.jpg",
  },
  {
    id: "media-6",
    name: "sds-merchem-tmtd-safety.pdf",
    type: "PDF",
    format: "PDF",
    sizeBytes: 3565158,
    sizeFormatted: "3.4 MB",
    url: "https://merchem.com/documents/sds-merchem-tmtd-safety.pdf",
    altText: "Safety Data Sheet SDS according to REACH regulation for TMTD",
    uploadDate: "05 Sep 2026",
    timestamp: 1788500000000,
    referencedCount: 2,
    referencedLocations: ["Product: Merchem TMTD", "Compliance Portal"],
  },
  {
    id: "media-7",
    name: "factory-reactor-plant-kochi.jpg",
    type: "Image",
    format: "JPG",
    sizeBytes: 4404019,
    sizeFormatted: "4.2 MB",
    dimensions: "3840 × 2160 px",
    url: "https://merchem.com/uploads/factory-reactor-plant-kochi.jpg",
    altText: "Merchem chemical synthesis reactor unit at Kochi manufacturing plant",
    uploadDate: "01 Sep 2026",
    timestamp: 1788000000000,
    referencedCount: 1,
    referencedLocations: ["About Us: Infrastructure"],
    thumbnailUrl: "/chemical_bg.jpg",
  },
  {
    id: "media-8",
    name: "merchem-sustainability-report-2026.pdf",
    type: "PDF",
    format: "PDF",
    sizeBytes: 6081740,
    sizeFormatted: "5.8 MB",
    url: "https://merchem.com/documents/merchem-sustainability-report-2026.pdf",
    altText: "Annual ESG and Environmental Sustainability Report 2026",
    uploadDate: "20 Aug 2026",
    timestamp: 1787000000000,
    referencedCount: 0,
  },
];

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMediaFiles);

  // View Mode: Grid or List
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Images" | "Documents" | "PDFs">("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  // Selection Checkbox States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Media Details Drawer State
  const [activeMediaItem, setActiveMediaItem] = useState<MediaItem | null>(null);
  const [editingAltText, setEditingAltText] = useState("");

  // Modals State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<MediaItem | null>(null);
  const [newFileName, setNewFileName] = useState("");

  // Upload Simulation State
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPI Summary Statistics
  const stats = useMemo(() => {
    const totalFiles = mediaList.length;
    const images = mediaList.filter((m) => m.type === "Image").length;
    const documents = mediaList.filter((m) => m.type === "PDF" || m.type === "Document").length;
    const totalBytes = mediaList.reduce((acc, curr) => acc + curr.sizeBytes, 0);
    const storageFormatted = `${(totalBytes / (1024 * 1024)).toFixed(1)} MB / 1 GB`;
    return { totalFiles, images, documents, storageFormatted };
  }, [mediaList]);

  // Derived Filtered & Sorted Media List
  const filteredMedia = useMemo(() => {
    return mediaList
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.altText.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesType = true;
        if (typeFilter === "Images") matchesType = item.type === "Image";
        if (typeFilter === "Documents") matchesType = item.type === "Document" || item.type === "PDF";
        if (typeFilter === "PDFs") matchesType = item.format === "PDF";

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.timestamp - a.timestamp;
        if (sortBy === "oldest") return a.timestamp - b.timestamp;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [mediaList, searchQuery, typeFilter, sortBy]);

  // Selection Checkbox Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredMedia.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open Details Slide-Over Panel
  const handleOpenDetails = (item: MediaItem) => {
    setActiveMediaItem(item);
    setEditingAltText(item.altText);
  };

  // Save Updated Alt Text
  const handleSaveAltText = () => {
    if (!activeMediaItem) return;
    setMediaList((prev) =>
      prev.map((m) =>
        m.id === activeMediaItem.id ? { ...m, altText: editingAltText } : m
      )
    );
    setActiveMediaItem((prev) => (prev ? { ...prev, altText: editingAltText } : null));
    showToast("Alt text updated successfully!");
  };

  // Copy File URL to Clipboard
  const handleCopyUrl = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    showToast("File URL copied to clipboard!");
  };

  // Rename File Action
  const handleRenameConfirm = () => {
    if (!renameTarget || !newFileName.trim()) return;
    setMediaList((prev) =>
      prev.map((m) =>
        m.id === renameTarget.id ? { ...m, name: newFileName.trim() } : m
      )
    );
    if (activeMediaItem?.id === renameTarget.id) {
      setActiveMediaItem((prev) => (prev ? { ...prev, name: newFileName.trim() } : null));
    }
    showToast(`Renamed file to "${newFileName.trim()}"`);
    setRenameTarget(null);
    setNewFileName("");
  };

  // Single Delete Confirmation
  const handleConfirmDeleteSingle = () => {
    if (!deleteTarget) return;
    setMediaList((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    if (activeMediaItem?.id === deleteTarget.id) {
      setActiveMediaItem(null);
    }
    showToast(`Deleted file "${deleteTarget.name}"`);
    setDeleteTarget(null);
  };

  // Bulk Delete Confirmation
  const handleConfirmBulkDelete = () => {
    setMediaList((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
    showToast("Selected media files deleted successfully!");
  };

  // Handle Drag & Drop / File Select in Upload Modal
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      // Format validation
      const validFiles = filesArr.filter((f) =>
        ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(f.type)
      );

      if (validFiles.length < filesArr.length) {
        setUploadError("Some selected files were ignored. Only JPG, PNG, WEBP and PDF formats are supported.");
      } else {
        setUploadError(null);
      }
      setUploadFiles(validFiles);
    }
  };

  // Simulated Upload Execution
  const handleStartUpload = () => {
    if (uploadFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            // Append newly uploaded files
            const newMediaItems: MediaItem[] = uploadFiles.map((file, idx) => {
              const isPdf = file.type.includes("pdf");
              return {
                id: `media-new-${Date.now()}-${idx}`,
                name: file.name,
                type: isPdf ? "PDF" : "Image",
                format: isPdf ? "PDF" : file.name.split(".").pop()?.toUpperCase() || "PNG",
                sizeBytes: file.size,
                sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                dimensions: isPdf ? undefined : "1920 × 1080 px",
                url: `https://merchem.com/uploads/${file.name}`,
                altText: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
                uploadDate: "Just now",
                timestamp: Date.now(),
                referencedCount: 0,
                thumbnailUrl: isPdf ? undefined : "/chemical_bg.jpg",
              };
            });

            setMediaList((prev) => [...newMediaItems, ...prev]);
            setIsUploading(false);
            setUploadProgress(0);
            setUploadFiles([]);
            setIsUploadModalOpen(false);
            showToast(`${newMediaItems.length} file(s) uploaded to Media Library!`);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <DashboardLayout activeNavId="media-library">
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
                { label: "Website Management" },
                { label: "Media Library" },
              ]}
            />

            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              Media Library
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Upload, organize, search, and manage images and documents used across the Merchem website.
            </p>
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => {
              setUploadFiles([]);
              setUploadError(null);
              setIsUploadModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-xs shadow-[#980e27]/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUMMARY KPI CARDS                                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Files */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.totalFiles}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Files
              </span>
            </div>
          </div>

          {/* Card 2: Images */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/10">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.images}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Images
              </span>
            </div>
          </div>

          {/* Card 3: Documents */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/10">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-[#172126] block leading-tight">
                {stats.documents}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Documents & PDFs
              </span>
            </div>
          </div>

          {/* Card 4: Storage Used */}
          <div className="bg-white p-4.5 rounded-xl border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/10">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-[#172126] block leading-tight">
                {stats.storageFormatted}
              </span>
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Storage Used
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SEARCH & FILTERS TOOLBAR                                              */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files by name or alt text..."
                className="w-full h-10 pl-10 pr-4 bg-[#F3F5F6] text-sm text-[#172126] placeholder-[#718096] rounded-lg border border-transparent outline-hidden focus:border-[#980e27] focus:bg-white focus:ring-2 focus:ring-[#980e27]/20 transition-all"
              />
            </div>

            {/* Controls Right */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Type Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Filter className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Images">Images Only</option>
                  <option value="Documents">Documents</option>
                  <option value="PDFs">PDFs Only</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="name">Sort: Name (A-Z)</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center p-0.5 bg-[#F3F5F6] rounded-lg border border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-[#980e27] shadow-xs"
                      : "text-[#718096] hover:text-[#172126]"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-[#980e27] shadow-xs"
                      : "text-[#718096] hover:text-[#172126]"
                  }`}
                  title="List View"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Reset Filters */}
              {(searchQuery || typeFilter !== "All" || sortBy !== "newest") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("All");
                    setSortBy("newest");
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-[#FFF5F7] text-[#980e27] hover:bg-[#980e27] hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-[#980e27]/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Bulk Selection Header Bar */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-[#FFF5F7] border border-[#980e27]/20 rounded-lg flex items-center justify-between gap-3 animate-in fade-in duration-150">
              <span className="text-xs font-semibold text-[#980e27]">
                {selectedIds.length} media file(s) selected
              </span>
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="px-3 py-1 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
              >
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. MEDIA CONTENT (GRID OR LIST VIEW)                                      */}
        {/* ========================================================================= */}
        {filteredMedia.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center mx-auto border border-[#980e27]/20">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172126]">No media files found</h3>
              <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
                No uploaded assets matched your search query or filters. Try clearing your filters or upload new media files.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#980e27] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#7A0B1F] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Media File</span>
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetails(item)}
                  className={`group bg-white rounded-xl border transition-all duration-150 overflow-hidden cursor-pointer shadow-2xs relative flex flex-col justify-between ${
                    isSelected
                      ? "border-[#980e27] ring-2 ring-[#980e27]/20 bg-[#FFF5F7]/30"
                      : "border-[#E5E7EB] hover:border-[#980e27]/50 hover:shadow-md"
                  }`}
                >
                  {/* Selection Checkbox Top Left */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(item.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer bg-white shadow-xs"
                    />
                  </div>

                  {/* Format Badge Top Right */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-semibold tracking-wider uppercase">
                      {item.format}
                    </span>
                  </div>

                  {/* Preview Thumbnail Container */}
                  <div className="relative w-full h-40 bg-[#F8FAFA] border-b border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                    {item.type === "Image" && item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FileText className="w-12 h-12 text-[#0369A1] mx-auto mb-1 opacity-80" />
                        <span className="text-[11px] font-mono font-semibold text-[#0369A1] block">
                          PDF Document
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Info */}
                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#172126] truncate group-hover:text-[#980e27] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#718096] truncate mt-0.5">
                        {item.altText || "No description"}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>{item.sizeFormatted}</span>
                      <span>{item.uploadDate}</span>
                    </div>
                  </div>

                  {/* Quick Action Overlay Bar */}
                  <div className="px-3 py-2 bg-[#F8FAFA] border-t border-[#E5E7EB] flex items-center justify-between gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleCopyUrl(item.url, e)}
                      className="p-1 text-[#718096] hover:text-[#980e27] rounded-md transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenameTarget(item);
                        setNewFileName(item.name);
                      }}
                      className="p-1 text-[#718096] hover:text-[#980e27] rounded-md transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-[#718096] hover:text-[#980e27] rounded-md transition-colors"
                      title="Download / View"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(item);
                      }}
                      className="p-1 text-[#718096] hover:text-[#E53E3E] rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Mode Table */
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFA] border-b border-[#E5E7EB]">
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === filteredMedia.length &&
                          filteredMedia.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#718096] uppercase tracking-wider min-w-[220px]">
                      File
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Type & Format
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Size & Specs
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Linked Content
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#718096] uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleOpenDetails(item)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-[#FFF5F7]/40" : "hover:bg-[#F8FAFA]/80"
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(item.id, e)}
                            className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-sm font-medium text-[#172126]">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg bg-[#F8FAFA] border border-[#E5E7EB] overflow-hidden shrink-0 flex items-center justify-center">
                              {item.type === "Image" && item.thumbnailUrl ? (
                                <Image
                                  src={item.thumbnailUrl}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <FileText className="w-5 h-5 text-[#0369A1]" />
                              )}
                            </div>
                            <div className="max-w-xs">
                              <span className="font-bold text-[#172126] block truncate">
                                {item.name}
                              </span>
                              <span className="text-xs text-[#718096] block truncate">
                                {item.altText || "No alt description"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-[#475569]">
                          <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                            {item.format}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#64748B]">
                          <div>{item.sizeFormatted}</div>
                          {item.dimensions && (
                            <div className="text-[11px] text-[#94A3B8]">{item.dimensions}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#64748B]">
                          {item.uploadDate}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#64748B]">
                          {item.referencedCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[#087F5B] font-semibold bg-[#E6F4EA] px-2 py-0.5 rounded-full text-[11px]">
                              <LinkIcon className="w-3 h-3" />
                              {item.referencedCount} items
                            </span>
                          ) : (
                            <span className="text-[#94A3B8]">Unlinked</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleCopyUrl(item.url, e)}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md"
                              title="Copy URL"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRenameTarget(item);
                                setNewFileName(item.name);
                              }}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md"
                              title="Rename"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF5F5] rounded-md"
                              title="Delete"
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
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. MEDIA DETAILS SLIDE-OVER DRAWER                                       */}
        {/* ========================================================================= */}
        {activeMediaItem && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E7EB] overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#980e27]" />
                  <h3 className="text-base font-bold text-[#172126]">Media Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMediaItem(null)}
                  className="p-1.5 text-[#718096] hover:text-[#172126] hover:bg-[#F3F5F6] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Content */}
              <div className="p-6 space-y-6 flex-1">
                {/* Large Preview Box */}
                <div className="relative w-full h-48 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] overflow-hidden flex items-center justify-center">
                  {activeMediaItem.type === "Image" && activeMediaItem.thumbnailUrl ? (
                    <Image
                      src={activeMediaItem.thumbnailUrl}
                      alt={activeMediaItem.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-[#0369A1] mx-auto mb-2" />
                      <span className="text-xs font-mono font-semibold text-[#0369A1]">
                        PDF Document Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* File Metadata Grid */}
                <div className="bg-[#F8FAFA] p-4 rounded-xl border border-[#E5E7EB] space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                    <span className="text-[#718096]">File Name</span>
                    <span className="font-semibold text-[#172126] truncate max-w-[200px]">
                      {activeMediaItem.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                    <span className="text-[#718096]">File Type</span>
                    <span className="font-semibold text-[#172126]">
                      {activeMediaItem.type} ({activeMediaItem.format})
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                    <span className="text-[#718096]">File Size</span>
                    <span className="font-semibold text-[#172126]">
                      {activeMediaItem.sizeFormatted}
                    </span>
                  </div>
                  {activeMediaItem.dimensions && (
                    <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                      <span className="text-[#718096]">Dimensions</span>
                      <span className="font-semibold text-[#172126]">
                        {activeMediaItem.dimensions}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-[#718096]">Upload Date</span>
                    <span className="font-semibold text-[#172126]">
                      {activeMediaItem.uploadDate}
                    </span>
                  </div>
                </div>

                {/* File Direct URL with Copy Button */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    File Public URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={activeMediaItem.url}
                      className="w-full h-9 px-3 bg-[#F3F5F6] text-xs font-mono text-[#172126] rounded-lg border border-[#E5E7EB] outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(activeMediaItem.url)}
                      className="px-3 py-2 bg-[#FFF5F7] hover:bg-[#980e27] hover:text-white text-[#980e27] text-xs font-semibold rounded-lg border border-[#980e27]/20 transition-colors shrink-0 cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Editable Image Alt Text */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#172126] uppercase tracking-wider">
                    Image Alt Text (SEO & Accessibility)
                  </label>
                  <textarea
                    rows={3}
                    value={editingAltText}
                    onChange={(e) => setEditingAltText(e.target.value)}
                    placeholder="Describe image content for accessibility..."
                    className="w-full p-3 bg-white text-xs text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                  <button
                    type="button"
                    onClick={handleSaveAltText}
                    className="w-full py-2 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Save Alt Text
                  </button>
                </div>

                {/* Referenced Content List */}
                {activeMediaItem.referencedLocations && (
                  <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
                    <span className="text-xs font-semibold text-[#172126] block uppercase tracking-wider">
                      Linked Pages & Products ({activeMediaItem.referencedCount})
                    </span>
                    <ul className="space-y-1 text-xs text-[#475569]">
                      {activeMediaItem.referencedLocations.map((loc, i) => (
                        <li key={i} className="flex items-center gap-2 bg-[#F8FAFA] p-2 rounded-lg border border-[#E5E7EB]">
                          <ExternalLink className="w-3.5 h-3.5 text-[#980e27]" />
                          <span>{loc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFA] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(activeMediaItem)}
                  className="px-4 py-2 bg-white hover:bg-[#FFF5F5] border border-[#FEB2B2] text-[#E53E3E] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Delete File
                </button>
                <a
                  href={activeMediaItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#172126] hover:bg-[#2D3748] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Download File
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. UPLOAD MEDIA MODAL                                                    */}
        {/* ========================================================================= */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E5E7EB] shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <h3 className="text-lg font-bold text-[#172126] flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#980e27]" />
                  <span>Upload Media Files</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 text-[#718096] hover:text-[#172126]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <label className="block p-8 rounded-2xl border-2 border-dashed border-[#DDE3E0] hover:border-[#980e27] bg-[#F8FAFA] hover:bg-[#FFF5F7]/30 text-center cursor-pointer transition-all">
                <Upload className="w-10 h-10 text-[#980e27] mx-auto mb-3" />
                <span className="text-sm font-bold text-[#172126] block">
                  Drag and drop files here to upload
                </span>
                <span className="text-xs text-[#718096] block mt-1">
                  Supported formats: JPG, PNG, WEBP, PDF (Max size 10MB per file)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {/* Format Validation Error */}
              {uploadError && (
                <div className="p-3 bg-[#FFF5F5] border border-[#FEB2B2] rounded-xl text-xs text-[#E53E3E] flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Selected Files List Preview */}
              {uploadFiles.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  <span className="text-xs font-semibold text-[#172126] block">
                    Selected Files ({uploadFiles.length}):
                  </span>
                  {uploadFiles.map((f, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-[#F8FAFA] border border-[#E5E7EB] rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-[#172126] truncate max-w-[260px]">
                        {f.name}
                      </span>
                      <span className="text-[#718096]">
                        {(f.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress Indicator */}
              {isUploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-[#172126]">
                    <span>Uploading files...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#980e27] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={isUploading}
                  className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-xl hover:bg-[#F8FAFA]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartUpload}
                  disabled={uploadFiles.length === 0 || isUploading}
                  className="px-5 py-2 bg-[#980e27] hover:bg-[#7A0B1F] disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isUploading ? "Uploading..." : `Upload ${uploadFiles.length} File(s)`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. DELETE CONFIRMATION MODALS                                            */}
        {/* ========================================================================= */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#E53E3E] flex items-center justify-center border border-[#FEB2B2]">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172126]">Delete Media File?</h3>
                <p className="text-xs text-[#718096] mt-1">
                  Are you sure you want to remove <strong className="text-[#172126]">&quot;{deleteTarget.name}&quot;</strong>?
                </p>

                {/* Warning if Referenced */}
                {deleteTarget.referencedCount > 0 && (
                  <div className="mt-3 p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl text-xs text-[#D97706] space-y-1">
                    <span className="font-bold block flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                      Warning: Referenced Asset
                    </span>
                    <p>
                      This file is currently linked to {deleteTarget.referencedCount} product page(s) or blog post(s). Deleting it will result in broken media links.
                    </p>
                  </div>
                )}
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
                  onClick={handleConfirmDeleteSingle}
                  className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rename Modal */}
        {renameTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-[#172126]">Rename File</h3>
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#718096] uppercase">
                  File Name
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-xs font-medium text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRenameConfirm}
                  className="px-4 py-2 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Save Name
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
                  Delete {selectedIds.length} Selected Files?
                </h3>
                <p className="text-xs text-[#718096] mt-1">
                  Are you sure you want to permanently remove the selected media assets from the library?
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
                  onClick={handleConfirmBulkDelete}
                  className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm Bulk Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
