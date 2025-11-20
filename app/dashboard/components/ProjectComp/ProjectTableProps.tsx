import React from "react";
import Image from "next/image";
import { Calendar, MapPin, Code, Trash2, PencilLine, Eye } from "lucide-react";
import { ProjectProps } from "@/lib/types";
import DynamicTable, { ColumnDef } from "../DynamicTable";

type ProjectTableProps = {
  rows: ProjectProps[];
  onView: (project: ProjectProps) => void;
  onEdit: (project: ProjectProps) => void;
  onDelete: (id: number) => void;
  onLogoClick: (logo: string) => void;
  loading?: boolean;
};

export default function ProjectTable({
  rows,
  onView,
  onEdit,
  onDelete,
  onLogoClick,
  loading = false,
}: ProjectTableProps) {
  const parseTools = (tools: string[] | string) => {
    try {
      return typeof tools === "string" ? JSON.parse(tools) : tools;
    } catch {
      return [];
    }
  };

  const columns: ColumnDef<ProjectProps>[] = [
    {
      key: "logo",
      label: "Logo",
      render: (logo, row) =>
        logo ? (
          <Image
            src={`${logo}`}
            alt={row.title}
            width={50}
            height={50}
            className="rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onLogoClick(`${logo}`);
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <Code className="w-6 h-6 text-gray-400" />
          </div>
        ),
    },
    {
      key: "title",
      label: "Title",
      render: (title) => (
        <span className="font-medium text-gray-900 truncate">{title}</span>
      ),
    },
    {
      key: "project_link",
      label: "Link",
      render: (link) => (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline max-w-xs truncate block"
          onClick={(e) => e.stopPropagation()}
        >
          {link}
        </a>
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
      key: "application_type",
      label: "Type",
      render: (type) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
          {type}
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
      key: "year",
      label: "Year",
      render: (year) => (
        <div className="flex items-center gap-1 text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          {year}
        </div>
      ),
    },
    {
      key: "tools",
      label: "Tools",
      render: (tools) => {
        const toolsList = parseTools(tools);
        const displayTools = Array.isArray(toolsList) ? toolsList : [];

        return (
          <div className="flex flex-wrap gap-1">
            {displayTools.slice(0, 3).map((tool, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
              >
                {tool}
              </span>
            ))}
            {displayTools.length > 3 && (
              <span className="text-xs text-gray-400">
                +{displayTools.length - 3}
              </span>
            )}
          </div>
        );
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
