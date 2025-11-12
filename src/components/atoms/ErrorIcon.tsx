import type { LucideIcon } from "lucide-react";


interface ErrorIconProps {
    Icon: LucideIcon;
}

export const ErrorIcon = ({ Icon }: ErrorIconProps) => {
    return (
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                </div>
            </div>
    );
};