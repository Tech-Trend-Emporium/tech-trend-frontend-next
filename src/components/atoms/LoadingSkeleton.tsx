import { memo } from "react";


const LoadingSkeletonInner = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-10">
            <div className="max-w-7xl mx-auto animate-pulse">
                <div className="text-center mb-12">
                    <div className="h-10 w-80 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-5 w-md mx-auto mt-4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>
                            <div className="h-7 w-48 mb-6 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {Array.from({ length: 2 }).map((__, j) => (
                                    <div key={j} className="h-36 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const LoadingSkeleton = memo(LoadingSkeletonInner);