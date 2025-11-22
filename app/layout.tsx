import { Metadata } from "next";
import type { ReactNode } from "react";
import { ExtraInfoOverNavbar, FooterComponent, NavbarComponent } from "@/src/components";
import { cookies } from "next/headers";
import { AppProviders } from "@/app/providers";
import type { Role } from "@/src/models";
import "@/app/globals.css";


export const metadata: Metadata = {
  title: "Tech Trend Emporium",
  description: "Stay Ahead with the Latest in Tech Products and Trends"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const role = (cookieStore.get("role")?.value as Role) || undefined;
  const username = cookieStore.get("username")?.value || undefined;

  const initialAuth = token
    ? {
        isAuthenticated: true,
        accessToken: token,
        refreshToken,
        role,
        username,
      }
    : { isAuthenticated: false };

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