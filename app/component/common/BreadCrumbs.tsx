import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items, className = "" }) => {
  // Prepend 'Home' link if not explicitly provided as the first item
  const allItems: BreadcrumbItem[] =
    items.length > 0 && items[0].label.toLowerCase() === "home"
      ? items
      : [{ label: "Home", href: "/" }, ...items];

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-xs text-[#718096] mb-1 font-medium ${className}`}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span>/</span>}
            {isLast ? (
              <span className="text-[#980e27] font-semibold">{item.label}</span>
            ) : item.href ? (
              <Link href={item.href} className="hover:text-[#980e27] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default BreadCrumbs;