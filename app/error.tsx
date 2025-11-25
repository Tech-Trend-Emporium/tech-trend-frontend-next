"use client";

import { memo, useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { ErrorActions } from "@/src/components";
import { toastError } from "@/src/lib";


const ErrorInner = ({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    useEffect(() => {
        toastError(error, "Something went wrong");
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12 transition-colors duration-200">
            <div className="max-w-xl w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        500
                    </h1>

                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-linear-to-br from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Something Went Wrong
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                        An unexpected error occurred. Our team has been notified and is working to fix the issue.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center px-8 py-3 bg-linear-to-r from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 text-white font-semibold hover:from-slate-900 hover:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Try Again
                    </button>
                </div>

                <ErrorActions />

                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>Need help? Contact our support team</p>
                    {error.digest && (
                        <p className="mt-2 font-mono text-xs">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(ErrorInner);