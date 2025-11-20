export type Role = "ADMIN" | "EMPLOYEE" | "SHOPPER" | undefined;

export const checkAccess = (pathname: string, isAuthenticated: boolean, role: Role) => {
    const adminOnly = pathname.startsWith("/admin");
    const staffOnly = adminOnly || pathname.startsWith("/dashboard");

    if (staffOnly && !isAuthenticated) return "/sign-in";
    if (adminOnly && role !== "ADMIN") return "/forbidden";
    if (pathname.startsWith("/dashboard") && !["ADMIN", "EMPLOYEE"].includes(role ?? "")) return "/forbidden";
    
    return null;
};