import React from "react";
import Image from "next/image";
import { Calendar, MapPin, Code, Trash2, PencilLine, Eye } from "lucide-react";
import { ProjectProps } from "@/lib/types";

type ProjectTableProps = {
  rows: ProjectProps[];
  onView: (project: ProjectProps) => void;
  onEdit: (project: ProjectProps) => void;
  onDelete: (id: number) => void;
  onLogoClick: (logo: string) => void;
};

export default function ProjectTable({
  rows,
  onView,
  onEdit,
  onDelete,
  onLogoClick,
}: ProjectTableProps) {
  const parseTools = (tools: string[] | string) => {
    try {
      return typeof tools === "string" ? JSON.parse(tools) : tools;
    } catch {
      return [];
    }
  };

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-100">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Logo
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Link
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Location
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Year
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Tools
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {rows.map((item) => {
          const toolsList = parseTools(item.tools);
          const displayTools = Array.isArray(toolsList) ? toolsList : [];

          return (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                {item.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onLogoClick(item.logo)}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {item.title}
              </td>
              <td className="px-6 py-4 text-sm max-w-xs truncate">
                <a
                  href={item.project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {item.project_link}
                </a>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                {item.description}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                  {item.application_type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {item.location}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {item.year}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
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
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                    onClick={() => onView(item)}
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800 transition-colors p-2 hover:bg-green-50 rounded-lg"
                    onClick={() => onEdit(item)}
                    title="Edit"
                  >
                    <PencilLine className="w-5 h-5"/>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    onClick={() => onDelete(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}