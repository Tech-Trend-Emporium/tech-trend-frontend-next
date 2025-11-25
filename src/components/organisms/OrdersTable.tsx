"use client";

import { Fragment, memo, useCallback, useMemo, useState } from "react";
import type { OrderResponse } from "@/src/models";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";


interface OrdersTableProps {
    orders: OrderResponse[];
    isLoading: boolean;
}

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

const formatPrice = (price: number | null | undefined) => currencyFmt.format(price ?? 0);
const formatDate = (date: Date | null | undefined) => (date ? dateFmt.format(date) : "—");

const getStatusBadge = (status: string | null | undefined) => {
    const base = "px-2 py-1 rounded text-xs font-medium";
    switch (status?.toLowerCase()) {
        case "approved":
            return `${base} bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300`;
        case "rejected":
            return `${base} bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300`;
        default:
            return `${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
};

const OrdersTableInner = ({ orders, isLoading }: OrdersTableProps) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const toggleExpand = useCallback((id: number) => {
        setExpandedId((prev) => (prev === id ? null : id));
    }, []);

    const desktopRows = useMemo(
        () =>
            orders.map((order) => (
                <Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">#{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(order.placedAtUtc)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {order.paymentMethod?.replace("_", " ") ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                            <span className={getStatusBadge(order.paymentStatus)}>{order.paymentStatus ?? "Unknown"}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                            <button
                                onClick={() => toggleExpand(order.id)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                {expandedId === order.id ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                            </button>
                        </td>
                    </tr>
                    {expandedId === order.id && (
                        <tr key={`${order.id}-details`} className="bg-gray-50 dark:bg-gray-700">
                            <td colSpan={7} className="px-6 py-4">
                                <div className="space-y-3">
                                    {order.address && (
                                        <div className="text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Address: </span>
                                            <span className="text-gray-900 dark:text-gray-100">{order.address}</span>
                                        </div>
                                    )}
                                    {order.paidAtUtc && (
                                        <div className="text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Paid at: </span>
                                            <span className="text-gray-900 dark:text-gray-100">{formatDate(order.paidAtUtc)}</span>
                                        </div>
                                    )}
                                    <div className="mt-3">
                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">Order Items</p>
                                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600">
                                            {order.items.map((item) => (
                                                <div key={item.productId} className="flex justify-between items-center px-4 py-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-900 dark:text-gray-100">{item.name}</span>
                                                        <span className="text-gray-500 dark:text-gray-400 ml-2">× {item.quantity}</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {formatPrice(item.subtotal)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </Fragment>
            )),
        [orders, expandedId, toggleExpand]
    );

    const mobileCards = useMemo(
        () =>
            orders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(order.placedAtUtc)}</p>
                        </div>
                        <span className={getStatusBadge(order.paymentStatus)}>{order.paymentStatus ?? "Unknown"}</span>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {order.paymentMethod?.replace("_", " ") ?? "—"}
                        </span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(order.totalAmount)}
                        </span>
                    </div>

                    <button
                        onClick={() => toggleExpand(order.id)}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        {expandedId === order.id ? "Hide details" : "View details"}
                        {expandedId === order.id ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    </button>

                    {expandedId === order.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-3">
                            {order.address && (
                                <div className="text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Address: </span>
                                    <span className="text-gray-900 dark:text-gray-100">{order.address}</span>
                                </div>
                            )}
                            <div className="space-y-2">
                                {order.items.map((item) => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(item.subtotal)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )),
        [orders, expandedId, toggleExpand]
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200" />
            </div>
        );
    }

    if (orders.length === 0) {
        return <div className="text-center py-16 text-gray-500 dark:text-gray-400">No orders found</div>;
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Items</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Payment</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Details</th>
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

const areEqual = (prev: Readonly<OrdersTableProps>, next: Readonly<OrdersTableProps>) => {
    return prev.isLoading === next.isLoading && prev.orders === next.orders;
};

export const OrdersTable = memo(OrdersTableInner, areEqual);