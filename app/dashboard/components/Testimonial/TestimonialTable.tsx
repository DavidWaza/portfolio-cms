import { Calendar, MapPin, Code, Trash2, PencilLine, Eye } from "lucide-react";
import { TestimonialProps } from "@/lib/types";
import DynamicTable, { ColumnDef } from "../DynamicTable";

type ProjectTableProps = {
  rows: TestimonialProps[];
  onView: (project: TestimonialProps) => void;
  onEdit: (project: TestimonialProps) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
};

export default function TestimonialTable({
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

  const columns: ColumnDef<TestimonialProps>[] = [
    {
      key: "name",
      label: "Name",
      render: (name) => (
        <span className="font-medium text-gray-600 truncate">{name}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (role) => (
        <span className="font-medium text-gray-600 truncate">{role}</span>
      ),
    },
    {
      key: "testimonial",
      label: "Testimonial",
      render: (testimonial) => (
        <span className="text-gray-600 max-w-xs truncate block">
          {testimonial}
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
