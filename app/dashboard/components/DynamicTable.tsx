import React from "react";

export type ColumnDef<T> = {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
};

type DynamicTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: keyof T | ((row: T) => string | number);
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
};

export default function DynamicTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  onRowClick,
  loading = false,
  emptyMessage = "No data available",
  className = "",
}: DynamicTableProps<T>) {
  const getRowKey = (row: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return row[rowKey] ?? index;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={
                  column.headerClassName ||
                  "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                }
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((row, index) => (
            <tr
              key={getRowKey(row, index)}
              onClick={() => onRowClick?.(row)}
              className={`hover:bg-gray-50 transition-colors ${
                onRowClick ? "cursor-pointer" : ""
              }`}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={
                    column.className || "px-6 py-4 text-sm text-gray-900"
                  }
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}