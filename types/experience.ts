export type ExperienceFormValues = {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  images: FileList | null;
};
