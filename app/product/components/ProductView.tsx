"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  X,
  Layers,
  FolderTree,
  Sparkles,
  Loader2,
  Edit2,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Hash,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { getProductByIdApi, formatStorageUrl } from "../../utils/product";

export interface ProductViewProps {
  productId?: number | string | null;
  productData?: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (product: any) => void;
}

const ProductView: React.FC<ProductViewProps> = ({
  productId,
  productData: initialProductData,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [product, setProduct] = useState<any>(initialProductData || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setProduct(null);
      setError(null);
      return;
    }

    if (initialProductData) {
      setProduct(initialProductData);
    }

    const fetchProductDetails = async () => {
      const idToFetch = productId || initialProductData?.id;
      if (!idToFetch) return;

      setLoading(true);
      setError(null);
      try {
        const res = await getProductByIdApi(idToFetch);
        const data = res?.data || res;
        if (data && typeof data === "object") {
          setProduct(data);
        }
      } catch (err: any) {
        console.error("Failed to fetch product details:", err);
        setError(
          err?.message || "Failed to load fresh product details from server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [isOpen, productId, initialProductData]);

  if (!isOpen) return null;

  // Normalization helpers
  const productName = product?.name || initialProductData?.name || "Product View";
  const productSlug = product?.slug || initialProductData?.slug || "";
  const status = product?.status || initialProductData?.status || "active";
  
  const categoryName =
    product?.category?.name ||
    product?.product_category?.name ||
    product?.mainCategory ||
    initialProductData?.mainCategory ||
    "Uncategorized";

  const subcategoryName =
    product?.subcategory?.name ||
    product?.product_subcategory?.name ||
    product?.subcategory ||
    initialProductData?.subcategory ||
    "None";

  const shortDescription =
    product?.short_description ||
    product?.shortDescription ||
    initialProductData?.shortDescription ||
    "";

  const fullDescription =
    product?.description ||
    product?.full_description ||
    product?.fullDescription ||
    initialProductData?.fullDescription ||
    "";

  const applications =
    product?.applications || initialProductData?.applications || "";

  const imageUrl =
    product?.image_url ||
    product?.image ||
    initialProductData?.image ||
    null;

  const sortOrder =
    product?.sort_order !== undefined
      ? product.sort_order
      : initialProductData?.sort_order || 1;

  // TDS document details
  const tdsObj = product?.tds;
  const tdsAvailable =
    tdsObj?.available ||
    Boolean(product?.tds_document) ||
    Boolean(initialProductData?.tds_document);

  const tdsFileName =
    tdsObj?.file_name ||
    product?.tds_document_name ||
    initialProductData?.tds_document_name ||
    "TDS Document.pdf";

  const tdsVersion =
    tdsObj?.version ||
    product?.tds_document_version ||
    initialProductData?.tds_document_version ||
    "1.0";

  const tdsUploadedAt =
    tdsObj?.uploaded_at ||
    product?.tds_uploaded_at ||
    initialProductData?.tds_uploaded_at ||
    null;

  const tdsUrl = formatStorageUrl(
    tdsObj?.url || product?.tds_document_url || product?.tds_document
  );

  // SEO details
  const seoTitle =
    product?.seo?.title ||
    product?.seo_title ||
    initialProductData?.seoTitle ||
    "";

  const seoDescription =
    product?.seo?.description ||
    product?.seo_description ||
    initialProductData?.seoDescription ||
    "";

  // Timestamps
  const createdAt = product?.created_at
    ? new Date(product.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const updatedAt = product?.updated_at
    ? new Date(product.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : product?.lastUpdated || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E5E7EB] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#F8FAFA] border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF5F7] text-[#980e27] flex items-center justify-center border border-[#980e27]/20 font-bold shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#172126] leading-tight">
                  {productName}
                </h2>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                    status === "active"
                      ? "bg-[#E6F4EA] text-[#087F5B] border border-[#087F5B]/20"
                      : "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]"
                  }`}
                >
                  {status}
                </span>
              </div>
              {productSlug && (
                <span className="text-xs font-mono text-[#718096]">
                  /{productSlug}
                </span>
              )}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[#172126]">
          {loading && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#980e27] bg-[#FFF5F7] px-3.5 py-2 rounded-xl border border-[#980e27]/20">
              <Loader2 className="w-4 h-4 animate-spin text-[#980e27]" />
              <span>Fetching latest product specifications from API...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#B91C1C] bg-[#FEF2F2] px-3.5 py-2 rounded-xl border border-[#FCA5A5]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B91C1C]" />
              <span>{error}</span>
            </div>
          )}

          {/* Key Categorization & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-1">
              <span className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider block">
                Main Category
              </span>
              <span className="text-xs font-bold text-[#172126] inline-flex items-center gap-1.5 truncate">
                <Layers className="w-3.5 h-3.5 text-[#980e27] shrink-0" />
                <span className="truncate">{categoryName}</span>
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-1">
              <span className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider block">
                Subcategory
              </span>
              <span className="text-xs font-bold text-[#172126] inline-flex items-center gap-1.5 truncate">
                <FolderTree className="w-3.5 h-3.5 text-[#718096] shrink-0" />
                <span className="truncate">{subcategoryName}</span>
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-1">
              <span className="text-[11px] font-semibold text-[#718096] uppercase tracking-wider block">
                Sort Order
              </span>
              <span className="text-xs font-bold text-[#172126] inline-flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#718096] shrink-0" />
                <span>#{sortOrder}</span>
              </span>
            </div>
          </div>

          {/* Product Image Section */}
          {imageUrl && (
            <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-[#E5E7EB] bg-white shrink-0">
                <img
                  src={imageUrl}
                  alt={productName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 flex-1 text-center sm:text-left">
                <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider block">
                  Product Image
                </span>
                <p className="text-xs text-[#475569]">
                  Uploaded chemical product graphic or package image.
                </p>
              </div>
            </div>
          )}

          {/* Technical Data Sheet (TDS) Card */}
          {tdsAvailable && (
            <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#172126] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#980e27]" />
                  Technical Data Sheet (TDS Document)
                </h4>
                <span className="text-[11px] font-semibold bg-[#FFF5F7] text-[#980e27] px-2 py-0.5 rounded-md border border-[#980e27]/20">
                  Version {tdsVersion}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E5E7EB]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#172126] truncate max-w-[280px]">
                      {tdsFileName}
                    </span>
                  </div>
                  {tdsUploadedAt && (
                    <span className="text-[11px] text-[#718096] block">
                      Uploaded on{" "}
                      {new Date(tdsUploadedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                {tdsUrl ? (
                  <a
                    href={tdsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0 justify-center"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TDS</span>
                  </a>
                ) : (
                  <span className="text-xs text-[#718096] italic">
                    Document path available
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Short Description */}
          {shortDescription && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#172126] uppercase tracking-wider">
                Short Description
              </h4>
              <p className="p-3.5 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] text-xs text-[#475569] leading-relaxed">
                {shortDescription}
              </p>
            </div>
          )}

          {/* Full Description / Technical Specifications */}
          {fullDescription && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#172126] uppercase tracking-wider">
                Technical Specifications & Description
              </h4>
              <div className="p-3.5 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] text-xs text-[#475569] leading-relaxed whitespace-pre-line">
                {fullDescription}
              </div>
            </div>
          )}

          {/* Key Applications */}
          {applications && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#172126] uppercase tracking-wider">
                Key Applications & Industrial Uses
              </h4>
              <p className="p-3.5 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] text-xs text-[#475569] leading-relaxed">
                {applications}
              </p>
            </div>
          )}

          {/* SEO Metadata Card */}
          {(seoTitle || seoDescription) && (
            <div className="p-4 bg-[#F8FAFA] rounded-xl border border-[#E5E7EB] space-y-2">
              <h4 className="text-xs font-bold text-[#172126] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#980e27]" />
                SEO Search Engine Metadata
              </h4>
              {seoTitle && (
                <div className="text-xs">
                  <span className="font-semibold text-[#718096]">Meta Title: </span>
                  <span className="text-[#172126] font-medium">{seoTitle}</span>
                </div>
              )}
              {seoDescription && (
                <div className="text-xs">
                  <span className="font-semibold text-[#718096]">Meta Description: </span>
                  <span className="text-[#475569]">{seoDescription}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F8FAFA] border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-[#718096] flex items-center gap-3">
            {createdAt && <span>Created: {createdAt}</span>}
            {updatedAt && <span>Updated: {updatedAt}</span>}
          </div>

          <div className="flex items-center gap-2 justify-end">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product || initialProductData)}
                className="px-4 py-2 bg-[#980e27] hover:bg-[#7A0B1F] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Product</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5E7EB] text-xs font-semibold text-[#475569] rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;