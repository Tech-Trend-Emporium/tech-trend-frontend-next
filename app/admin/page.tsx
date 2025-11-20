import React from 'react';
import Link from 'next/link';
import { Package, List, FolderTree, Users, UserPlus, Ticket, HelpCircle, Briefcase, Warehouse, Plus, ListOrdered, LucideIcon } from 'lucide-react';


type Category = 'Create' | 'View' | 'Review' | 'Manage';

interface AdminCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
    category: Category;
}

interface AdminItem {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
    category: Category;
}

interface AdminSection {
    title: string;
    items: AdminItem[];
}

const AdminCard: React.FC<AdminCardProps> = ({ icon: Icon, title, description, href, category }) => {
    return (
        <Link
            href={href}
            className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-5 transition-all duration-200 
                shadow-md hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            {/* Category */}
            <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        bg-gray-900/10 text-gray-800 dark:bg-gray-600 dark:text-gray-100">
                    {category}
                </span>
            </div>

            {/* Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg 
                    bg-gray-100 dark:bg-gray-700 mb-4 
                    group-hover:bg-gray-200 dark:group-hover:bg-gray-600 
                    transition-colors duration-200">
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </div>

            {/* Content */}
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 
                    group-hover:text-gray-900 dark:group-hover:text-gray-100 
                    transition-colors">
                {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {description}
            </p>
        </Link>
    );
};

export default function AdminEmployeePortalPage() {
    const sections: AdminSection[] = [
        {
            title: "Products",
            items: [
                {
                    icon: Plus,
                    title: "Create Product",
                    description: "Add new products to your inventory catalog",
                    href: "/admin/products/create",
                    category: "Create"
                },
                {
                    icon: Package,
                    title: "List Products",
                    description: "View and manage all existing products",
                    href: "/admin/products",
                    category: "View"
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
                    category: "Create"
                },
                {
                    icon: ListOrdered,
                    title: "List Categories",
                    description: "Browse and edit product categories",
                    href: "/admin/categories",
                    category: "View"
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
                    category: "Create"
                },
                {
                    icon: Users,
                    title: "List Users",
                    description: "Manage user accounts and permissions",
                    href: "/admin/users",
                    category: "View"
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
                    category: "Create"
                },
                {
                    icon: List,
                    title: "List Coupons",
                    description: "View and manage active promotions",
                    href: "/admin/coupons",
                    category: "View"
                }
            ]
        },
        {
            title: "Security & Operations",
            items: [
                {
                    icon: HelpCircle,
                    title: "Create Recovery Question",
                    description: "Add security questions for account recovery",
                    href: "/admin/recovery-questions/create",
                    category: "Create"
                },
                {
                    icon: List,
                    title: "List Recovery Questions",
                    description: "Manage available security questions",
                    href: "/admin/recovery-questions",
                    category: "View"
                },
                {
                    icon: Briefcase,
                    title: "Review Jobs",
                    description: "Monitor and manage system jobs",
                    href: "/",
                    category: "Review"
                },
                {
                    icon: Warehouse,
                    title: "Inventory",
                    description: "Track stock levels and warehouse management",
                    href: "/admin/inventory",
                    category: "Manage"
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        Admin & Employee Portal
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Manage your store&apos;s products, users, promotions, and operations from one central dashboard
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-12">
                    {sections.map((section, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                                <span className="w-1 h-8 bg-gray-800 dark:bg-gray-200 rounded-full mr-3"></span>
                                {section.title}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {section.items.map((item, itemIdx) => (
                                    <AdminCard key={itemIdx} {...item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}