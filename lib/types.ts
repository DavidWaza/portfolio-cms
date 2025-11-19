export type ProjectProps = {
  id: number;
  title: string;
  description: string;
  location: string;
  project_link: string;
  application_type: string;
  year: string;
  tools: string[] | string;
  logo: string;
  created_at?: string;
};