import { Metadata } from "next";
import type { ReactNode } from "react";
import { ExtraInfoOverNavbar, FooterComponent, NavbarComponent } from "@/src/components";
import { cookies } from "next/headers";
import { AppProviders } from "./providers";
import { Role } from "@/src/models";
import "./globals.css";


export const metadata: Metadata = {
  title: "Tech Trend Emporium",
  description: "Stay Ahead with the Latest in Tech Products and Trends"
};

export default async function RootLayout ({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();
  const cookieStore = cookies();
  const initialAuth = {
    isAuthenticated: Boolean((await cookieStore).get("token")?.value),
    role: (await cookieStore).get("role")?.value as Role | undefined,
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <AppProviders initialAuth={initialAuth}>
          <ExtraInfoOverNavbar />
          <NavbarComponent />
          <main className="flex-1 container mx-auto">
            {children}
          </main>
          <FooterComponent currentYear={currentYear} />
        </AppProviders>
      </body>
    </html>
  );
}
