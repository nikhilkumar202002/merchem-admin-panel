"use client";

import React from "react";
import Link from "next/link";
import DashboardLayout from "../component/layout/Layout";
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
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* ========================================================================= */}
        {/* 1. CONTENT HEADER AREA                                                    */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#718096] mb-1.5 font-medium">
              <Link href="/" className="hover:text-[#980e27] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#980e27] font-semibold">Dashboard</span>
            </div>

            {/* Page Heading & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#172126] tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Welcome back, Nikhil. Here's an overview of your website content and activity.
            </p>
          </div>

          {/* Date Indicator Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-medium text-[#475569] shadow-2xs self-start md:self-auto">
            <Calendar className="w-4 h-4 text-[#980e27]" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. OVERVIEW STATISTIC (KPI) CARDS — 4 COLUMNS                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Main Categories */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#980e27]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Main Categories
              </span>
              <div className="p-2.5 rounded-lg bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#172126] tracking-tight">
                6
              </span>
              <p className="text-xs text-[#64748B] mt-1 font-medium">
                Product category groups
              </p>
            </div>
          </div>

          {/* Card 2: Subcategories */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#980e27]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Subcategories
              </span>
              <div className="p-2.5 rounded-lg bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
                <FolderTree className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#172126] tracking-tight">
                24
              </span>
              <p className="text-xs text-[#64748B] mt-1 font-medium">
                Across all main categories
              </p>
            </div>
          </div>

          {/* Card 3: Products */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#980e27]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Products
              </span>
              <div className="p-2.5 rounded-lg bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#172126] tracking-tight">
                86
              </span>
              <p className="text-xs text-[#64748B] mt-1 font-medium">
                Chemical products
              </p>
            </div>
          </div>

          {/* Card 4: Blog Posts */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-2xs hover:border-[#980e27]/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">
                Total Blog Posts
              </span>
              <div className="p-2.5 rounded-lg bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-[#172126] tracking-tight">
                18
              </span>
              <p className="text-xs text-[#64748B] mt-1 font-medium">
                Published articles
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SECONDARY CONTENT SECTION (RECENT ACTIVITY & QUICK ACTIONS)            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Recent Activity (2 Cols on lg) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#980e27]" />
                <h2 className="text-base font-bold text-[#172126]">
                  Recent Activity
                </h2>
              </div>
              <span className="text-xs text-[#718096]">Updated live</span>
            </div>

            {/* Activity List Timeline */}
            <div className="space-y-4">
              {[
                {
                  icon: Package,
                  text: 'Product "VULCURE MBT" updated',
                  time: "15 mins ago",
                  type: "product",
                },
                {
                  icon: FileText,
                  text: "New blog article 'Optimizing Vulcanization in Latex' created",
                  time: "1 hour ago",
                  type: "blog",
                },
                {
                  icon: Layers,
                  text: 'Main category "Rubber Accelerators" updated',
                  time: "3 hours ago",
                  type: "category",
                },
                {
                  icon: ImageIcon,
                  text: "Product technical sheet image added to media library",
                  time: "5 hours ago",
                  type: "media",
                },
                {
                  icon: MessageSquare,
                  text: "New product enquiry received from ABC Pharma Ltd.",
                  time: "Yesterday",
                  type: "enquiry",
                },
              ].map((act, index) => {
                const Icon = act.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-[#F8FAFA] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10 shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#172126] leading-snug">
                          {act.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-[#94A3B8]" />
                          <span className="text-xs text-[#94A3B8] font-normal">
                            {act.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-xs font-semibold text-[#980e27] hover:underline shrink-0 cursor-pointer"
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Quick Actions (1 Col on lg) */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-6 flex flex-col justify-between">
            <div>
              <div className="pb-4 mb-4 border-b border-[#E5E7EB]">
                <h2 className="text-base font-bold text-[#172126]">
                  Quick Actions
                </h2>
                <p className="text-xs text-[#718096] mt-0.5">
                  Shortcuts for common admin tasks
                </p>
              </div>

              {/* Action Buttons Stack */}
              <div className="space-y-3">
                <Link
                  href="/products"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#980e27] hover:bg-[#FFF5F7] text-[#172126] hover:text-[#980e27] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <PlusCircle className="w-5 h-5 text-[#980e27] group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Add New Product</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#980e27] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#980e27] hover:bg-[#FFF5F7] text-[#172126] hover:text-[#980e27] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FolderPlus className="w-5 h-5 text-[#980e27] group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Add Main Category</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#980e27] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/blogs/new"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#980e27] hover:bg-[#FFF5F7] text-[#172126] hover:text-[#980e27] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FilePlus className="w-5 h-5 text-[#980e27] group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Create Blog Post</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#980e27] group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/enquiries"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#980e27] hover:bg-[#FFF5F7] text-[#172126] hover:text-[#980e27] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#980e27] group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">View Enquiries</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#980e27] group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>

            {/* Support Note */}
            <div className="mt-6 pt-4 border-t border-[#E5E7EB] text-center">
              <p className="text-xs text-[#94A3B8]">
                Need technical assistance? Contact system IT admin.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. PRODUCT OVERVIEW SECTION TABLE                                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#172126]">
                Product Overview
              </h2>
              <p className="text-xs text-[#718096] mt-0.5">
                Recently updated specialty chemical product records
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#980e27] hover:underline cursor-pointer"
            >
              <span>View All Products</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Responsive Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFA] border-b border-[#E5E7EB]">
                  <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                    Main Category
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                    Subcategory
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="py-3.5 px-5 text-xs font-semibold text-[#718096] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {[
                  {
                    name: "VULCURE MBT",
                    category: "Accelerator",
                    subcategory: "Thiazoles",
                    status: "Published",
                    date: "01 Oct 2026",
                  },
                  {
                    name: "VULCURE MBTS",
                    category: "Accelerator",
                    subcategory: "Thiazoles",
                    status: "Published",
                    date: "30 Sep 2026",
                  },
                  {
                    name: "VULCURE ZMBT",
                    category: "Accelerator",
                    subcategory: "Thiazoles",
                    status: "Draft",
                    date: "28 Sep 2026",
                  },
                  {
                    name: "VULCURE ZDC",
                    category: "Accelerator",
                    subcategory: "Dithiocarbamates",
                    status: "Published",
                    date: "25 Sep 2026",
                  },
                  {
                    name: "VULCURE TMT",
                    category: "Accelerator",
                    subcategory: "Thiurams",
                    status: "Published",
                    date: "22 Sep 2026",
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFA]/80 transition-colors">
                    <td className="py-4 px-5 text-sm font-semibold text-[#172126]">
                      {row.name}
                    </td>
                    <td className="py-4 px-5 text-sm text-[#475569]">
                      {row.category}
                    </td>
                    <td className="py-4 px-5 text-sm text-[#475569]">
                      {row.subcategory}
                    </td>
                    <td className="py-4 px-5 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          row.status === "Published"
                            ? "bg-[#FFF5F7] text-[#980e27] border border-[#980e27]/10"
                            : row.status === "Draft"
                            ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                            : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-sm text-[#64748B]">
                      {row.date}
                    </td>
                    <td className="py-4 px-5 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="p-1.5 text-[#718096] hover:text-[#980e27] hover:bg-[#FFF5F7] rounded-md transition-colors cursor-pointer"
                          aria-label="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 text-[#718096] hover:text-[#172126] hover:bg-[#F3F5F6] rounded-md transition-colors cursor-pointer"
                          aria-label="View product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. BLOG OVERVIEW SECTION                                                  */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-2xs p-5">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-base font-bold text-[#172126]">
                Recent Blog Articles
              </h2>
              <p className="text-xs text-[#718096] mt-0.5">
                Technical insights, safety guidelines, and company announcements
              </p>
            </div>

            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#980e27] hover:underline cursor-pointer"
            >
              <span>View All Blogs</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of 3 Recent Articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: "Optimizing Vulcanization in Latex Dipping Applications",
                date: "28 Sep 2026",
                status: "Published",
                category: "Technical Guide",
              },
              {
                title: "Safety Protocols for Rubber Chemical Storage & Handling",
                date: "20 Sep 2026",
                status: "Published",
                category: "Safety & Compliance",
              },
              {
                title: "Sustainable Antioxidant Formulations for Industrial Tyres",
                date: "14 Sep 2026",
                status: "Draft",
                category: "R&D Insights",
              },
            ].map((blog, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#E5E7EB] hover:border-[#980e27]/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-[#980e27] bg-[#FFF5F7] px-2 py-0.5 rounded-md border border-[#980e27]/10">
                      {blog.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        blog.status === "Published"
                          ? "bg-[#E6F4EA] text-[#087F5B]"
                          : "bg-[#FEF3C7] text-[#D97706]"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#172126] leading-snug line-clamp-2">
                    {blog.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F3F5F6] text-xs text-[#718096]">
                  <span>{blog.date}</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-[#980e27] hover:underline cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}