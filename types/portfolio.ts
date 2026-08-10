export type PortfolioFormValues = {
  title: string;
  description: string;
  images: FileList | null;
  github?: string;
  demo?: string;
  category: string;
  featured: boolean;
};

export type ActionState = {
  success: boolean;
  message: string;
};