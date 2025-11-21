import { Calendar, MapPin, Code, Trash2, PencilLine, Eye } from "lucide-react";
import { WorkExpProps } from "@/lib/types";
import DynamicTable, { ColumnDef } from "../DynamicTable";

type ProjectTableProps = {
  rows: WorkExpProps[];
  onView: (project: WorkExpProps) => void;
  onEdit: (project: WorkExpProps) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
};

export default function ExpTable({
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

  const columns: ColumnDef<WorkExpProps>[] = [
    {
      key: "title_role",
      label: "Job Title",
      render: (title_role) => (
        <span className="font-medium text-gray-600 truncate">{title_role}</span>
      ),
    },
    {
      key: "company",
      label: "Company",
      render: (company) => (
        <span className="font-medium text-gray-600 truncate">{company}</span>
      ),
    },
    {
      key: "date_started",
      label: "Start Date",
      render: (date_started) => (
        <span className="text-gray-600 max-w-xs truncate block">
          {date_started}
        </span>
      ),
    },
    {
      key: "date_ended",
      label: "End Date",
      render: (date_ended) => (
        <span className="text-gray-600 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
          {date_ended}
        </span>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (location) => (
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          {location}
        </div>
      ),
    },
    {
      key: "job_type",
      label: "Year",
      render: (job_type) => (
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          {job_type}
        </div>
      ),
    },
    {
      key: "job_responsibility",
      label: "Job Responsibilty",
      render: (job_responsibility) => {
        const toolsList = parseTools(job_responsibility);

        return <div className="flex flex-wrap gap-1"></div>;
      },
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
