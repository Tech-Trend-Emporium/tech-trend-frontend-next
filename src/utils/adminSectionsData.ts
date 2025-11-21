import { Package, List, FolderTree, Users, UserPlus, Ticket, HelpCircle, Briefcase, Warehouse, Plus, ListOrdered, LucideIcon } from 'lucide-react';
import { Role } from "../models";


type Category = 'Create' | 'View' | 'Review' | 'Manage';

interface AdminItem {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
    category: Category;
    allowedRoles?: Role[];
}

interface AdminSection {
    title: string;
    items: AdminItem[];
}

const BOTH: Role[] = ['ADMIN', 'EMPLOYEE'];
const ONLY_ADMIN: Role[] = ['ADMIN'];

export const sections: AdminSection[] = [
        {
            title: "Products",
            items: [
                {
                    icon: Plus,
                    title: "Create Product",
                    description: "Add new products to your inventory catalog",
                    href: "/admin/products/create",
                    category: "Create",
                    allowedRoles: BOTH,
                },
                {
                    icon: Package,
                    title: "List Products",
                    description: "View and manage all existing products",
                    href: "/admin/products",
                    category: "View",
                    allowedRoles: BOTH,
                }
            ]
        },
        {
            title: "Categories",
            items: [
                {
                    icon: FolderTree,
                    title: "Create Category",
                    description: "Organize products by creating new categories",
                    href: "/admin/categories/create",
                    category: "Create",
                    allowedRoles: BOTH,
                },
                {
                    icon: ListOrdered,
                    title: "List Categories",
                    description: "Browse and edit product categories",
                    href: "/admin/categories",
                    category: "View",
                    allowedRoles: BOTH,
                }
            ]
        },
        {
            title: "Users",
            items: [
                {
                    icon: UserPlus,
                    title: "Create User",
                    description: "Add new users to the system",
                    href: "/admin/users/create",
                    category: "Create",
                    allowedRoles: ONLY_ADMIN,
                },
                {
                    icon: Users,
                    title: "List Users",
                    description: "Manage user accounts and permissions",
                    href: "/admin/users",
                    category: "View",
                    allowedRoles: ONLY_ADMIN,
                }
            ]
        },
        {
            title: "Promotions",
            items: [
                {
                    icon: Ticket,
                    title: "Create Coupon",
                    description: "Generate discount codes for customers",
                    href: "/admin/coupons/create",
                    category: "Create",
                    allowedRoles: ONLY_ADMIN,
                },
                {
                    icon: List,
                    title: "List Coupons",
                    description: "View and manage active promotions",
                    href: "/admin/coupons",
                    category: "View",
                    allowedRoles: ONLY_ADMIN,
                }
            ]
        },
        {
            title: "Security Questions",
            items: [
                {
                    icon: HelpCircle,
                    title: "Create Recovery Question",
                    description: "Add security questions for account recovery",
                    href: "/admin/recovery-questions/create",
                    category: "Create",
                    allowedRoles: ONLY_ADMIN,
                },
                {
                    icon: List,
                    title: "List Recovery Questions",
                    description: "Manage available security questions",
                    href: "/admin/recovery-questions",
                    category: "View",
                    allowedRoles: ONLY_ADMIN,
                }
            ]
        },
        {
            title: "Operations",
            items: [
                {
                    icon: Briefcase,
                    title: "Review Jobs",
                    description: "Monitor and manage system jobs",
                    href: "/admin/approval-jobs",
                    category: "Review",
                    allowedRoles: ONLY_ADMIN,
                },
                {
                    icon: Warehouse,
                    title: "Inventory",
                    description: "Track stock levels and warehouse management",
                    href: "/admin/inventory",
                    category: "Manage",
                    allowedRoles: BOTH,
                }
            ]
        }
    ];