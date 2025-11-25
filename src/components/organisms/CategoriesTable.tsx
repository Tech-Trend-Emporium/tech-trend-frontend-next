"use client";

import { memo, useCallback, useMemo } from "react";
import type { CategoryResponse } from "@/src/models";


interface CategoriesTableProps {
    categories: CategoryResponse[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const CategoriesTableInner = ({
    categories,
    isLoading,
    onEdit,
    onDelete,
}: CategoriesTableProps) => {
    const dateTimeFmt = useMemo(
        () => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }),
        []
    );

    const fmt = useCallback((d?: Date | null) => (d ? dateTimeFmt.format(d) : "—"), [dateTimeFmt]);

    const desktopRows = useMemo(
        () =>
            categories.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{c.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{fmt(c.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{fmt(c.updatedAt ?? null)}</td>
                    <td className="px-6 py-4 text-sm text-right space-x-2">
                        <button
                            onClick={() => onEdit(c.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(c.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            )),
        [categories, fmt, onEdit, onDelete]
    );

    const mobileCards = useMemo(
        () =>
            categories.map((c) => (
                <div key={c.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{c.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">ID: {c.id}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <div className="space-y-1">
                            <p className="text-gray-600 dark:text-gray-400">Created: {fmt(c.createdAt)}</p>
                            <p className="text-gray-600 dark:text-gray-400">Updated: {fmt(c.updatedAt ?? null)}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(c.id)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(c.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )),
        [categories, fmt, onEdit, onDelete]
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200" />
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                No categories found
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                Created
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                Updated
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{desktopRows}</tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">{mobileCards}</div>
        </>
    );
};

export const CategoriesTable = memo(
    CategoriesTableInner,
    (prev, next) =>
        prev.isLoading === next.isLoading &&
        prev.categories === next.categories && 
        prev.onEdit === next.onEdit &&
        prev.onDelete === next.onDelete
);