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
        id: "main-categories",
        label: "Main Categories",
        icon: Layers,
        href: "/product/main-categories",
      },
      {
        id: "subcategories",
        label: "Subcategories",
        icon: FolderTree,
        href: "/product/sub-categories",
      },
      {
        id: "products",
        label: "Products",
        icon: Package,
        href: "/product/all-products",
      },
    ],
  },
  {
    title: "BLOG MANAGEMENT",
    items: [
      {
        id: "all-blogs",
        label: "All Blogs",
        icon: Newspaper,
        href: "/blog/view-all",
      },
      {
        id: "add-blog",
        label: "Add New Blog",
        icon: FilePlus,
        href: "/blog/add-blog",
      },
    ],
  },
  {
    title: "WEBSITE MANAGEMENT",
    items: [
      {
        id: "media-library",
        label: "Media Library",
        icon: ImageIcon,
        href: "/media",
      },
      {
        id: "enquiries",
        label: "Enquiries",
        icon: Mail,
        href: "/enquiries",
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
        href: "/users",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        href: "/settings",
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
    return pathname.startsWith(item.href);
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 flex flex-col w-[240px] h-screen bg-white text-[#172126] border-r border-[#E5E7EB] transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header Link to Home */}
        <div className="h-[72px] min-h-[72px] px-5 flex items-center justify-between border-b border-[#E5E7EB]">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
              <Image
                src="/Main_logo.png"
                alt="Merchem India Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[16px] font-extrabold tracking-wider text-[#172126] group-hover:text-[#980e27] uppercase leading-tight transition-colors">
                MERCHEM
              </span>
              <span className="text-[10px] font-semibold text-[#980e27] uppercase tracking-wider leading-none mt-0.5">
                INDIA PVT. LTD.
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-[#718096] hover:text-[#172126] hover:bg-[#F3F5F6] md:hidden transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section Area */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-[#E5E7EB]">
          {navSections.map((section, idx) => (
            <div key={section.title || `section-${idx}`} className="space-y-2">
              {/* Section Header */}
              {section.title && (
                <h3 className="px-3 pt-1 pb-1 text-[12px] font-semibold text-[#718096] tracking-wider uppercase select-none">
                  {section.title}
                </h3>
              )}

              {/* Navigation Items */}
              <div className="space-y-[8px]">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isLinkActive(item);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => handleLinkClick(item.id)}
                      className={`w-full h-[44px] flex items-center gap-3 px-3.5 text-left text-[14px] font-medium transition-all duration-150 cursor-pointer ${
                        active
                          ? "bg-[#980e27] text-white rounded-[7px] shadow-xs font-semibold"
                          : "text-[#4A5568] hover:bg-[#FFF5F7] hover:text-[#980e27] rounded-[7px]"
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                          active ? "text-white" : "text-[#718096]"
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