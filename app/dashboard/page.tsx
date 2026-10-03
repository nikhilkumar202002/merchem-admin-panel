"use client";

import React from "react";
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
  FilePlus,
  Mail,
  ChevronRight,
  Edit2,
  Eye,
  Activity,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  ArrowUpRight,
  FileCheck,
} from "lucide-react";

export default function DashboardPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardLayout activeNavId="dashboard">
      <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
        {/* ========================================================================= */}
        {/* 1. CONTENT HEADER AREA                                                    */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <BreadCrumbs items={[{ label: "Dashboard" }]} />

            {/* Page Heading & Subtitle */}
            <h1 className="text-2xl font-bold text-[#172126] tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Welcome back. Overview of Merchem India&apos;s chemical catalogue and website operation.
            </p>
          </div>

          {/* Date Indicator Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-md text-xs font-medium text-[#475569] shadow-2xs self-start sm:self-auto">
            <Calendar className="w-4 h-4 text-[#087F5B]" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. OVERVIEW STATISTIC (KPI) CARDS                                         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Card 1: Total Products */}
          <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-2xs hover:border-[#E5E7EB] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Products
              </span>
              <div className="p-2 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                86
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Chemical items
              </p>
            </div>
          </div>

          {/* Card 2: Main Categories */}
          <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-2xs hover:border-[#E5E7EB] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Main Categories
              </span>
              <div className="p-2 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                6
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Category groups
              </p>
            </div>
          </div>

          {/* Card 3: Subcategories */}
          <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-2xs hover:border-[#E5E7EB] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Subcategories
              </span>
              <div className="p-2 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                24
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Sub-groups
              </p>
            </div>
          </div>

          {/* Card 4: TDS Requests */}
          <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-2xs hover:border-[#E5E7EB] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                TDS Requests
              </span>
              <div className="p-2 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                14
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Pending dispatch
              </p>
            </div>
          </div>

          {/* Card 5: Enquiries */}
          <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-2xs hover:border-[#E5E7EB] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Enquiries
              </span>
              <div className="p-2 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                32
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Product enquiries
              </p>
            </div>
          </div>

          {/* Card 6: Blogs */}
          <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-2xs hover:border-[#E5E7EB] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                Blogs
              </span>
              <div className="p-2 rounded-md bg-[#F8FAFC] text-[#64748B] border border-[#E5E7EB]">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-bold text-[#172126] tracking-tight">
                18
              </span>
              <p className="text-[11px] text-[#64748B] mt-0.5 font-normal">
                Articles published
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. RECENT ACTIVITY & QUICK ACTIONS                                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Recent Activity (2 Cols on lg) */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-[#E5E7EB] shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#087F5B]" />
                <h2 className="text-sm font-bold text-[#172126]">
                  Recent Activity
                </h2>
              </div>
              <span className="text-xs text-[#64748B]">Updated live</span>
            </div>

            {/* Activity List Timeline */}
            <div className="space-y-3">
              {[
                {
                  icon: Package,
                  text: 'Product "VULCURE MBT" updated',
                  time: "15 mins ago",
                },
                {
                  icon: FileText,
                  text: "New blog article 'Optimizing Vulcanization in Latex' created",
                  time: "1 hour ago",
                },
                {
                  icon: Layers,
                  text: 'Main category "Rubber Accelerators" updated',
                  time: "3 hours ago",
                },
                {
                  icon: ImageIcon,
                  text: "Product technical sheet image added to media library",
                  time: "5 hours ago",
                },
                {
                  icon: MessageSquare,
                  text: "New product enquiry received from ABC Pharma Ltd.",
                  time: "Yesterday",
                },
              ].map((act, index) => {
                const Icon = act.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 p-2.5 rounded-md hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-md bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/10 shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#172126] leading-snug">
                          {act.text}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-[#64748B]" />
                          <span className="text-[11px] text-[#64748B]">
                            {act.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-xs font-semibold text-[#087F5B] hover:underline shrink-0 cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Quick Actions (1 Col on lg) */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-2xs p-5 flex flex-col justify-between">
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
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:border-[#087F5B] hover:bg-[#E6F4EA]/30 text-[#172126] hover:text-[#087F5B] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-4 h-4 text-[#087F5B] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Add Product</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#087F5B] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/product/main-categories"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:border-[#087F5B] hover:bg-[#E6F4EA]/30 text-[#172126] hover:text-[#087F5B] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderPlus className="w-4 h-4 text-[#087F5B] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Add Category</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#087F5B] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/blog/add-blog"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:border-[#087F5B] hover:bg-[#E6F4EA]/30 text-[#172126] hover:text-[#087F5B] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FilePlus className="w-4 h-4 text-[#087F5B] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">Add Blog</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#087F5B] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/website-management/tds-requests"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:border-[#087F5B] hover:bg-[#E6F4EA]/30 text-[#172126] hover:text-[#087F5B] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4 text-[#087F5B] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold">View TDS Requests</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#087F5B] group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>

            {/* Support Note */}
            <div className="mt-5 pt-3 border-t border-[#E5E7EB] text-center">
              <p className="text-[11px] text-[#64748B]">
                Merchem India Pvt. Ltd. Admin System v1.0
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. PRODUCT OVERVIEW SECTION TABLE                                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#172126]">
                Recent Products
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Recently updated chemical catalogue items
              </p>
            </div>

            <Link
              href="/product/all-products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#087F5B] hover:underline cursor-pointer"
            >
              <span>View All Products</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Responsive Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                  <th className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Product
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Subcategory
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[
                  {
                    name: "VULCURE MBT",
                    category: "Accelerators",
                    subcategory: "Thiazoles",
                    status: "Active",
                    date: "Oct 03, 2026",
                  },
                  {
                    name: "VULCURE MBTS",
                    category: "Accelerators",
                    subcategory: "Thiazoles",
                    status: "Active",
                    date: "Sep 30, 2026",
                  },
                  {
                    name: "PRODUCT A",
                    category: "Agrochemical Intermediates",
                    subcategory: "—",
                    status: "Active",
                    date: "Sep 28, 2026",
                  },
                  {
                    name: "VULCURE ZDC",
                    category: "Accelerators",
                    subcategory: "Dithiocarbamates",
                    status: "Active",
                    date: "Sep 25, 2026",
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors h-[56px]">
                    <td className="py-3.5 px-4 text-xs font-semibold text-[#172126]">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#172126]">
                      {row.category}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#64748B]">
                      {row.subcategory}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D]">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#64748B]">
                      {row.date}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href="/product/all-products"
                          className="p-1.5 text-[#64748B] hover:text-[#087F5B] hover:bg-[#E6F4EA] rounded-md transition-colors cursor-pointer"
                          aria-label="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/product/all-products"
                          className="p-1.5 text-[#64748B] hover:text-[#172126] hover:bg-[#F8FAFC] rounded-md transition-colors cursor-pointer"
                          aria-label="View product"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}