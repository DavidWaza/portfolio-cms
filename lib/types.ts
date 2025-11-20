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

export type ServiceProps = {
  id: number;
  title:string;
  description:string;
  roles:string[];
}