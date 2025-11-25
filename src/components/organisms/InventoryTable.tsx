"use client";

import { memo, useMemo } from "react";
import type { InventoryResponse } from "@/src/models";


interface InventoryTableProps {
    inventories: InventoryResponse[];
    isLoading: boolean;
}

const availabilityPct = (available: number, total: number) =>
    total > 0 ? Math.round((available / total) * 100) : 0;

export const InventoryTableInner = ({
    inventories,
    isLoading,
}: InventoryTableProps) => {
    const rows = useMemo(() => {
        return inventories.map((inv) => {
            const reserved = Math.max(inv.total - inv.available, 0);
            const pct = availabilityPct(inv.available, inv.total);
            const badge =
                pct > 50
                    ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                    : pct > 0
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
            return {
                id: inv.id,
                productName: inv.productName,
                total: inv.total,
                available: inv.available,
                reserved,
                pct,
                badge,
            };
        });
    }, [inventories]);

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
                No inventory records found
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
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Available</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Reserved</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Availability</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {rows.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{r.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{r.productName}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{r.total}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{r.available}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{r.reserved}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${r.badge}`}>{r.pct}%</span>
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
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {r.productName}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {r.id}</p>
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {r.available}/{r.total}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div className="space-y-1 text-gray-600 dark:text-gray-400">
                                <p>Reserved: {r.reserved}</p>
                                <div className="flex items-center gap-2">
                                    <p>Availability: {r.pct}%</p>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.badge}`}>{r.pct}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export const InventoryTable = memo(InventoryTableInner);