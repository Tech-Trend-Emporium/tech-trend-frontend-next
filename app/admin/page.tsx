"use client";

import { AdminCard } from '@/src/components';
import { useIdentity } from '@/src/hooks';
import { sections } from '@/src/utils';


export default function AdminEmployeePortalPage() {
    const { isAuthenticated, role } = useIdentity();

    if (!isAuthenticated || !role) {
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
    }

    const filteredSections = sections
        .map(s => ({ ...s, items: s.items.filter(it => !it.allowedRoles || it.allowedRoles.includes(role)) }))
        .filter(s => s.items.length > 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        {role === 'ADMIN' ? 'Admin' : 'Employee'} Portal
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Manage your store&apos;s products, users, promotions, and operations from one central dashboard
                    </p>
                </div>

                {/* Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {filteredSections.map((section, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                                <span className="w-1 h-8 bg-gray-800 dark:bg-gray-200 rounded-full mr-3"></span>
                                {section.title}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {section.items.map((item, itemIdx) => {
                                    const { ...cardProps } = item;
                                    return <AdminCard key={itemIdx} {...cardProps} />;
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}