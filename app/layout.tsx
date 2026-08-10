import type { Metadata } from "next";
import { Inter, Open_Sans, JetBrains_Mono, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portofolio - @WicakSaja",
  description:
    "Personal portfolio showcasing projects, skills, and professional experience.",
  icons: {
    icon: "/BW.png",
    shortcut: "/BW.png",
    apple: "/BW.png",
  },
  openGraph: {
    title: "Portofolio - @WicakSaja",
    description:
      "Personal portfolio showcasing projects, skills, and professional experience.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portofolio - @WicakSaja",
    description:
      "Personal portfolio showcasing projects, skills, and professional experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, openSans.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
