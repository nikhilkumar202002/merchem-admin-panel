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
  const allItems: BreadcrumbItem[] = items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1.5 text-[12px] text-[#64748B] mb-1 font-medium ${className}`}
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-[#94A3B8]">/</span>}
            {isLast ? (
              <span className="text-[#172126] font-semibold">{item.label}</span>
            ) : item.href ? (
              <Link href={item.href} className="hover:text-[#087F5B] transition-colors">
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