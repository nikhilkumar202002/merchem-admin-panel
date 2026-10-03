"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  Package,
  Newspaper,
  FilePlus,
  Image as ImageIcon,
  Mail,
  FileCheck,
  Users,
  Settings,
  X,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SidebarProps {
  activeId?: string;
  onSelectNav?: (id: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const navSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
    ],
  },
  {
    title: "PRODUCT MANAGEMENT",
    items: [
      {
        id: "products",
        label: "All Products",
        icon: Package,
        href: "/product/all-products",
      },
      {
        id: "main-categories",
        label: "Main Categories",
        icon: Layers,
        href: "/product/main-categories",
      },
      {
        id: "subcategories",
        label: "Sub Categories",
        icon: FolderTree,
        href: "/product/sub-categories",
      },
    ],
  },
  {
    title: "CONTENT MANAGEMENT",
    items: [
      {
        id: "all-blogs",
        label: "Blog",
        icon: Newspaper,
        href: "/blog/view-all",
      },
      {
        id: "add-blog",
        label: "Add Blog",
        icon: FilePlus,
        href: "/blog/add-blog",
      },
    ],
  },
  {
    title: "WEBSITE MANAGEMENT",
    items: [
      // {
      //   id: "media-library",
      //   label: "Media Library",
      //   icon: ImageIcon,
      //   href: "/website-management/media-library",
      // },
      {
        id: "enquiries",
        label: "Enquiries",
        icon: Mail,
        href: "/website-management/enquiries",
      },
      {
        id: "tds-requests",
        label: "TDS Requests",
        icon: FileCheck,
        href: "/website-management/tds-requests",
      },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        id: "users",
        label: "Users",
        icon: Users,
        href: "/administration/users",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        href: "/administration/settings",
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeId,
  onSelectNav,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const isLinkActive = (item: NavItem) => {
    if (activeId) {
      return activeId === item.id;
    }
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
  };

  const handleLinkClick = (id: string) => {
    if (onSelectNav) {
      onSelectNav(id);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container (Clean White with #E5E7EB border) */}
      <aside
        className={`fixed top-0 left-0 z-50 flex flex-col w-[240px] h-screen bg-white text-[#172126] border-r border-[#E5E7EB] transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-[64px] min-h-[64px] px-5 flex items-center justify-between border-b border-[#E5E7EB]">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-8 h-8 shrink-0 flex items-center justify-center bg-[#F8FAFC] rounded-md p-1 border border-[#E5E7EB]">
              <Image
                src="/Main_logo.png"
                alt="Merchem India Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[14px] font-bold tracking-wider text-[#172126] uppercase leading-tight">
                MERCHEM
              </span>
              <span className="text-[9px] font-semibold text-[#980e27] uppercase tracking-widest leading-none mt-0.5">
                INDIA PVT. LTD.
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-[#64748B] hover:text-[#172126] hover:bg-[#F3F5F6] md:hidden transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-[#980e27]/20">
          {navSections.map((section, idx) => (
            <div key={section.title || `section-${idx}`} className="space-y-1">
              {/* Section Header */}
              {section.title && (
                <h3 className="px-3 pt-1 pb-1 text-[11px] font-semibold text-[#64748B] tracking-wider uppercase select-none">
                  {section.title}
                </h3>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isLinkActive(item);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleLinkClick(item.id)}
                      className={`w-full h-[38px] flex items-center gap-3 px-3 text-left text-[13px] transition-all duration-150 cursor-pointer ${
                        active
                          ? "bg-[#980e27] text-white rounded-md font-semibold shadow-xs"
                          : "text-[#475569] hover:bg-[#FFF5F7] hover:text-[#980e27] rounded-md font-medium"
                      }`}
                    >
                      <Icon
                        className={`w-[17px] h-[17px] shrink-0 transition-colors ${
                          active ? "text-white" : "text-[#64748B]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;