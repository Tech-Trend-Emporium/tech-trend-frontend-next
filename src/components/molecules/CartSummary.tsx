"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiTag, FiX, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import type { CartResponse } from "@/src/models";


interface CartSummaryProps {
    cart: CartResponse;
    onApplyCoupon: (code: string) => Promise<void>;
    onRemoveCoupon: () => Promise<void>;
    onClearCart: () => Promise<void>;
}

const CartSummaryInner = ({ cart, onApplyCoupon, onRemoveCoupon, onClearCart }: CartSummaryProps) => {
    const router = useRouter();
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const fmt = useMemo(
        () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
        []
    );
    const formatPrice = useCallback((v: number | null | undefined) => fmt.format(v ?? 0), [fmt]);

    const hasDiscount = useMemo(() => (cart.discountAmount ?? 0) > 0, [cart.discountAmount]);

    const handleApplyCoupon = useCallback(async () => {
        const code = couponCode.trim();
        if (!code) return;
        setIsApplying(true);
        setCouponError(null);
        try {
            await onApplyCoupon(code);
            setCouponCode("");
        } catch {
            setCouponError("Invalid or expired coupon code");
        } finally {
            setIsApplying(false);
        }
    }, [couponCode, onApplyCoupon]);

    const handleRemoveCoupon = useCallback(async () => {
        try {
            await onRemoveCoupon();
        } finally { }
    }, [onRemoveCoupon]);

    const handleClearCart = useCallback(async () => {
        if (!confirm("Are you sure you want to clear your cart?")) return;
        setIsClearing(true);
        try {
            await onClearCart();
        } finally {
            setIsClearing(false);
        }
    }, [onClearCart]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>

            {/* Stats */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(cart.subtotal)}</span>
                </div>

                {hasDiscount && (
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">Discount ({cart.discount}%)</span>
                        <span className="font-medium text-green-600 dark:text-green-400">-{formatPrice(cart.discountAmount)}</span>
                    </div>
                )}

                {cart.couponCode && (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FiTag className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">{cart.couponCode}</span>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/30 rounded transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {!cart.couponCode && (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Coupon code"
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-200 focus:border-transparent outline-none transition-colors"
                            />
                            <button
                                onClick={handleApplyCoupon}
                                disabled={isApplying || !couponCode.trim()}
                                className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isApplying ? "..." : "Apply"}
                            </button>
                        </div>
                        {couponError && <p className="text-xs text-red-500 dark:text-red-400">{couponError}</p>}
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

            <div className="flex justify-between mb-6">
                <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatPrice(cart.total)}</span>
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => router.push("/cart/checkout")}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                    <FiShoppingCart className="w-5 h-5" />
                    Proceed to Checkout
                </button>

                <button
                    onClick={handleClearCart}
                    disabled={isClearing}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isClearing ? (
                        <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                        <FiTrash2 className="w-5 h-5" />
                    )}
                    Clear Cart
                </button>
            </div>
        </div>
    );
};

const areEqualSummary = (prev: Readonly<CartSummaryProps>, next: Readonly<CartSummaryProps>) => {
    const a = prev.cart;
    const b = next.cart;
    const sameCore =
        a.subtotal === b.subtotal &&
        a.total === b.total &&
        (a.discount ?? 0) === (b.discount ?? 0) &&
        (a.discountAmount ?? 0) === (b.discountAmount ?? 0) &&
        (a.couponCode ?? "") === (b.couponCode ?? "");
    return (
        sameCore &&
        prev.onApplyCoupon === next.onApplyCoupon &&
        prev.onRemoveCoupon === next.onRemoveCoupon &&
        prev.onClearCart === next.onClearCart
    );
};

export const CartSummary = memo(CartSummaryInner, areEqualSummary);