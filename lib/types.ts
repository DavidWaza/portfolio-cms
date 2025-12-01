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

export type WorkExpProps = {
  id: number;
  title_role: string;
  company: string;
  date_started: string;
  date_ended: string;
  location: string;
  job_type: string;
  job_responsibility: string[];
  created_at?: string;
}

export type TestimonialProps = {
  id:number,
  name:string;
  role:string;
  testimonial:string
}

export type AboutmeProps =  {
  id:number,
  title:string;
  aboutme_text:string;
}