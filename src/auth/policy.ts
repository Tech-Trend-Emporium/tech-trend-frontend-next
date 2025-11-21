export type Role = "ADMIN" | "EMPLOYEE" | "SHOPPER" | undefined;

export const checkAccess = (pathname: string, isAuthenticated: boolean, role: Role) => {
    const adminEmployeeOnly = pathname.startsWith("/admin");
    const staffOnly = adminEmployeeOnly || pathname.startsWith("/dashboard");

    if (staffOnly && !isAuthenticated) return "/sign-in";
    if (adminEmployeeOnly && (role !== "ADMIN" && role !== "EMPLOYEE")) return "/forbidden";
    if (pathname.startsWith("/dashboard") && !["ADMIN", "EMPLOYEE"].includes(role ?? "")) return "/forbidden";
    
    return null;
};