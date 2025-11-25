import { Role } from "@/src/models";


const isAdminEmployee = (role?: Role) => role === "ADMIN" || role === "EMPLOYEE";
const isShopper = (role?: Role) => role === "SHOPPER";

export const checkAccess = (pathname: string, isAuthenticated: boolean, role?: Role) => {
    const adminEmployeeOnly = pathname.startsWith("/admin");
    const shopperOnly = pathname.startsWith("/favorites") || pathname.startsWith("/shoplist") || pathname.startsWith("/wishlist") || pathname.startsWith("/cart");

    if (adminEmployeeOnly) {
        if (!isAuthenticated) return "/auth/sign-in";
        if (!isAdminEmployee(role)) return "/forbidden";
    }

    if (shopperOnly) {
        if (!isAuthenticated) return "/auth/sign-in";
        if (!isShopper(role)) return "/forbidden";
    }

    return null;
};