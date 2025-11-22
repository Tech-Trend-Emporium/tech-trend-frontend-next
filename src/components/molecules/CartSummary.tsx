"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTag, FiX } from "react-icons/fi";
import { Button } from "../atoms";
import type { CartResponse } from "@/src/models";


interface CartSummaryProps {
    cart: CartResponse;
    onApplyCoupon: (code: string) => Promise<void>;
    onRemoveCoupon: () => Promise<void>;
    onClearCart: () => Promise<void>;
}

export const CartSummary = ({ cart, onApplyCoupon, onRemoveCoupon, onClearCart }: CartSummaryProps) => {
    const router = useRouter();
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const formatPrice = (price: number | null | undefined) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price ?? 0);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplying(true);
        setCouponError(null);
        try {
            await onApplyCoupon(couponCode.trim());
            setCouponCode("");
        } catch {
            setCouponError("Invalid or expired coupon code");
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemoveCoupon = async () => {
        try {
            await onRemoveCoupon();
        } catch {
            // Error handled by parent
        }
    };

    const handleClearCart = async () => {
        setIsClearing(true);
        try {
            await onClearCart();
        } finally {
            setIsClearing(false);
        }
    };

    const hasDiscount = (cart.discountAmount ?? 0) > 0;

    return (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <span className="w-1 h-6 bg-gray-800 dark:bg-gray-200 rounded-full mr-3"></span>
                    Order Summary
                </h2>
            </div>

            <div className="p-5 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(cart.subtotal)}</span>
                </div>

                {/* Discount */}
                {hasDiscount && (
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">Discount ({cart.discount}%)</span>
                        <span className="font-medium text-green-600 dark:text-green-400">-{formatPrice(cart.discountAmount)}</span>
                    </div>
                )}

                {/* Applied Coupon */}
                {cart.couponCode && (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FiTag className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">{cart.couponCode}</span>
                        </div>
                        <button onClick={handleRemoveCoupon} className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/30 rounded transition-colors">
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Coupon Input */}
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
                                className="px-4 py-2 text-sm font-medium bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isApplying ? "..." : "Apply"}
                            </button>
                        </div>
                        {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                    </div>
                )}

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Total */}
                <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900 dark:text-gray-100">Total</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatPrice(cart.total)}</span>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                    <Button variant="dark" fullWidth onClick={() => router.push("/cart/checkout")} className="py-3">
                        Proceed to Checkout
                    </Button>
                    <Button variant="outline" fullWidth onClick={handleClearCart} disabled={isClearing} className="py-3">
                        {isClearing ? "Clearing..." : "Clear Cart"}
                    </Button>
                </div>
            </div>
        </div>
    );
};