import { memo, useMemo } from "react";


type OrderLine = { productId: number; name: string; quantity: number; lineTotal: number };

export const OrderSummary = memo(function OrderSummary({
    items,
    discountAmount,
    total,
    formatPrice,
}: {
    items: OrderLine[];
    discountAmount: number;
    total: number;
    formatPrice: (v: number | null | undefined) => string;
}) {
    const lines = useMemo(
        () =>
            items.map((it) => (
                <div key={it.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        {it.name} × {it.quantity}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatPrice(it.lineTotal)}
                    </span>
                </div>
            )),
        [items, formatPrice]
    );

    const hasDiscount = discountAmount > 0;

    return (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <span className="w-1 h-6 bg-gray-800 dark:bg-gray-200 rounded-full mr-3"></span>
                    Order Summary
                </h2>
            </div>
            <div className="p-5 space-y-3">
                {lines}
                <hr className="border-gray-200 dark:border-gray-700" />
                {hasDiscount && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>
        </div>
    );
}, (a, b) => {
    const sameLen = a.items.length === b.items.length;
    const sum = (xs: OrderLine[]) => xs.reduce((s, it) => s + it.lineTotal, 0);
    return (
        sameLen &&
        sum(a.items) === sum(b.items) &&
        a.discountAmount === b.discountAmount &&
        a.total === b.total &&
        a.formatPrice === b.formatPrice
    );
});