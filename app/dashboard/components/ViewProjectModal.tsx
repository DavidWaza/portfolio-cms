import Image from "next/image";
import { X } from "lucide-react";
import { ProjectProps } from "@/lib/types";

type ViewProjectModalProps = {
  isOpen: boolean;
  project: ProjectProps | null;
  onClose: () => void;
};

export default function ViewProjectModal({
  isOpen,
  project,
  onClose,
}: ViewProjectModalProps) {
  if (!isOpen || !project) return null;

  const parseTools = (tools: string[] | string) => {
    try {
      return typeof tools === "string" ? JSON.parse(tools) : tools;
    } catch {
      return [];
    }
  };

  const toolsList = parseTools(project.tools);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6 pr-8">
          {project.title}
        </h2>

        {project.logo && (
          <div className="mb-6">
            <Image
              src={project.logo}
              alt={project.title}
              width={150}
              height={150}
              className="rounded-xl shadow-md object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Description
            </h3>
            <p className="text-gray-800 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Type
              </h3>
              <p className="text-gray-800">{project.application_type}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Year
              </h3>
              <p className="text-gray-800">{project.year}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Location
            </h3>
            <p className="text-gray-800">{project.location}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(toolsList) &&
                toolsList.map((tool: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {tool}
                  </span>
                ))}
            </div>
          </div>

          {project.project_link && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Project Link
              </h3>
              <a
                href={project.project_link}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Project
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
