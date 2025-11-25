import { memo } from "react";


const LoadingScreenInner = () => {
    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200" />
        </div>
    );
};

export const LoadingScreen = memo(LoadingScreenInner);