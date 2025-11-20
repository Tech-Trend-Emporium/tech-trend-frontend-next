"use client";

import { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/src/auth";
import { Role } from "@/src/models";
import { ErrorEventHandler } from "@/src/components";
import { getThemeNow, ThemeName } from "@/src/utils";


export const AppProviders = ({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth: { isAuthenticated: boolean; role?: Role; username?: string };
}) => {
  const [theme, setTheme] = useState<ThemeName>("light");

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");

    const update = () => setTheme(getThemeNow());

    update();

    const obsHtml = new MutationObserver(update);
    const obsBody = new MutationObserver(update);
    obsHtml.observe(html, { attributes: true, attributeFilter: ["class", "data-theme"] });
    obsBody.observe(body, { attributes: true, attributeFilter: ["class", "data-theme"] });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onMQ = (e: MediaQueryListEvent) => update();
    mq?.addEventListener?.("change", onMQ);

    return () => {
      obsHtml.disconnect();
      obsBody.disconnect();
      mq?.removeEventListener?.("change", onMQ);
    };
  }, []);

  const toastClass = useMemo(
    () =>
      "rounded-xl shadow-lg font-medium ring-1 ring-black/5 " +
      "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    []
  );

  const progressClass = useMemo(() => "Toastify__progress-bar bg-blue-600 dark:bg-blue-400", []);

  return (
    <>
      <AuthProvider initialAuth={initialAuth}>{children}</AuthProvider>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        theme={theme}
        toastClassName={toastClass}
        progressClassName={progressClass}
      />

      <ErrorEventHandler />
    </>
  );
};