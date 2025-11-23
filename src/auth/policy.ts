import { Role } from "../models";


export const checkAccess = (pathname: string, isAuthenticated: boolean, role: Role) => {
    const adminEmployeeOnly = pathname.startsWith("/admin");
    const shopperOnly =  pathname.startsWith("/favorites") ||pathname.startsWith("/shoplist") || pathname.startsWith("/wishlist") || pathname.startsWith("/cart");
    
    if (adminEmployeeOnly && !isAuthenticated ) return "/sign-in";
    if (adminEmployeeOnly && (role !== "ADMIN" && role !== "EMPLOYEE")) return "/forbidden";
    if (shopperOnly && !isAuthenticated) return "/sign-in";
    if (shopperOnly && role !== "SHOPPER") return "/forbidden";
    
    return null;
};