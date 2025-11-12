import type { LucideIcon } from "lucide-react";
import { ErrorActions, ErrorHeader } from "../molecules";


interface ErrorTemplateProps {
    code: string;
    icon: LucideIcon;
    title: string;
    description: string;
    showSupportMessage?: boolean;
}

export const ErrorTemplate = ({ 
    code, 
    icon, 
    title, 
    description, 
    showSupportMessage = true 
}: ErrorTemplateProps) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 transition-colors duration-200">
            <div className="max-w-xl w-full text-center">
                <ErrorHeader 
                    code={code}
                    icon={icon}
                    title={title}
                    description={description}
                />
                
                <ErrorActions />

                {
                    showSupportMessage && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>Need help? Contact our support team</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
};