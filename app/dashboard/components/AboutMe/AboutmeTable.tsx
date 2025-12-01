import {Trash2, PencilLine, Eye } from "lucide-react";
import { AboutmeProps } from "@/lib/types";
import DynamicTable, { ColumnDef } from "../DynamicTable";

type ProjectTableProps = {
  rows: AboutmeProps[];
  onView: (project: AboutmeProps) => void;
  onEdit: (project: AboutmeProps) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
};

export default function AboutmeTable({
  rows,
  onView,
  onEdit,
  onDelete,
  loading = false,
}: ProjectTableProps) {
  const parseTools = (tools: string[] | string) => {
    try {
      return typeof tools === "string" ? JSON.parse(tools) : tools;
    } catch {
      return [];
    }
  };

  const columns: ColumnDef<AboutmeProps>[] = [
    {
      key: "title",
      label: "Title",
      render: (title) => (
        <span className="font-medium text-gray-600 truncate">{title}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (description) => (
        <span className="font-medium text-gray-600 truncate">{description}</span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-3">
          <button
            className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onView(row);
            }}
            title="View"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            className="text-green-600 hover:text-green-800 transition-colors p-2 hover:bg-green-50 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            title="Edit"
          >
            <PencilLine className="w-5 h-5" />
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.id);
            }}
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DynamicTable
      columns={columns}
      data={rows}
      rowKey="id"
      loading={loading}
      emptyMessage="No projects found"
    />
  );
}
