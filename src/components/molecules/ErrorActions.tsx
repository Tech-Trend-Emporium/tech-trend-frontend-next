"use client";

import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";


export const ErrorActions = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };
    
    const handleGoHome = () => {
        router.push("/");
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
                onClick={handleGoBack}
                className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go Back
            </button>
            <button 
                onClick={handleGoHome}
                className="inline-flex items-center justify-center px-8 py-3 bg-linear-to-r from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 text-white font-semibold hover:from-slate-900 hover:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
                <Home className="w-5 h-5 mr-2" />
                Home Page
            </button>
        </div>
    );
};