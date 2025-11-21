import Image from "next/image";
import { WorkExpProps } from "@/lib/types";
import DynamicViewModal, { FieldConfig } from "../DynamicViewModal";
import { parseData } from "@/lib/parseData";

type ViewExpModalProps = {
  isOpen: boolean;
  service: WorkExpProps | null;
  onClose: () => void;
};

export default function ViewExpModal({
  isOpen,
  service,
  onClose,
}: ViewExpModalProps) {
  const fields: FieldConfig<WorkExpProps>[] = [
    {
      key: "title_role",
      label: "Role Title",
      span: 2,
      render: (title_role) => (
        <p className="text-gray-800 leading-relaxed">{title_role}</p>
      ),
    },
    {
      key: "company",
      label: "Company",
      span: 1,
    },
    {
      key: "date_started",
      label: "Start Date",
      span: 1,
    },
    {
      key: "date_ended",
      label: "End Date",
      span: 1,
    },
    {
      key: "location",
      label: "Location",
      span: 2,
    },
     {
      key: "job_type",
      label: "Location",
      span: 2,
    },
    {
      key: "job_responsibility",
      label: "Responsibilitiess",
      span: 2,
      render: (role) => {
        const RolesList = parseData(role);
        return (
          <div className="flex flex-wrap gap-2">
            {Array.isArray(RolesList) &&
              RolesList.map((tool: string, i: number) => (
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
   
  ];

  return (
    <DynamicViewModal
      isOpen={isOpen}
      data={service}
      onClose={onClose}
      title={(data) => data.title_role}
      fields={fields}
    //   headerContent={(data) =>
    //     data.logo ? (
    //       <Image
    //         src={data.logo}
    //         alt={data.title}
    //         width={150}
    //         height={150}
    //         className="rounded-xl shadow-md object-cover"
    //       />
    //     ) : null
    //   }
    />
  );
}
