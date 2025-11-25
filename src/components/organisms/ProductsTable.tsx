"use client";

import { memo, useMemo } from "react";
import type { ProductResponse } from "@/src/models";


interface ProductsTableProps {
    products: ProductResponse[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const ProductsTableInner = ({
    products,
    isLoading,
    onEdit,
    onDelete,
}: ProductsTableProps) => {
    const { rows } = useMemo(() => {
        const priceFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
        const fmtDate = (d?: Date | null) => (d ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(d) : "—");

        const rows = products.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            priceStr: priceFmt.format(p.price ?? 0),
            inventory: p.count ?? 0,
            createdAtStr: fmtDate(p.createdAt),
            updatedAtStr: fmtDate(p.updatedAt ?? null),
        }));

        return { rows, fmtDate };
    }, [products]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200" />
            </div>
        );
    }

    if (rows.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                No products found
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
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Inventory</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Created</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Updated</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {rows.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{r.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{r.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{r.category}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{r.priceStr}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{r.inventory}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{r.createdAtStr}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{r.updatedAtStr}</td>
                                <td className="px-6 py-4 text-sm text-right space-x-2">
                                    <button
                                        onClick={() => onEdit(r.id)}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(r.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                {rows.map((r) => (
                    <div key={r.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{r.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {r.id}</p>
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{r.priceStr}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="space-y-1">
                                <p className="text-gray-600 dark:text-gray-400">Category: {r.category}</p>
                                <p className="text-gray-600 dark:text-gray-400">Inventory: {r.inventory}</p>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                                <p>Created: {r.createdAtStr}</p>
                                <p>Updated: {r.updatedAtStr}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(r.id)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(r.id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export const ProductsTable = memo(ProductsTableInner);