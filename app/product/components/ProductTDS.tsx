"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  X,
  Upload,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Calendar,
} from "lucide-react";
import { uploadProductTdsApi, deleteProductTdsApi, formatStorageUrl } from "../../utils/product";

import DeleteModal from "./DeleteModal";

export interface ProductTDSProps {
  product: {
    id: number | string;
    name: string;
    tds_document?: string | null;
    tds_document_name?: string | null;
    tds_document_version?: string | null;
    tds_uploaded_at?: string | null;
    tds?: {
      available?: boolean;
      file_name?: string;
      url?: string;
      version?: string;
      uploaded_at?: string;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ProductTDS: React.FC<ProductTDSProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [version, setVersion] = useState<string>("1.0");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const existingVersion =
        product?.tds?.version ||
        product?.tds_document_version ||
        "1.0";
      setVersion(existingVersion);
      setSelectedFile(null);
      setError(null);
      setSuccessMsg(null);
      setShowConfirmDelete(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Existing TDS document info
  const tdsObj = product.tds;
  const hasExistingTds =
    tdsObj?.available ||
    Boolean(product.tds_document);

  const existingFileName =
    tdsObj?.file_name ||
    product.tds_document_name ||
    "TDS Document.pdf";

  const existingVersion =
    tdsObj?.version ||
    product.tds_document_version ||
    "1.0";

  const existingUploadedAt =
    tdsObj?.uploaded_at ||
    product.tds_uploaded_at ||
    null;

  const existingUrl = formatStorageUrl(
    tdsObj?.url || (product as any).tds_document_url || product.tds_document
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a TDS document file to upload.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("version", version || "1.0");
      formData.append("tds_document", selectedFile);

      await uploadProductTdsApi(product.id, formData);
      setSuccessMsg("TDS document uploaded successfully!");
      setSelectedFile(null);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Failed to upload TDS document:", err);
      setError(
        err?.message ||
          err?.errors?.tds_document?.[0] ||
          "Failed to upload TDS document. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDeleteTds = async () => {
    setDeleting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await deleteProductTdsApi(product.id);
      setShowConfirmDelete(false);
      setSuccessMsg("TDS document deleted successfully!");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Failed to delete TDS document:", err);
      setError(err?.message || "Failed to delete TDS document.");
      setShowConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E5E7EB] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F8FAFA] border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F7] text-[#980e27] flex items-center justify-center border border-[#980e27]/20 font-bold shrink-0">
              <FileText className="w-5 h-5 text-[#980e27]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#172126] leading-tight">
                Product TDS Document
              </h2>
              <p className="text-xs text-[#718096] truncate max-w-[280px]">
                {product.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#718096] hover:text-[#172126] hover:bg-[#E5E7EB]/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
          {successMsg && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#087F5B] bg-[#E6F4EA] px-3.5 py-2.5 rounded-xl border border-[#087F5B]/20">
              <CheckCircle2 className="w-4 h-4 text-[#087F5B] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] px-3.5 py-2.5 rounded-xl border border-[#FCA5A5]">
              <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Existing TDS Document Card */}
          {hasExistingTds && (
            <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
                  Current Active TDS
                </span>
                <span className="text-[11px] font-semibold bg-[#FFF5F7] text-[#980e27] px-2 py-0.5 rounded-md border border-[#980e27]/20">
                  v{existingVersion}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E5E7EB]">
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#087F5B] shrink-0" />
                    <span className="text-xs font-semibold text-[#172126] truncate">
                      {existingFileName}
                    </span>
                  </div>
                  {existingUploadedAt && (
                    <span className="text-[11px] text-[#718096] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#718096]" />
                      Uploaded{" "}
                      {new Date(existingUploadedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {existingUrl && (
                    <a
                      href={existingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#980e27] hover:bg-[#FFF5F7] rounded-lg transition-colors"
                      title="Download Current TDS"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    disabled={deleting}
                    className="p-1.5 text-[#B91C1C] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                    title="Delete Current TDS"
                  >
                    {deleting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#B91C1C]" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Version Field (Auto Filled) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#172126] uppercase tracking-wider block">
              Document Version <span className="text-[#980e27]">*</span>
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 1.0"
              required
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#E5E7EB] text-xs text-[#172126] focus:outline-none focus:border-[#980e27] focus:ring-1 focus:ring-[#980e27] transition-all font-mono"
            />
            <p className="text-[11px] text-[#718096]">
              Auto-filled version tag for this technical document upload.
            </p>
          </div>

          {/* Document File Dropzone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#172126] uppercase tracking-wider block">
              TDS Document File (PDF / DOC) <span className="text-[#980e27]">*</span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer relative ${
                isDragOver
                  ? "border-[#980e27] bg-[#FFF5F7]"
                  : selectedFile
                  ? "border-[#087F5B] bg-[#E6F4EA]/30"
                  : "border-[#E5E7EB] hover:border-[#980e27]/50 bg-[#F8FAFA]"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {selectedFile ? (
                <div className="space-y-1.5 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#E6F4EA] text-[#087F5B] flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-[#172126] truncate max-w-xs">
                    {selectedFile.name}
                  </div>
                  <span className="text-[10px] text-[#718096]">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-1 text-[11px] font-semibold text-[#B91C1C] hover:underline"
                  >
                    Remove selected file
                  </button>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#FFF5F7] text-[#980e27] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#172126]">
                      Click to browse or drag & drop TDS file here
                    </p>
                    <p className="text-[11px] text-[#718096] mt-0.5">
                      Supports PDF, DOC, DOCX up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-xl hover:bg-[#F8FAFA] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !selectedFile}
              className={`px-4 py-2 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs ${
                submitting || !selectedFile
                  ? "bg-[#980e27]/50 cursor-not-allowed"
                  : "bg-[#980e27] hover:bg-[#7A0B1F]"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading TDS...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload TDS Document</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* TDS Delete Confirmation Modal */}
        <DeleteModal
          isOpen={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={handleConfirmDeleteTds}
          isDeleting={deleting}
          title="Delete TDS Document?"
          itemName={existingFileName}
          itemType="TDS document"
          description="Are you sure you want to delete this technical data sheet? This document will be permanently removed."
        />
      </div>
    </div>
  );
};

export default ProductTDS;