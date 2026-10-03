"use client";

import React from "react";
import Link from "next/link";
import { Trash2, ShieldAlert, Loader2, X } from "lucide-react";

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  itemType?: string;
  description?: React.ReactNode;
  isDeleting?: boolean;
  blocked?: boolean;
  blockedMessage?: React.ReactNode;
  confirmText?: string;
  actionLink?: {
    href: string;
    label: string;
  };
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType = "item",
  description,
  isDeleting = false,
  blocked = false,
  blockedMessage,
  confirmText = "Confirm Delete",
  actionLink,
}) => {
  if (!isOpen) return null;

  const defaultTitle = blocked
    ? title || `Cannot Delete ${itemName ? `"${itemName}"` : itemType}`
    : title || `Delete ${itemName ? `"${itemName}"` : itemType}?`;

  const defaultDescription = blocked
    ? blockedMessage || (
        <>
          This {itemType} cannot be deleted because it contains active
          dependencies. Please reassign or remove all child items before
          deleting.
        </>
      )
    : description || (
        <>
          Are you sure you want to delete{" "}
          {itemName ? (
            <strong className="text-[#172126]">&quot;{itemName}&quot;</strong>
          ) : (
            `this ${itemType}`
          )}
          ? This action is permanent and cannot be undone.
        </>
      );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#E5E7EB] shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header Icon & Close Button */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              blocked
                ? "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]"
                : "bg-[#FFF5F5] text-[#E53E3E] border-[#FEB2B2]"
            }`}
          >
            {blocked ? (
              <ShieldAlert className="w-6 h-6 text-[#D97706]" />
            ) : (
              <Trash2 className="w-6 h-6 text-[#E53E3E]" />
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-[#718096] hover:text-[#172126] hover:bg-[#E5E7EB]/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[#172126] leading-snug">
            {defaultTitle}
          </h3>
          <div className="text-xs text-[#718096] leading-relaxed">
            {defaultDescription}
          </div>

          {itemName && !blocked && (
            <div className="pt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F8FAFA] text-[#172126] text-xs font-semibold border border-[#E5E7EB] truncate max-w-full">
                Target: {itemName}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E5E7EB]">
          {blocked ? (
            <div className="flex items-center justify-end gap-2 w-full">
              {actionLink && (
                <Link
                  href={actionLink.href}
                  className="px-4 py-2 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  {actionLink.label}
                </Link>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-xl hover:bg-[#F8FAFA] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                disabled={isDeleting}
                onClick={onClose}
                className="px-4 py-2 bg-white border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-xl hover:bg-[#F8FAFA] transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={onConfirm}
                className="px-4 py-2 bg-[#E53E3E] hover:bg-[#C53030] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{confirmText}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;