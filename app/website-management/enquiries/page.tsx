"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "../../component/layout/Layout";
import BreadCrumbs from "../../component/common/BreadCrumbs";
import {
  Mail,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Copy,
  Eye,
  X,
  RotateCcw,
  User,
  Building,
  Calendar,
  MessageSquare,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Phone,
  FileSpreadsheet,
  Check,
  Tag,
  History,
  NotebookPen,
} from "lucide-react";

export interface EnquiryItem {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  company: string;
  subject: string;
  type: "Product Quote" | "Technical Support" | "General Enquiry" | "Sample Request";
  message: string;
  dateReceived: string;
  timestamp: number;
  status: "New" | "In Progress" | "Resolved" | "Archived";
  adminNotes?: string;
  historyLog: Array<{
    action: string;
    actor: string;
    timestamp: string;
  }>;
}

const initialEnquiries: EnquiryItem[] = [
  {
    id: "enq-101",
    customerName: "Rajesh Sharma",
    email: "rajesh.sharma@apollotyres.com",
    phone: "+91 98450 12345",
    company: "Apollo Tyres Ltd",
    subject: "Bulk Quote Request for Merchem CBS Accelerator (50 MT)",
    type: "Product Quote",
    message: "Respected Merchem Sales Team, we are interested in procuring 50 Metric Tonnes of Merchem CBS (N-Cyclohexyl-2-benzothiazolesulfenamide) for our Chennai manufacturing unit for Q4 production planning. Kindly share your best commercial terms, CIF Chennai port pricing, and TDS.",
    dateReceived: "01 Oct 2026, 14:30 PM",
    timestamp: 1790677800000,
    status: "New",
    adminNotes: "Assigned to Commercial Sales Team. Priority account.",
    historyLog: [
      { action: "Enquiry Received via Website Form", actor: "System", timestamp: "01 Oct 2026, 14:30 PM" },
    ],
  },
  {
    id: "enq-102",
    customerName: "Anand Viswanathan",
    email: "anand.v@mrft yres.com",
    phone: "+91 94440 88776",
    company: "MRF Limited",
    subject: "Technical Consultation for Low-Temperature Latex Dipping Line",
    type: "Technical Support",
    message: "We are optimizing our medical glove dipping line in Kottayam and require low-temperature ultra accelerators to minimize nitrosamine generation. Can your R&D team recommend suitable dithiocarbamates or xanthates?",
    dateReceived: "29 Sep 2026, 11:15 AM",
    timestamp: 1790508900000,
    status: "In Progress",
    adminNotes: "Sent technical dossier to Anand on 30 Sep. Awaiting feedback from R&D Lead.",
    historyLog: [
      { action: "Enquiry Received via Website Form", actor: "System", timestamp: "29 Sep 2026, 11:15 AM" },
      { action: "Status changed to In Progress", actor: "Nikhil Kumar", timestamp: "30 Sep 2026, 09:30 AM" },
    ],
  },
  {
    id: "enq-103",
    customerName: "Suresh Nair",
    email: "snair@tvssrichakra.com",
    phone: "+91 98940 33211",
    company: "TVS Srichakra Ltd",
    subject: "Sample Request: Antioxidant 6PPD & TMQ for Heavy Duty Tyres",
    type: "Sample Request",
    message: "Requesting 5 kg evaluation samples of Merchem 6PPD and Merchem TMQ for flex-fatigue and thermal ageing compound trials. Please send to our Madurai R&D center.",
    dateReceived: "26 Sep 2026, 16:45 PM",
    timestamp: 1790268300000,
    status: "Resolved",
    adminNotes: "Sample dispatch tracking #BLR-883492 delivered on 28 Sep.",
    historyLog: [
      { action: "Enquiry Received via Website Form", actor: "System", timestamp: "26 Sep 2026, 16:45 PM" },
      { action: "Status changed to In Progress", actor: "Nikhil Kumar", timestamp: "27 Sep 2026, 10:00 AM" },
      { action: "Status changed to Resolved", actor: "Nikhil Kumar", timestamp: "28 Sep 2026, 17:00 PM" },
    ],
  },
  {
    id: "enq-104",
    customerName: "Pooja Verma",
    email: "pooja.verma@kalyanipolymers.in",
    phone: "+91 97110 55432",
    company: "Kalyani Polymers",
    subject: "REACH & SVHC Compliance Declaration for Rubber Chemicals Export",
    type: "General Enquiry",
    message: "Our European customers require SVHC non-containment certificates and REACH registration numbers for Merchem TMTD and MBTS. Kindly provide official compliance documents.",
    dateReceived: "22 Sep 2026, 10:20 AM",
    timestamp: 1789900800000,
    status: "Resolved",
    adminNotes: "Emailed signed compliance certificates.",
    historyLog: [
      { action: "Enquiry Received via Website Form", actor: "System", timestamp: "22 Sep 2026, 10:20 AM" },
      { action: "Status changed to Resolved", actor: "Corporate Comms", timestamp: "23 Sep 2026, 14:00 PM" },
    ],
  },
  {
    id: "enq-105",
    customerName: "Vikramaditya Roy",
    email: "v.roy@ceat.com",
    phone: "+91 98200 77123",
    company: "CEAT Limited",
    subject: "Custom Accelerator Pre-blend Formulations for Green Tyre Tread",
    type: "Product Quote",
    message: "We are exploring masterbatch pre-blends of sulfenamide accelerators with organosilane coupling agents for low rolling resistance tread compounds. Please advise if Merchem offers customized masterbatch compounding.",
    dateReceived: "18 Sep 2026, 15:10 PM",
    timestamp: 1789571400000,
    status: "Archived",
    adminNotes: "Archived after technical clarification.",
    historyLog: [
      { action: "Enquiry Received via Website Form", actor: "System", timestamp: "18 Sep 2026, 15:10 PM" },
      { action: "Status changed to Archived", actor: "Nikhil Kumar", timestamp: "20 Sep 2026, 11:00 AM" },
    ],
  },
];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "New" | "In Progress" | "Resolved" | "Archived">("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [dateRange, setDateRange] = useState<string>("All");

  // Selection Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selected Enquiry Drawer State
  const [activeEnquiry, setActiveEnquiry] = useState<EnquiryItem | null>(null);
  const [noteInput, setNoteInput] = useState("");

  // Modals & Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<EnquiryItem | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // KPI Summary Stats
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === "New").length;
    const inProgressCount = enquiries.filter((e) => e.status === "In Progress").length;
    const resolvedCount = enquiries.filter((e) => e.status === "Resolved").length;
    return { total, newCount, inProgressCount, resolvedCount };
  }, [enquiries]);

  // Derived Filtered List
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesSearch =
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      const matchesType =
        selectedType === "All" || item.type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [enquiries, searchQuery, selectedStatus, selectedType]);

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedType("All");
    setDateRange("All");
  };

  // Selection Checkbox Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredEnquiries.map((e) => e.id));
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

  // Status Change Handler
  const handleUpdateStatus = (
    id: string,
    newStatus: "New" | "In Progress" | "Resolved" | "Archived"
  ) => {
    setEnquiries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedHistory = [
            ...item.historyLog,
            {
              action: `Status updated to ${newStatus}`,
              actor: "Nikhil Kumar",
              timestamp: "Just now",
            },
          ];
          return { ...item, status: newStatus, historyLog: updatedHistory };
        }
        return item;
      })
    );

    if (activeEnquiry?.id === id) {
      setActiveEnquiry((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              historyLog: [
                ...prev.historyLog,
                {
                  action: `Status updated to ${newStatus}`,
                  actor: "Nikhil Kumar",
                  timestamp: "Just now",
                },
              ],
            }
          : null
      );
    }

    showToast(`Enquiry status updated to "${newStatus}"`);
  };

  // Bulk Status Change
  const handleBulkStatusChange = (
    newStatus: "In Progress" | "Resolved" | "Archived"
  ) => {
    setEnquiries((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            status: newStatus,
            historyLog: [
              ...item.historyLog,
              {
                action: `Bulk status updated to ${newStatus}`,
                actor: "Nikhil Kumar",
                timestamp: "Just now",
              },
            ],
          };
        }
        return item;
      })
    );
    setSelectedIds([]);
    showToast(`Bulk updated ${selectedIds.length} enquiry(ies) to "${newStatus}"`);
  };

  // Save Admin Internal Notes
  const handleSaveNotes = () => {
    if (!activeEnquiry || !noteInput.trim()) return;
    setEnquiries((prev) =>
      prev.map((e) => (e.id === activeEnquiry.id ? { ...e, adminNotes: noteInput.trim() } : e))
    );
    setActiveEnquiry((prev) => (prev ? { ...prev, adminNotes: noteInput.trim() } : null));
    showToast("Internal admin note saved!");
  };

  // Single Delete Confirm
  const handleConfirmSingleDelete = () => {
    if (!deleteTarget) return;
    setEnquiries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    if (activeEnquiry?.id === deleteTarget.id) {
      setActiveEnquiry(null);
    }
    showToast(`Deleted enquiry from ${deleteTarget.customerName}`);
    setDeleteTarget(null);
  };

  // Bulk Delete Confirm
  const handleConfirmBulkDelete = () => {
    setEnquiries((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
    showToast("Selected enquiries deleted successfully!");
  };

  // Copy Customer Email
  const handleCopyEmail = (email: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(email);
    showToast(`Copied ${email} to clipboard!`);
  };

  // Export Enquiries as CSV
  const handleExportCSV = () => {
    const headers = ["ID,Customer Name,Email,Company,Subject,Type,Status,Date Received\n"];
    const rows = filteredEnquiries.map(
      (e) =>
        `"${e.id}","${e.customerName}","${e.email}","${e.company}","${e.subject.replace(
          /"/g,
          '""'
        )}","${e.type}","${e.status}","${e.dateReceived}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Merchem_Enquiries_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported enquiries CSV successfully!");
  };

  return (
    <DashboardLayout activeNavId="enquiries">
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
                { label: "Enquiries" },
              ]}
            />

            {/* Title & Description */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              Website Enquiries
            </h1>
            <p className="text-sm text-[#718096] mt-0.5">
              Manage customer enquiries submitted through the Merchem website and track follow-up activity.
            </p>
          </div>

          {/* Export Action Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFA] text-[#172126] text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#087F5B]" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUMMARY KPI CARDS                                                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Enquiries */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#172126] border border-[#E5E7EB]">
              <Mail className="w-5 h-5 text-[#64748B]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Total Enquiries
              </span>
            </div>
          </div>

          {/* Card 2: New Enquiries */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#2563EB] border border-[#E5E7EB]">
              <MessageSquare className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.newCount}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                New Submissions
              </span>
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#D97706] border border-[#E5E7EB]">
              <Clock className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.inProgressCount}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                In Progress
              </span>
            </div>
          </div>

          {/* Card 4: Resolved */}
          <div className="bg-white p-4.5 rounded-lg border border-[#E5E7EB] shadow-2xs flex items-center gap-4">
            <div className="p-3 rounded-md bg-[#F8FAFC] text-[#15803D] border border-[#E5E7EB]">
              <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#172126] block leading-tight">
                {stats.resolvedCount}
              </span>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Resolved
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
                placeholder="Search by customer name, email, company or subject..."
                className="w-full h-10 pl-10 pr-4 bg-[#F3F5F6] text-sm text-[#172126] placeholder-[#718096] rounded-lg border border-transparent outline-hidden focus:border-[#980e27] focus:bg-white focus:ring-2 focus:ring-[#980e27]/20 transition-all"
              />
            </div>

            {/* Filter Controls Right */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Filter className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Enquiry Type Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Tag className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Enquiry Types</option>
                  <option value="Product Quote">Product Quote</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Sample Request">Sample Request</option>
                  <option value="General Enquiry">General Enquiry</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center gap-1.5 bg-[#F3F5F6] px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E7EB]">
                <Calendar className="w-3.5 h-3.5 text-[#718096]" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent text-xs font-medium text-[#172126] outline-hidden cursor-pointer"
                >
                  <option value="All">All Dates</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>
              </div>

              {/* Reset Filters */}
              {(searchQuery || selectedStatus !== "All" || selectedType !== "All" || dateRange !== "All") && (
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
                {selectedIds.length} enquiry(ies) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkStatusChange("Resolved")}
                  className="px-2.5 py-1 bg-white hover:bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/30 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Mark as Resolved
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkStatusChange("Archived")}
                  className="px-2.5 py-1 bg-white hover:bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Archive Selected
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
        {/* 4. ENQUIRIES DATA TABLE                                                   */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          {filteredEnquiries.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center mx-auto border border-[#980e27]/20">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172126]">No customer enquiries found</h3>
                <p className="text-xs text-[#718096] mt-1 max-w-sm mx-auto">
                  No submissions matched your search criteria or filters. Try resetting your search or filter values.
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
                          selectedIds.length === filteredEnquiries.length &&
                          filteredEnquiries.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded-xs border-[#DDE3E0] text-[#980e27] focus:ring-[#980e27]/20 accent-[#980e27] cursor-pointer"
                      />
                    </th>

                    {/* Customer */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider min-w-[200px]">
                      Customer
                    </th>

                    {/* Company */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Company
                    </th>

                    {/* Subject & Type */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider min-w-[280px]">
                      Subject Line
                    </th>

                    {/* Date Received */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Date Received
                    </th>

                    {/* Status */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                      Status
                    </th>

                    {/* Actions */}
                    <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filteredEnquiries.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setActiveEnquiry(item);
                          setNoteInput(item.adminNotes || "");
                        }}
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

                        {/* Customer Info */}
                        <td className="py-4 px-5 text-sm font-medium text-[#172126]">
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#172126] block leading-snug">
                              {item.customerName}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-[#64748B]">
                              <span>{item.email}</span>
                              <button
                                type="button"
                                onClick={(e) => handleCopyEmail(item.email, e)}
                                className="p-0.5 hover:text-[#980e27] rounded-sm transition-colors"
                                title="Copy Email Address"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="py-4 px-5 text-xs font-semibold text-[#475569]">
                          <div className="flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-[#718096]" />
                            <span>{item.company}</span>
                          </div>
                        </td>

                        {/* Subject & Type */}
                        <td className="py-4 px-5 text-xs">
                          <div className="space-y-1 max-w-sm">
                            <span className="font-bold text-[#172126] block truncate">
                              {item.subject}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[10px] font-semibold">
                              <Tag className="w-3 h-3 text-[#980e27]" />
                              {item.type}
                            </span>
                          </div>
                        </td>

                        {/* Date Received */}
                        <td className="py-4 px-5 text-xs text-[#64748B]">
                          {item.dateReceived}
                        </td>

                        {/* Status Badges */}
                        <td className="py-4 px-5 text-sm">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.status === "New"
                                ? "bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/20"
                                : item.status === "In Progress"
                                ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                                : item.status === "Resolved"
                                ? "bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/20"
                                : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === "New"
                                  ? "bg-[#0369A1]"
                                  : item.status === "In Progress"
                                  ? "bg-[#D97706]"
                                  : item.status === "Resolved"
                                  ? "bg-[#087F5B]"
                                  : "bg-[#64748B]"
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>

                        {/* Row Actions Menu */}
                        <td className="py-4 px-5 text-sm text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveEnquiry(item);
                                setNoteInput(item.adminNotes || "");
                              }}
                              className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(item.id, "Resolved")}
                              className="p-1.5 text-[#718096] hover:text-[#087F5B] hover:bg-[#E6F4EA] rounded-md transition-colors"
                              title="Mark as Resolved"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF5F5] rounded-md transition-colors"
                              title="Delete Enquiry"
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
                Showing 1 to {filteredEnquiries.length} of {enquiries.length} enquiries
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
        {/* 5. ENQUIRY DETAILS SLIDE-OVER DRAWER                                     */}
        {/* ========================================================================= */}
        {activeEnquiry && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E7EB] overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFA]">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#980e27]" />
                  <div>
                    <h3 className="text-base font-bold text-[#172126]">
                      Enquiry #{activeEnquiry.id}
                    </h3>
                    <span className="text-xs text-[#718096]">
                      Received on {activeEnquiry.dateReceived}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveEnquiry(null)}
                  className="p-1.5 text-[#718096] hover:text-[#172126] hover:bg-[#E5E7EB] rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Main Body */}
              <div className="p-6 space-y-6 flex-1">
                {/* Customer Contact Card */}
                <div className="bg-[#F8FAFA] p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#172126] uppercase tracking-wider">
                      Customer Information
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        activeEnquiry.status === "New"
                          ? "bg-[#E0F2FE] text-[#0369A1]"
                          : activeEnquiry.status === "In Progress"
                          ? "bg-[#FEF3C7] text-[#D97706]"
                          : activeEnquiry.status === "Resolved"
                          ? "bg-[#E6F4EA] text-[#087F5B]"
                          : "bg-[#F1F5F9] text-[#64748B]"
                      }`}
                    >
                      {activeEnquiry.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#718096] block">Customer Name</span>
                      <span className="font-bold text-[#172126] text-sm">
                        {activeEnquiry.customerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#718096] block">Company Name</span>
                      <span className="font-semibold text-[#172126]">
                        {activeEnquiry.company}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#718096] block">Email Address</span>
                      <div className="flex items-center gap-1.5 font-medium text-[#172126]">
                        <span className="truncate">{activeEnquiry.email}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(activeEnquiry.email)}
                          className="p-1 text-[#980e27] hover:bg-[#FFF5F7] rounded-md cursor-pointer"
                          title="Copy Email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {activeEnquiry.phone && (
                      <div>
                        <span className="text-[#718096] block">Phone Number</span>
                        <span className="font-medium text-[#172126]">
                          {activeEnquiry.phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject & Full Message Body */}
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">
                      Enquiry Subject Line
                    </span>
                    <h4 className="text-sm font-bold text-[#172126] mt-0.5">
                      {activeEnquiry.subject}
                    </h4>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block mb-1.5">
                      Message Content
                    </span>
                    <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] text-xs text-[#172126] leading-relaxed whitespace-pre-wrap">
                      {activeEnquiry.message}
                    </div>
                  </div>
                </div>

                {/* Internal Admin Notes Section */}
                <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#172126] uppercase tracking-wider flex items-center gap-1.5">
                      <NotebookPen className="w-4 h-4 text-[#980e27]" />
                      <span>Internal Admin Notes</span>
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add private staff notes or follow-up status instructions..."
                    className="w-full p-3 bg-white text-xs text-[#172126] rounded-xl border border-[#DDE3E0] outline-hidden focus:border-[#980e27] focus:ring-2 focus:ring-[#980e27]/20"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-4 py-2 bg-[#172126] hover:bg-[#2D3748] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Save Internal Note
                  </button>
                </div>

                {/* Follow-up Activity History Timeline */}
                <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
                  <span className="text-xs font-bold text-[#172126] uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-4 h-4 text-[#980e27]" />
                    <span>Follow-Up Activity Timeline</span>
                  </span>
                  <div className="space-y-2 text-xs">
                    {activeEnquiry.historyLog.map((log, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#F8FAFA] rounded-lg border border-[#E5E7EB] flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-[#172126] block">
                            {log.action}
                          </span>
                          <span className="text-[11px] text-[#718096]">
                            By {log.actor}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#94A3B8]">
                          {log.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-[#E5E7EB] bg-[#F8FAFA] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeEnquiry.id, "In Progress")}
                    className="px-3 py-2 bg-white hover:bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/30 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeEnquiry.id, "Resolved")}
                    className="px-3 py-2 bg-[#087F5B] hover:bg-[#066649] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(activeEnquiry.id, "Archived")}
                    className="px-3 py-2 bg-white hover:bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(activeEnquiry)}
                    className="px-3 py-2 bg-white hover:bg-[#FFF5F5] border border-[#FEB2B2] text-[#E53E3E] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. CONFIRM DELETE MODALS                                                  */}
        {/* ========================================================================= */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#E53E3E] flex items-center justify-center border border-[#FEB2B2]">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172126]">Delete Customer Enquiry?</h3>
                <p className="text-xs text-[#718096] mt-1">
                  Are you sure you want to delete the enquiry from <strong className="text-[#172126]">&quot;{deleteTarget.customerName}&quot;</strong>? This action cannot be undone.
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
                  Delete {selectedIds.length} Selected Enquiries?
                </h3>
                <p className="text-xs text-[#718096] mt-1">
                  Are you sure you want to delete all selected enquiries?
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
