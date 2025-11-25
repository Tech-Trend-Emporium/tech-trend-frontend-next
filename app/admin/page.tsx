"use client";

import { AdminCard, LoadingSkeleton } from "@/src/components";
import { useIdentity } from "@/src/hooks";
import { sections } from "@/src/utils";
import { memo, useMemo } from "react";


const AdminEmployeePortalPageInner = () => {
    const { isAuthenticated, role } = useIdentity();

    const roleLabel = useMemo(
        () => (role === "ADMIN" ? "Admin" : "Employee"),
        [role]
    );

    const filteredSections = useMemo(() => {
        if (!role) return [];
        return sections
            .map((s) => ({
                ...s,
                items: s.items.filter(
                    (it) => !it.allowedRoles || it.allowedRoles.includes(role)
                ),
            }))
            .filter((s) => s.items.length > 0);
    }, [role]);

    if (!isAuthenticated || !role) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        {roleLabel} Portal
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Manage your store&apos;s products, users, promotions, and operations
                        from one central dashboard
                    </p>
                </div>

                {/* Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {filteredSections.map((section) => (
                        <div key={section.title}>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                                <span className="w-1 h-8 bg-gray-800 dark:bg-gray-200 rounded-full mr-3"></span>
                                {section.title}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {section.items.map((item) => {
                                    return (
                                        <AdminCard
                                            key={item.href || item.title}
                                            icon={item.icon}
                                            title={item.title}
                                            description={item.description}
                                            href={item.href}
                                            category={item.category}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(AdminEmployeePortalPageInner);