"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "../../component/layout/Layout";
import BreadCrumbs from "../../component/common/BreadCrumbs";
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  RotateCcw,
  User,
  Building,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Info,
  X,
  Tag,
  RefreshCw,
  Mail,
  ShieldCheck,
  Package,
} from "lucide-react";

export interface TdsRequestItem {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  email?: string;
  company: string;
  phone?: string;
  message?: string;
  productId: string;
  productName: string;
  category: string;
  subcategory: string;
  tdsFileName: string;
  tdsVersion: string;
  tdsAvailable: boolean;
  requestDate: string;
  timestamp: number;
  status: "Pending" | "Sending" | "Sent" | "Failed";
  lastAttemptDate?: string;
  failureReason?: string;
  attemptCount: number;
}

const initialTdsRequests: TdsRequestItem[] = [
  {
    id: "tds-req-201",
    referenceNumber: "TDS-2026-9810",
    customerName: "Sanjay Mukherjee",
    email: "s.mukherjee@balkrishnatyres.com",
    customerEmail: "s.mukherjee@balkrishnatyres.com",
    company: "BKT Tires Ltd",
    phone: "+91 98210 44556",
    message: "Requesting official TDS for VULCURE MBT to evaluate in off-highway tyre tread compounding.",
    productId: "prod-1",
    productName: "VULCURE MBT",
    category: "Rubber Accelerators",
    subcategory: "Thiazoles",
    tdsFileName: "Vulcure_MBT_TDS.pdf",
    tdsVersion: "v1.2",
    tdsAvailable: true,
    requestDate: "01 Oct 2026, 15:10 PM",
    timestamp: 1790683800000,
    status: "Pending",
    attemptCount: 0,
  },
  {
    id: "tds-req-202",
    referenceNumber: "TDS-2026-9805",
    customerName: "Kavita Deshmukh",
    email: "kavita.d@ceat.com",
    customerEmail: "kavita.d@ceat.com",
    company: "CEAT Limited",
    phone: "+91 98900 11223",
    message: "Please send TDS for MBTS for evaluation in PCR carcass compound trials.",
    productId: "prod-2",
    productName: "VULCURE MBTS",
    category: "Rubber Accelerators",
    subcategory: "Thiazoles",
    tdsFileName: "Vulcure_MBTS_TDS.pdf",
    tdsVersion: "v1.1",
    tdsAvailable: true,
    requestDate: "30 Sep 2026, 11:30 AM",
    timestamp: 1790509800000,
    status: "Sent",
    lastAttemptDate: "30 Sep 2026, 11:35 AM",
    attemptCount: 1,
  },
  {
    id: "tds-req-203",
    referenceNumber: "TDS-2026-9799",
    customerName: "Arun Varma",
    email: "arun.varma@jktyre.com",
    customerEmail: "arun.varma@jktyre.com",
    company: "JK Tyre & Industries",
    phone: "+91 97110 99887",
    message: "Need technical data sheet for VULCURE ZMBT for latex foam dipping line.",
    productId: "prod-3",
    productName: "VULCURE ZMBT",
    category: "Rubber Accelerators",
    subcategory: "Thiazoles",
    tdsFileName: "Vulcure_ZMBT_TDS.pdf",
    tdsVersion: "v1.0",
    tdsAvailable: false, // Product has no uploaded TDS yet
    requestDate: "28 Sep 2026, 16:45 PM",
    timestamp: 1790268300000,
    status: "Failed",
    lastAttemptDate: "28 Sep 2026, 16:46 PM",
    failureReason: "TDS document PDF has not been uploaded to product record.",
    attemptCount: 1,
  },
  {
    id: "tds-req-204",
    referenceNumber: "TDS-2026-9784",
    customerName: "Meera Krishnan",
    email: "meera.k@rubfil.com",
    customerEmail: "meera.k@rubfil.com",
    company: "Rubfila International Ltd",
    phone: "+91 94470 33445",
    message: "Kindly email TDS for VULCURE ZDC ultra accelerator for latex thread extrusion.",
    productId: "prod-4",
    productName: "VULCURE ZDC",
    category: "Rubber Accelerators",
    subcategory: "Dithiocarbamates",
    tdsFileName: "Vulcure_ZDC_TDS.pdf",
    tdsVersion: "v2.0",
    tdsAvailable: true,
    requestDate: "25 Sep 2026, 09:20 AM",
    timestamp: 1789976400000,
    status: "Sent",
    lastAttemptDate: "25 Sep 2026, 09:22 AM",
    attemptCount: 1,
  },
  {
    id: "tds-req-205",
    referenceNumber: "TDS-2026-9770",
    customerName: "Amitabh Sen",
    email: "asen@bridgestone.co.in",
    customerEmail: "asen@bridgestone.co.in",
    company: "Bridgestone India",
    phone: "+91 98190 77665",
    message: "Requesting TDS for VULCURE ZDBC for heat-resistant EPDM weatherstrip compounding.",
    productId: "prod-5",
    productName: "VULCURE ZDBC",
    category: "Rubber Accelerators",
    subcategory: "Dithiocarbamates",
    tdsFileName: "Vulcure_ZDBC_TDS.pdf",
    tdsVersion: "v1.4",
    tdsAvailable: true,
    requestDate: "22 Sep 2026, 14:00 PM",
    timestamp: 1789728000000,
    status: "Pending",
    attemptCount: 0,
  },
];

export default function TdsRequestsPage() {
  const [requests, setRequests] = useState<TdsRequestItem[]>(initialTdsRequests);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "Pending" | "Sending" | "Sent" | "Failed">("All");

  // Selection Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Drawer State
  const [activeRequest, setActiveRequest] = useState<TdsRequestItem | null>(null);

  // Send Verification Modal State
  const [sendTargetRequest, setSendTargetRequest] = useState<TdsRequestItem | null>(null);
  const [isSendingProcess, setIsSendingProcess] = useState(false);

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<TdsRequestItem | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Public Form Modal Demo Simulation State
  const [isPublicModalDemoOpen, setIsPublicModalDemoOpen] = useState(false);
  const [demoFormData, setDemoFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [demoSubmitSuccess, setDemoSubmitSuccess] = useState<string | null>(null);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPI Summary Statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "Pending").length;
    const sent = requests.filter((r) => r.status === "Sent").length;
    const failed = requests.filter((r) => r.status === "Failed").length;
    return { total, pending, sent, failed };
  }, [requests]);

  // Derived Filtered List
  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesSearch =
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProduct =
        selectedProduct === "All" || item.productName === selectedProduct;

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      return matchesSearch && matchesProduct && matchesStatus;
    });
  }, [requests, searchQuery, selectedProduct, selectedStatus]);

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedProduct("All");
    setSelectedStatus("All");
  };

  // Checkbox Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredRequests.map((r) => r.id));
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

  // Execute Email Delivery (Simulated Server Transactional API)
  const handleConfirmSendTds = () => {
    if (!sendTargetRequest) return;

    if (!sendTargetRequest.tdsAvailable) {
      showToast(`Cannot send: Product "${sendTargetRequest.productName}" has no uploaded TDS PDF.`);
      setSendTargetRequest(null);
      return;
    }

    setIsSendingProcess(true);

    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === sendTargetRequest.id) {
            return {
              ...r,
              status: "Sent",
              lastAttemptDate: "Just now",
              attemptCount: r.attemptCount + 1,
              failureReason: undefined,
            };
          }
          return r;
        })
      );

      if (activeRequest?.id === sendTargetRequest.id) {
        setActiveRequest((prev) =>
          prev
            ? {
                ...prev,
                status: "Sent",
                lastAttemptDate: "Just now",
                attemptCount: prev.attemptCount + 1,
                failureReason: undefined,
              }
            : null
        );
      }

      setIsSendingProcess(false);
      showToast(`TDS PDF "${sendTargetRequest.tdsFileName}" sent to ${sendTargetRequest.customerEmail}!`);
      setSendTargetRequest(null);
    }, 1000);
  };

  // Single Delete Confirm
  const handleConfirmSingleDelete = () => {
    if (!deleteTarget) return;
    setRequests((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    if (activeRequest?.id === deleteTarget.id) {
      setActiveRequest(null);
    }
    showToast(`Deleted request reference ${deleteTarget.referenceNumber}`);
    setDeleteTarget(null);
  };

  // Bulk Delete Confirm
  const handleConfirmBulkDelete = () => {
    setRequests((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
    showToast("Selected TDS requests deleted successfully!");
  };

  // Handle Public Demo Submission
  const handlePublicDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refNum = `TDS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReq: TdsRequestItem = {
      id: `tds-req-${Date.now()}`,
      referenceNumber: refNum,
      customerName: demoFormData.fullName,
      email: demoFormData.email,
      customerEmail: demoFormData.email,
      company: demoFormData.company || "Independent Buyer",
      phone: demoFormData.phone,
      message: demoFormData.message,
      productId: "prod-1",
      productName: "VULCURE MBT",
      category: "Rubber Accelerators",
      subcategory: "Thiazoles",
      tdsFileName: "Vulcure_MBT_TDS.pdf",
      tdsVersion: "v1.2",
      tdsAvailable: true,
      requestDate: "Just now",
      timestamp: Date.now(),
      status: "Pending",
      attemptCount: 0,
    };

    setRequests((prev) => [newReq, ...prev]);
    setDemoSubmitSuccess(`TDS Request submitted! Reference #${refNum}`);
    setTimeout(() => {
      setDemoSubmitSuccess(null);
      setIsPublicModalDemoOpen(false);
      setDemoFormData({ fullName: "", email: "", company: "", phone: "", message: "" });
      showToast(`New TDS Request received from ${demoFormData.fullName}!`);
    }, 2000);
  };

  return (
    <DashboardLayout activeNavId="tds-requests">
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
            <BreadCrumbs
              items={[
                { label: "Website Management" },
                { label: "TDS Requests" },
              ]}
            />

            {/* Title & Subtitle */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              TDS Requests
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Review customer requests and send the correct technical data sheets for Merchem products.
            </p>
          </div>

          {/* Test Public Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsPublicModalDemoOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#FFF5F7] hover:border-[#980e27]/30 text-[#980e27] text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-[#980e27]" />
            <span>Test Public Request Form</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUMMARY KPI CARDS                                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Requests */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#172126] border border-[#E5E7EB]">
              <FileCheck className="w-5 h-5 text-[#64748B]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Total Requests
              </span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#D97706] border border-[#E5E7EB]">
              <Clock className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.pending}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Pending Send
              </span>
            </div>
          </div>

          {/* Sent */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#15803D] border border-[#E5E7EB]">
              <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.sent}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Sent to Email
              </span>
            </div>
          </div>

          {/* Failed */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#DC2626] border border-[#E5E7EB]">
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.failed}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Delivery Failed
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SEARCH AND FILTERS TOOLBAR                                            */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#718096] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, email, company or reference..."
                className="w-full h-10 pl-10 pr-4 bg-[#F3F5F6] text-sm text-[#172126] placeholder-[#718096] rounded-lg border border-transparent outline-hidden focus:border-[#980e27] focus:bg-white focus:ring-2 focus:ring-[#980e27]/20 transition-all"
              />
            </div>

            {/* Filter Controls Right */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Product Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Package className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Products</option>
                  <option value="VULCURE MBT">VULCURE MBT</option>
                  <option value="VULCURE MBTS">VULCURE MBTS</option>
                  <option value="VULCURE ZMBT">VULCURE ZMBT</option>
                  <option value="VULCURE ZDC">VULCURE ZDC</option>
                  <option value="VULCURE ZDBC">VULCURE ZDBC</option>
                </select>
              </div>

              {/* Delivery Status Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Filter className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Sending">Sending</option>
                  <option value="Sent">Sent</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(searchQuery || selectedProduct !== "All" || selectedStatus !== "All") && (
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

          {/* Bulk Selection Header Bar */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-[#FFF5F7] border border-[#980e27]/20 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
              <span className="text-xs font-semibold text-[#980e27]">
                {selectedIds.length} request(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-3 py-1 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. TDS REQUESTS DATA TABLE                                                */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          {filteredRequests.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center mx-auto border border-[#980e27]/20">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172126]">No TDS requests found</h3>
                <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
                  No requests matched your search query or status filter. Try resetting your filter options.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#980e27] text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-[#7A0B1F] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
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
                          selectedIds.length === filteredRequests.length &&
                          filteredRequests.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                      />
                    </th>

                    {/* Reference & Customer */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider min-w-[200px]">
                      Customer & Reference
                    </th>

                    {/* Company */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Company
                    </th>

                    {/* Requested Product */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider min-w-[220px]">
                      Requested Product
                    </th>

                    {/* Request Date */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Request Date
                    </th>

                    {/* TDS Availability */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      TDS Document
                    </th>

                    {/* Delivery Status */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Delivery Status
                    </th>

                    {/* Actions */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredRequests.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setActiveRequest(item)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-[#FFF5F7]/40" : "hover:bg-[#F8FAFA]/80"
                        }`}
                      >
                        {/* Checkbox Row */}
                        <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(item.id, e)}
                            className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                          />
                        </td>

                        {/* Customer & Reference */}
                        <td className="py-4 px-5 text-sm font-medium text-[#172126]">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#172126] block">
                                {item.customerName}
                              </span>
                              <span className="font-mono text-[10px] text-[#980e27] bg-[#FFF5F7] px-1.5 py-0.5 rounded-sm border border-[#980e27]/15">
                                {item.referenceNumber}
                              </span>
                            </div>
                            <span className="text-xs text-[#64748B] block">
                              {item.customerEmail}
                            </span>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="py-4 px-5 text-xs font-semibold text-[#475569]">
                          <div className="flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-[#718096]" />
                            <span>{item.company}</span>
                          </div>
                        </td>

                        {/* Requested Product */}
                        <td className="py-4 px-5 text-xs">
                          <div className="space-y-1">
                            <span className="font-bold text-[#172126] block">
                              {item.productName}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[10px] font-semibold">
                              <Tag className="w-3 h-3 text-[#980e27]" />
                              {item.category}
                            </span>
                          </div>
                        </td>

                        {/* Request Date */}
                        <td className="py-4 px-5 text-xs text-[#64748B]">
                          {item.requestDate}
                        </td>

                        {/* TDS Availability Indicator */}
                        <td className="py-4 px-5 text-xs">
                          {item.tdsAvailable ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 text-[#087F5B] font-semibold bg-[#E6F4EA] px-2 py-0.5 rounded-full text-[11px] border border-[#087F5B]/20">
                                <FileText className="w-3 h-3" />
                                {item.tdsFileName}
                              </span>
                              <span className="text-[10px] text-[#718096] block font-mono pl-1">
                                Version {item.tdsVersion}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#E53E3E] font-semibold bg-[#FFF5F5] px-2 py-0.5 rounded-full text-[11px] border border-[#FEB2B2]">
                              <AlertTriangle className="w-3 h-3" />
                              No TDS Uploaded
                            </span>
                          )}
                        </td>

                        {/* Delivery Status Badges */}
                        <td className="py-4 px-5 text-sm">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.status === "Pending"
                                ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                                : item.status === "Sending"
                                ? "bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/20"
                                : item.status === "Sent"
                                ? "bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/20"
                                : "bg-[#FFF5F5] text-[#E53E3E] border border-[#FEB2B2]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === "Pending"
                                  ? "bg-[#D97706]"
                                  : item.status === "Sending"
                                  ? "bg-[#0369A1]"
                                  : item.status === "Sent"
                                  ? "bg-[#087F5B]"
                                  : "bg-[#E53E3E]"
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>

                        {/* Row Actions */}
                        <td className="py-4 px-5 text-sm text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setActiveRequest(item)}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors"
                              title="View Request Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSendTargetRequest(item)}
                              disabled={!item.tdsAvailable}
                              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                item.status === "Sent"
                                  ? "text-[#718096] hover:text-[#087F5B] hover:bg-[#E6F4EA]"
                                  : item.status === "Failed"
                                  ? "text-[#E53E3E] hover:bg-[#FFF5F5]"
                                  : "text-[#980e27] hover:bg-[#FFF5F7]"
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              title={
                                item.status === "Failed"
                                  ? "Retry Delivery"
                                  : item.status === "Sent"
                                  ? "Resend TDS"
                                  : "Send TDS to Email"
                              }
                            >
                              {item.status === "Failed" ? (
                                <RefreshCw className="w-4 h-4" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF5F5] rounded-md transition-colors"
                              title="Delete Request"
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
                Showing 1 to {filteredRequests.length} of {requests.length} requests
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

        {/* ========================================================================= */}
        {/* 5. REQUEST DETAILS SLIDE-OVER DRAWER                                     */}
        {/* ========================================================================= */}
        {activeRequest && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E7EB] overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFA]">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#980e27]" />
                  <div>
                    <h3 className="text-base font-bold text-[#172126]">
                      Request Ref #{activeRequest.referenceNumber}
                    </h3>
                    <span className="text-xs text-[#718096]">
                      Received on {activeRequest.requestDate}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveRequest(null)}
                  className="p-1.5 text-[#718096] hover:text-[#172126] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="p-6 space-y-6 flex-1">
                {/* Status Header Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    activeRequest.status === "Sent"
                      ? "bg-[#E6F4EA] border-[#087F5B]/20 text-[#087F5B]"
                      : activeRequest.status === "Failed"
                      ? "bg-[#FFF5F5] border-[#FEB2B2] text-[#E53E3E]"
                      : "bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {activeRequest.status === "Sent" ? (
                      <CheckCircle2 className="w-5 h-5 text-[#087F5B]" />
                    ) : activeRequest.status === "Failed" ? (
                      <AlertTriangle className="w-5 h-5 text-[#E53E3E]" />
                    ) : (
                      <Clock className="w-5 h-5 text-[#D97706]" />
                    )}
                    <div>
                      <span className="text-sm font-bold block">
                        Status: {activeRequest.status}
                      </span>
                      <span className="text-xs opacity-90">
                        {activeRequest.status === "Sent"
                          ? `Delivered on ${activeRequest.lastAttemptDate}`
                          : activeRequest.status === "Failed"
                          ? `Attempt failed on ${activeRequest.lastAttemptDate}`
                          : "Awaiting administrator dispatch"}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold bg-white/70 px-2 py-1 rounded-md">
                    Attempts: {activeRequest.attemptCount}
                  </span>
                </div>

                {/* Failure Reason Alert if Failed */}
                {activeRequest.status === "Failed" && activeRequest.failureReason && (
                  <div className="p-3 bg-[#FFF5F5] border border-[#FEB2B2] rounded-xl text-xs text-[#E53E3E] space-y-1">
                    <span className="font-bold block">Failure Log:</span>
                    <p>{activeRequest.failureReason}</p>
                  </div>
                )}

                {/* Customer Information Card */}
                <div className="bg-[#F8FAFA] p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                  <span className="text-xs font-bold text-[#172126] uppercase tracking-wider block">
                    Customer Information
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#718096] block">Full Name</span>
                      <span className="font-bold text-[#172126] text-sm">
                        {activeRequest.customerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#718096] block">Company</span>
                      <span className="font-semibold text-[#172126]">
                        {activeRequest.company}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#718096] block">Email Address</span>
                      <span className="font-semibold text-[#172126]">
                        {activeRequest.customerEmail}
                      </span>
                    </div>
                    {activeRequest.phone && (
                      <div>
                        <span className="text-[#718096] block">Phone Number</span>
                        <span className="font-semibold text-[#172126]">
                          {activeRequest.phone}
                        </span>
                      </div>
                    )}
                  </div>

                  {activeRequest.message && (
                    <div className="pt-2 border-t border-[#E5E7EB]">
                      <span className="text-[#718096] block text-[11px]">Customer Message:</span>
                      <p className="text-xs text-[#172126] mt-0.5 bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                        {activeRequest.message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Requested Product & TDS Info Card */}
                <div className="bg-[#F8FAFA] p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                  <span className="text-xs font-bold text-[#172126] uppercase tracking-wider block">
                    Product & TDS PDF Document Information
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#718096] block">Requested Product</span>
                      <span className="font-bold text-[#980e27] text-sm">
                        {activeRequest.productName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#718096] block">Category / Subcategory</span>
                      <span className="font-semibold text-[#172126]">
                        {activeRequest.category} ({activeRequest.subcategory})
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-[#980e27]" />
                      <div>
                        <span className="text-xs font-bold text-[#172126] block">
                          {activeRequest.tdsFileName}
                        </span>
                        <span className="text-[10px] text-[#718096] font-mono">
                          Document Version: {activeRequest.tdsVersion}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/documents/${activeRequest.tdsFileName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#FFF5F7] hover:bg-[#980e27] hover:text-white text-[#980e27] text-xs font-semibold rounded-lg border border-[#980e27]/20 transition-colors inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFA] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(activeRequest)}
                  className="px-4 py-2 bg-white hover:bg-[#FFF5F5] border border-[#FEB2B2] text-[#E53E3E] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Delete Request
                </button>

                <button
                  type="button"
                  onClick={() => setSendTargetRequest(activeRequest)}
                  disabled={!activeRequest.tdsAvailable}
                  className="px-5 py-2 bg-[#980e27] hover:bg-[#7A0B1F] disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {activeRequest.status === "Sent"
                      ? "Resend TDS Email"
                      : activeRequest.status === "Failed"
                      ? "Retry Send TDS"
                      : "Send TDS to Customer"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. SEND VERIFICATION CONFIRMATION MODAL                                  */}
        {/* ========================================================================= */}
        {sendTargetRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E5E7EB] shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center border border-[#980e27]/20 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172126]">
                    Confirm Email Delivery
                  </h3>
                  <p className="text-xs text-[#718096]">
                    Verify recipient email and attached product PDF document details before sending.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                  <span className="text-[#718096]">Recipient Email:</span>
                  <span className="font-bold text-[#172126]">
                    {sendTargetRequest.customerEmail}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                  <span className="text-[#718096]">Customer Name:</span>
                  <span className="font-semibold text-[#172126]">
                    {sendTargetRequest.customerName} ({sendTargetRequest.company})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E7EB]">
                  <span className="text-[#718096]">Requested Product:</span>
                  <span className="font-bold text-[#980e27]">
                    {sendTargetRequest.productName}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#718096]">Attached PDF Document:</span>
                  <span className="font-semibold text-[#172126] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#087F5B]" />
                    {sendTargetRequest.tdsFileName} ({sendTargetRequest.tdsVersion})
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#718096]">
                Clicking confirm will execute transactional server email dispatch with attached PDF.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSendTargetRequest(null)}
                  disabled={isSendingProcess}
                  className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-xl hover:bg-[#F8FAFA]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSendTds}
                  disabled={isSendingProcess}
                  className="px-5 py-2 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2"
                >
                  {isSendingProcess ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Send TDS</span>
                    </>
                  )}
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
                <h3 className="text-lg font-bold text-[#172126]">Delete TDS Request?</h3>
                <p className="text-xs text-[#718096] mt-1">
                  Are you sure you want to delete request reference <strong className="text-[#172126]">&quot;{deleteTarget.referenceNumber}&quot;</strong>? This action cannot be undone.
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
                  onClick={handleConfirmSingleDelete}
                  className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
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
                  Delete {selectedIds.length} Selected Requests?
                </h3>
                <p className="text-xs text-[#718096] mt-1">
                  Are you sure you want to delete all selected TDS requests?
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

        {/* ========================================================================= */}
        {/* 8. PUBLIC PRODUCT PAGE REQUEST TDS MODAL DEMO SIMULATION                  */}
        {/* ========================================================================= */}
        {isPublicModalDemoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#980e27]" />
                  <h3 className="text-base font-bold text-[#172126]">
                    Request Technical Data Sheet (TDS)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublicModalDemoOpen(false)}
                  className="p-1 text-[#718096] hover:text-[#172126]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {demoSubmitSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#087F5B] mx-auto" />
                  <h4 className="text-base font-bold text-[#172126]">{demoSubmitSuccess}</h4>
                  <p className="text-xs text-[#718096]">
                    Thank you! Our technical team will review your request and send the official TDS PDF to your email address shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePublicDemoSubmit} className="space-y-4 text-xs">
                  {/* Read-only Requested Product Name */}
                  <div className="p-3 rounded-xl bg-[#FFF5F7] border border-[#980e27]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#718096] uppercase font-semibold block">
                        Target Chemical Product
                      </span>
                      <span className="text-sm font-bold text-[#980e27]">VULCURE MBT</span>
                    </div>
                    <span className="text-[10px] text-[#087F5B] font-semibold bg-[#E6F4EA] px-2 py-0.5 rounded-full">
                      TDS Available
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-[#172126]">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={demoFormData.fullName}
                      onChange={(e) => setDemoFormData({ ...demoFormData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full h-9 px-3 bg-white text-xs rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-[#172126]">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={demoFormData.email}
                      onChange={(e) => setDemoFormData({ ...demoFormData, email: e.target.value })}
                      placeholder="ramesh@company.com"
                      className="w-full h-9 px-3 bg-white text-xs rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-semibold text-[#172126]">Company Name</label>
                      <input
                        type="text"
                        value={demoFormData.company}
                        onChange={(e) => setDemoFormData({ ...demoFormData, company: e.target.value })}
                        placeholder="Company Ltd"
                        className="w-full h-9 px-3 bg-white text-xs rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-semibold text-[#172126]">Phone Number</label>
                      <input
                        type="text"
                        value={demoFormData.phone}
                        onChange={(e) => setDemoFormData({ ...demoFormData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full h-9 px-3 bg-white text-xs rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-[#172126]">Application / Notes</label>
                    <textarea
                      rows={2}
                      value={demoFormData.message}
                      onChange={(e) => setDemoFormData({ ...demoFormData, message: e.target.value })}
                      placeholder="Brief note regarding intended application..."
                      className="w-full p-2 bg-white text-xs rounded-lg border border-[#DDE3E0] outline-hidden focus:border-[#980e27]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPublicModalDemoOpen(false)}
                      className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-lg hover:bg-[#F8FAFA]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
