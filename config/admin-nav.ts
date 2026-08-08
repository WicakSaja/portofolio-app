export type AdminNavItem = {
  title: string;
  description: string;
  href?: string;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    title: "Overview",
    description: "Dashboard summary and quick links.",
    href: "/admin",
  },
  {
    title: "Portfolio",
    description: "Manage portfolio project entries.",
    href: "/admin/portfolio",
  },
  {
    title: "Skills",
    description: "Manage skills and proficiency levels.",
  },
  {
    title: "Experience",
    description: "Manage work experience content.",
  },
  {
    title: "Contact",
    description: "Manage contact information.",
  },
  {
    title: "Settings",
    description: "Manage hero and profile settings.",
  },
];