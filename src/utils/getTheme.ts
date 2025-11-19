/* eslint-disable @typescript-eslint/no-explicit-any */
export type ThemeName = "light" | "dark";

export const getThemeNow = (): ThemeName => {
    const html = document.documentElement;
    const body = document.body;

    const hasDarkClass = html.classList.contains("dark") || body.classList.contains("dark");

    const dataTheme =
        html.getAttribute("data-theme") ||
        (html as any).dataset?.theme ||
        body.getAttribute("data-theme") ||
        (body as any).dataset?.theme;

    const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (hasDarkClass) return "dark";
    if (String(dataTheme).toLowerCase() === "dark") return "dark";
    if (prefersDark) return "dark";

    return "light";
};