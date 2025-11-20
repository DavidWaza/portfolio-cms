import { ServiceProps } from "@/lib/types";
import DynamicViewModal, { FieldConfig } from "../DynamicViewModal";

type ViewProjectModalProps = {
  isOpen: boolean;
  data: ServiceProps | null;
  onClose: () => void;
};

export default function ViewProjectModal({
  isOpen,
  data,
  onClose,
}: ViewProjectModalProps) {
  const fields: FieldConfig<ServiceProps>[] = [
    {
      key: "title",
      label: "Title",
      span: 2,
      render: (title) => (
        <p className="text-gray-800 leading-relaxed">{title}</p>
      ),
    },
    {
      key: "description",
      label: "Description",
      span: 1,
    },
    {
      key: "roles",
      label: "Role",
      span: 1,
    },
  ];

  return (
    <DynamicViewModal
      isOpen={isOpen}
      data={data}
      onClose={onClose}
      title={(data) => data.title}
      fields={fields}
    />
  );
}
