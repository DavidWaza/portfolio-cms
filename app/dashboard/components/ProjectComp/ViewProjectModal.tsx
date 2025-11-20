import Image from "next/image";
import { ProjectProps } from "@/lib/types";
import DynamicViewModal, { FieldConfig } from "../DynamicViewModal";

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
  const parseTools = (tools: string[] | string) => {
    try {
      return typeof tools === "string" ? JSON.parse(tools) : tools;
    } catch {
      return [];
    }
  };

  const fields: FieldConfig<ProjectProps>[] = [
    {
      key: "description",
      label: "Description",
      span: 2,
      render: (description) => (
        <p className="text-gray-800 leading-relaxed">{description}</p>
      ),
    },
    {
      key: "application_type",
      label: "Type",
      span: 1,
    },
    {
      key: "year",
      label: "Year",
      span: 1,
    },
    {
      key: "location",
      label: "Location",
      span: 2,
    },
    {
      key: "tools",
      label: "Technologies",
      span: 2,
      render: (tools) => {
        const toolsList = parseTools(tools);
        return (
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
        );
      },
    },
    {
      key: "project_link",
      label: "Project Link",
      span: 2,
      hide: !project?.project_link,
      render: (link) => (
        <a
          href={link}
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
      ),
    },
  ];

  return (
    <DynamicViewModal
      isOpen={isOpen}
      data={project}
      onClose={onClose}
      title={(data) => data.title}
      fields={fields}
      headerContent={(data) =>
        data.logo ? (
          <Image
            src={data.logo}
            alt={data.title}
            width={150}
            height={150}
            className="rounded-xl shadow-md object-cover"
          />
        ) : null
      }
    />
  );
}