"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "../component/layout/Layout";
import BreadCrumbs from "../component/common/BreadCrumbs";
import {
  Layers,
  FolderTree,
  Package,
  FileText,
  Calendar,
  Clock,
  PlusCircle,
  FolderPlus,
  Mail,
  ChevronRight,
  Edit2,
  Activity,
  ArrowUpRight,
  FileCheck,
  Users,
  Loader2,
  Globe,
  Trash2,
  BookOpen,
} from "lucide-react";

import { getDashboardApi } from "@/app/utils/dashboard";
import { isAuthenticated } from "@/app/utils/auth";

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "Just now";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const renderActivityIcon = (iconType?: string) => {
  switch (iconType) {
    case "trash-2":
    case "trash":
    case "blog_deleted":
      return <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />;
    case "file-edit":
    case "blog_updated":
      return <Edit2 className="w-3.5 h-3.5 text-[#D97706]" />;
    case "globe":
    case "blog_published":
      return <Globe className="w-3.5 h-3.5 text-[#059669]" />;
    case "file-check":
    case "tds":
      return <FileCheck className="w-3.5 h-3.5 text-[#D97706]" />;
    case "mail":
    case "enquiry":
    case "enquiry_created":
      return <Mail className="w-3.5 h-3.5 text-[#2563EB]" />;
    default:
      return <Activity className="w-3.5 h-3.5 text-[#980e27]" />;
  }
};

const getActivityBadgeBg = (iconType?: string) => {
  switch (iconType) {
    case "trash-2":
    case "trash":
    case "blog_deleted":
      return "bg-[#FEF2F2] border-[#DC2626]/10";
    case "file-edit":
    case "blog_updated":
      return "bg-[#FEF3C7] border-[#D97706]/10";
    case "globe":
    case "blog_published":
      return "bg-[#E6F4EA] border-[#087F5B]/10";
    case "file-check":
    case "tds":
      return "bg-[#FEF3C7] border-[#D97706]/10";
    case "mail":
    case "enquiry":
    case "enquiry_created":
      return "bg-[#EFF6FF] border-[#2563EB]/10";
    default:
      return "bg-[#FFF5F7] border-[#980e27]/10";
  }
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      if (!isAuthenticated()) return;
      setLoading(true);
      try {
        const res = await getDashboardApi();
        if (isMounted && res) {
          const data = res.data || res;
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  // Consolidate recent activity items from recent_notifications, recent_enquiries, and recent_tds_requests
  const getActivityItems = () => {
    if (!dashboardData) return [];
    const items: any[] = [];
    const seenKeys = new Set<string>();

    // 1. Recent Notifications
    if (Array.isArray(dashboardData.recent_notifications)) {
      dashboardData.recent_notifications.forEach((notif: any) => {
        const key = `notif-${notif.id}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          items.push({
            id: key,
            title: notif.title || "Notification",
            message: notif.message,
            date: notif.created_at,
            url: notif.action_url || "#",
            iconType: notif.icon || notif.type,
          });
        }
      });
    }

    // 2. Recent Enquiries (if not redundant)
    if (Array.isArray(dashboardData.recent_enquiries)) {
      dashboardData.recent_enquiries.forEach((enq: any) => {
        const key = `enq-${enq.id}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          items.push({
            id: key,
            title: `New enquiry from ${enq.full_name || enq.name || "Customer"}`,
            message: `${enq.company_name || "Company"} - ${enq.subject || enq.enquiry_type || "Enquiry"}`,
            date: enq.created_at,
            url: "/website-management/enquiries",
            iconType: "enquiry_created",
          });
        }
      });
    }

    // 3. Recent TDS Requests (if not redundant)
    if (Array.isArray(dashboardData.recent_tds_requests)) {
      dashboardData.recent_tds_requests.forEach((tds: any) => {
        const key = `tds-${tds.id}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          items.push({
            id: key,
            title: `TDS requested for ${tds.product?.name || "Product"}`,
            message: `Requested by ${tds.name || tds.email || "User"}`,
            date: tds.created_at,
            url: "/website-management/tds-requests",
            iconType: "tds",
          });
        }
      });
    }

    // Sort by date descending
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const activityItems = getActivityItems();

  return (
    <DashboardLayout activeNavId="dashboard">
      <div className="space-y-6 w-full pb-12 select-none">
        {/* ========================================================================= */}
        {/* 1. CONTENT HEADER AREA                                                    */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <BreadCrumbs items={[{ label: "Dashboard" }]} />
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Welcome back. Overview of Merchem India&apos;s chemical catalogue, requests, and administration.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-medium text-[#475569] shadow-2xs self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-[#980e27]" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. OVERVIEW STATISTIC (KPI) CARDS                                         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {/* Card 1: Total Products */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#980e27]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Products
              </span>
              <div className="p-2 rounded-lg bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                {loading ? "..." : (dashboardData?.stats?.products?.total ?? 0)}
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Chemical items
              </p>
            </div>
          </div>

          {/* Card 2: Main Categories */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#0369A1]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Categories
              </span>
              <div className="p-2 rounded-lg bg-[#E0F2FE] text-[#0369A1] border border-[#0369A1]/10">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                {loading ? "..." : (dashboardData?.stats?.categories?.total ?? 0)}
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Category groups
              </p>
            </div>
          </div>

          {/* Card 3: Subcategories */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#087F5B]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Subcategories
              </span>
              <div className="p-2 rounded-lg bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/10">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                {loading ? "..." : (dashboardData?.stats?.subcategories?.total ?? 0)}
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Sub-groups
              </p>
            </div>
          </div>

          {/* Card 4: TDS Requests */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#D97706]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                TDS Requests
              </span>
              <div className="p-2 rounded-lg bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/10">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                {loading ? "..." : (dashboardData?.stats?.tds_requests?.total ?? dashboardData?.stats?.tds?.total ?? 0)}
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Total requests
              </p>
            </div>
          </div>

          {/* Card 5: Enquiries */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#2563EB]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Enquiries
              </span>
              <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/10">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                {loading ? "..." : (dashboardData?.stats?.enquiries?.total ?? 0)}
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Customer forms
              </p>
            </div>
          </div>

          {/* Card 6: Blogs */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#DB2777]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Blogs
              </span>
              <div className="p-2 rounded-lg bg-[#FDF2F8] text-[#DB2777] border border-[#DB2777]/10">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                {loading ? "..." : (dashboardData?.stats?.blogs?.total ?? 0)}
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Published & drafts
              </p>
            </div>
          </div>

          {/* Card 7: Admin Users */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#7C3AED]/30 transition-all col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Admin Users
              </span>
              <div className="p-2 rounded-lg bg-[#F5F3FF] text-[#7C3AED] border border-[#7C3AED]/10">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                {loading ? "..." : (dashboardData?.stats?.users?.total ?? 0)}
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Active accounts
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. RECENT ACTIVITY & QUICK ACTIONS                                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Recent Activity (2 Cols on lg) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#980e27]" />
                <h2 className="text-sm font-bold text-[#172126]">
                  Recent Activity & Submissions
                </h2>
              </div>
              <span className="text-xs text-[#64748B]">Updated live</span>
            </div>

            {/* Activity List Timeline */}
            <div className="space-y-3">
              {loading ? (
                <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-xs text-[#718096]">
                  <Loader2 className="w-5 h-5 animate-spin text-[#980e27]" />
                  <span>Loading recent activity...</span>
                </div>
              ) : activityItems.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#718096]">
                  No recent activity recorded yet.
                </div>
              ) : (
                activityItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 p-2.5 rounded-lg hover:bg-[#F8FAFA] transition-colors border border-transparent hover:border-[#E5E7EB]"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-1.5 rounded-md border shrink-0 mt-0.5 ${getActivityBadgeBg(
                          item.iconType
                        )}`}
                      >
                        {renderActivityIcon(item.iconType)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#172126] leading-snug">
                          {item.title}
                        </p>
                        {item.message && (
                          <p className="text-[11px] text-[#64748B] mt-0.5">
                            {item.message}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3 text-[#94A3B8]" />
                          <span className="text-[11px] text-[#94A3B8]">
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.url && item.url !== "#" && (
                      <Link
                        href={item.url}
                        className="text-xs font-semibold text-[#980e27] hover:underline shrink-0"
                      >
                        View
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Quick Actions (1 Col on lg) */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-5 flex flex-col justify-between">
            <div>
              <div className="pb-3 mb-4 border-b border-[#E5E7EB]">
                <h2 className="text-sm font-bold text-[#172126]">
                  Quick Actions
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Shortcuts for common management operations
                </p>
              </div>

              {/* Action Buttons Stack */}
              <div className="space-y-2.5">
                <Link
                  href="/product/all-products"
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] hover:border-[#980e27] hover:bg-[#FFF5F7]/40 text-[#172126] hover:text-[#980e27] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4 text-[#980e27] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Manage Products</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#980e27] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/product/main-categories"
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] hover:border-[#980e27] hover:bg-[#FFF5F7]/40 text-[#172126] hover:text-[#980e27] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderPlus className="w-4 h-4 text-[#980e27] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Manage Categories</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#980e27] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/website-management/tds-requests"
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] hover:border-[#980e27] hover:bg-[#FFF5F7]/40 text-[#172126] hover:text-[#980e27] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-[#980e27] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">View TDS Requests</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#980e27] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/website-management/enquiries"
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E5E7EB] hover:border-[#980e27] hover:bg-[#FFF5F7]/40 text-[#172126] hover:text-[#980e27] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#980e27] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">View Customer Enquiries</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#980e27] group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>

            {/* Support Note */}
            <div className="mt-5 pt-3 border-t border-[#E5E7EB] text-center">
              <p className="text-[11px] text-[#64748B]">
                Merchem India Pvt. Ltd. Admin System
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. PRODUCT OVERVIEW SECTION TABLE                                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172126]">
                Recent Chemical Products
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Latest products from the Merchem India catalogue
              </p>
            </div>

            <Link
              href="/product/all-products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#980e27] hover:underline cursor-pointer"
            >
              <span>View All Products</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Responsive Data Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-xs text-[#718096]">
                <Loader2 className="w-5 h-5 animate-spin text-[#980e27]" />
                <span>Loading products...</span>
              </div>
            ) : !(dashboardData?.recent_products?.length) ? (
              <div className="py-12 text-center text-xs text-[#718096]">
                No chemical products found in catalogue.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFA] border-b border-[#E5E7EB]">
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {dashboardData.recent_products.map((prod: any, idx: number) => {
                    const categoryName =
                      prod.category?.name ||
                      prod.category_name ||
                      prod.category ||
                      "—";
                    const subcategoryName =
                      prod.subcategory?.name ||
                      prod.subcategory_name ||
                      prod.subcategory ||
                      "—";
                    const statusText =
                      (prod.status || "").toLowerCase() === "inactive"
                        ? "Inactive"
                        : "Active";

                    return (
                      <tr
                        key={prod.id || idx}
                        className="hover:bg-[#F8FAFA] transition-colors h-[52px]"
                      >
                        <td className="py-3 px-4 text-xs font-bold text-[#172126]">
                          {prod.name || prod.title}
                        </td>
                        <td className="py-3 px-4 text-xs text-[#172126]">
                          {categoryName}
                        </td>
                        <td className="py-3 px-4 text-xs text-[#64748B]">
                          {subcategoryName}
                        </td>
                        <td className="py-3 px-4 text-xs">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              statusText === "Active"
                                ? "bg-[#E6F4EA] text-[#087F5B]"
                                : "bg-[#F1F5F9] text-[#64748B]"
                            }`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#64748B]">
                          {formatDate(prod.created_at || prod.updated_at)}
                        </td>
                        <td className="py-3 px-4 text-xs text-[#172126] text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href="/product/all-products"
                              className="p-1.5 text-[#64748B] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}