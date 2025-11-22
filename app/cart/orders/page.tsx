"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CartService } from "@/src/services";
import { Button, OrdersTable, Pagination } from "@/src/components";
import type { OrderResponse } from "@/src/models";
import { FiArrowLeft, FiPackage } from "react-icons/fi";


const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const skip = (page - 1) * ITEMS_PER_PAGE;
            const data = await CartService.listMyOrders({ skip, take: ITEMS_PER_PAGE });
            setOrders(data.items);
            setTotal(data.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const isEmpty = !isLoading && orders.length === 0 && page === 1;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push("/products")}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </button>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Orders</h1>
                        {!isEmpty && !isLoading && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {total} order{total !== 1 ? "s" : ""} total
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                {isEmpty ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-center py-16 px-4">
                            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <FiPackage className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">No orders yet</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                                Once you place an order, it will appear here.
                            </p>
                            <Button variant="dark" className="mt-8" onClick={() => router.push("/products")}>
                                Browse Products
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <OrdersTable orders={orders} isLoading={isLoading} />

                        {!isLoading && orders.length > 0 && totalPages > 1 && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    totalItems={total}
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}