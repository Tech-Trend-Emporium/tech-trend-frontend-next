import { memo } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";


type Category = "Create" | "View" | "Review" | "Manage";

interface AdminCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    href: string;
    category: Category;
}

const AdminCardInner = ({
    icon: Icon,
    title,
    description,
    href,
    category,
}: AdminCardProps) => {
    return (
        <Link
            href={href}
            aria-label={`${category}: ${title}`}
            className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-5 transition-all duration-200 
                    shadow-md hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            {/* Category */}
            <div className="absolute top-3 right-3">
                <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        bg-gray-900/10 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
                >
                    {category}
                </span>
            </div>

            {/* Icon */}
            <div
                className="flex items-center justify-center w-12 h-12 rounded-lg 
                    bg-gray-100 dark:bg-gray-700 mb-4 
                    group-hover:bg-gray-200 dark:group-hover:bg-gray-600 
                    transition-colors duration-200"
            >
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </div>

            {/* Content */}
            <h3
                className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2 
                    group-hover:text-gray-900 dark:group-hover:text-gray-100 
                    transition-colors"
            >
                {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {description}
            </p>
        </Link>
    );
};

const areEqual = (prev: Readonly<AdminCardProps>, next: Readonly<AdminCardProps>) => {
    return (
        prev.icon === next.icon &&
        prev.title === next.title &&
        prev.description === next.description &&
        prev.href === next.href &&
        prev.category === next.category
    );
};

export const AdminCard = memo(AdminCardInner, areEqual);