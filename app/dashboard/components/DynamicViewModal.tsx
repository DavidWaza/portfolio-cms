import React from "react";
import { X } from "lucide-react";

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, data: T) => React.ReactNode;
  span?: 1 | 2; 
  hide?: boolean;
};

type DynamicViewModalProps<T> = {
  isOpen: boolean;
  data: T | null;
  onClose: () => void;
  title?: string | ((data: T) => string);
  fields: FieldConfig<T>[];
  headerContent?: (data: T) => React.ReactNode;
  footerContent?: (data: T) => React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
};

export default function DynamicViewModal<T extends Record<string, any>>({
  isOpen,
  data,
  onClose,
  title,
  fields,
  headerContent,
  footerContent,
  className = "",
  maxWidth = "2xl",
}: DynamicViewModalProps<T>) {
  if (!isOpen || !data) return null;

  const modalTitle = typeof title === "function" ? title(data) : title || "View Details";

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-2xl shadow-xl ${maxWidthClasses[maxWidth]} w-full p-6 relative max-h-[90vh] overflow-y-auto ${className}`}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 pr-8">
          {modalTitle}
        </h2>

        {/* Optional Header Content (e.g., image, badges) */}
        {headerContent && (
          <div className="mb-6">{headerContent(data)}</div>
        )}

        {/* Dynamic Fields */}
        <div className="space-y-4">
          {fields.map((field) => {
            if (field.hide) return null;

            const value = data[field.key];
            const isFullWidth = field.span === 2;

            return (
              <div
                key={String(field.key)}
                className={isFullWidth ? "col-span-2" : ""}
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {field.label}
                </h3>
                <div className="text-gray-800 leading-relaxed">
                  {field.render ? field.render(value, data) : value || "N/A"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Footer Content */}
        {footerContent && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            {footerContent(data)}
          </div>
        )}

        {/* Default Close Button */}
        {!footerContent && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}