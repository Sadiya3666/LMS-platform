import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "../components/Auth/AuthGuard";
import { AppShellWrapper } from "@/components/Layout/AppShellWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduFlow - Complete Learning Management System",
  description: "A production-ready full-stack LMS built with Next.js and Node.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthGuard>
          <AppShellWrapper>
            {children}
          </AppShellWrapper>
        </AuthGuard>
      </body>
    </html>
  );
}
