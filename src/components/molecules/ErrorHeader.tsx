import type { LucideIcon } from "lucide-react";
import { ErrorCode, ErrorIcon } from "../atoms";


interface ErrorHeaderProps {
    code: string;
    icon: LucideIcon;
    title: string;
    description: string;
}

export const ErrorHeader = ({ code, icon, title, description }: ErrorHeaderProps) => {
    return (
        <div className="mb-8">
            <ErrorCode code={code} />
            <ErrorIcon Icon={icon} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                {description}
            </p>
        </div>
    );
};