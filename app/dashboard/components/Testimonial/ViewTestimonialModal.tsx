import { TestimonialProps } from "@/lib/types";
import DynamicViewModal, { FieldConfig } from "../DynamicViewModal";
import { parseData } from "@/lib/parseData";

type ViewTestimonialProps = {
  isOpen: boolean;
  service: TestimonialProps | null;
  onClose: () => void;
};

export default function ViewTestimonialModal({
  isOpen,
  service,
  onClose,
}: ViewTestimonialProps) {
  const fields: FieldConfig<TestimonialProps>[] = [
    {
      key: "name",
      label: "Name",
      span: 2,
      render: (name) => (
        <p className="text-gray-800 leading-relaxed">{name}</p>
      ),
    },
    {
      key: "role",
      label: "Role",
      span: 1,
    },
    {
      key: "testimonial",
      label: "Testimonial",
      span: 1,
    },
  ];

  return (
    <DynamicViewModal
      isOpen={isOpen}
      data={service}
      onClose={onClose}
      title={(data) => data.name}
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
