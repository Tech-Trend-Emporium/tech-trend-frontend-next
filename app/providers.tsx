"use client";

import { AuthProvider } from "@/src/auth";
import { Role } from "@/src/models";


export const AppProviders = ({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth: { isAuthenticated: boolean; role?: Role; username?: string };
}) => {
  return <AuthProvider initialAuth={initialAuth}>{children}</AuthProvider>;
};