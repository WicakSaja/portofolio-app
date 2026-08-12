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
    title: "Projects",
    description: "Manage project entries.",
    href: "/admin/projects",
  },
  {
    title: "Skills",
    description: "Manage skills and proficiency levels.",
    href: "/admin/skills",
  },
  {
    title: "Experience",
    description: "Manage work experience content.",
    href: "/admin/experience",
  },
  {
    title: "Contact",
    description: "Manage contact information.",
    href: "/admin/contact",
  },
  {
    title: "Settings",
    description: "Manage hero and profile settings.",
    href: "/admin/settings",
  },
];