import { Trash2, PencilLine, Eye } from "lucide-react";
import { ServiceProps } from "@/lib/types";
import DynamicTable, { ColumnDef } from "../DynamicTable";

type ProjectTableProps = {
  rows: ServiceProps[];
  onView: (project: ServiceProps) => void;
  onEdit: (project: ServiceProps) => void;
  onDelete: (id: number) => void;
  onLogoClick: (logo: string) => void;
  loading?: boolean;
};

export default function ServiceTable({
  rows,
  onView,
  onEdit,
  onDelete,
  loading = false,
}: ProjectTableProps) {
  const columns: ColumnDef<ServiceProps>[] = [
    {
      key: "title",
      label: "Title",
      render: (title) => (
        <span className="font-medium text-gray-900 truncate">{title}</span>
      ),
    },

    {
      key: "description",
      label: "Description",
      render: (description) => (
        <span className="text-gray-600 max-w-xs truncate block">
          {description}
        </span>
      ),
    },
    {
      key: "roles",
      label: "Type",
      render: (type) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
          {type}
        </span>
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
