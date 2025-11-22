import { Button } from "@/src/components";


interface AdminListTemplateProps {
    title: string;
    entityName: string;
    onCreateClick: () => void;
    children: React.ReactNode;
}

export const AdminListTemplate = ({
    title,
    entityName,
    onCreateClick,
    children
}: AdminListTemplateProps) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        {title}
                    </h1>
                    <Button variant="outline" onClick={onCreateClick}>
                        Create {entityName}
                    </Button>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    {children}
                </div>
            </div>
        </div>
    );
};