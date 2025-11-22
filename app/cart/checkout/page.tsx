"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/hooks";
import { CartService } from "@/src/services";
import { Button } from "@/src/components";
import type { PaymentMethod } from "@/src/models";
import { FiArrowLeft, FiCreditCard, FiMapPin, FiCheck } from "react-icons/fi";


export default function CheckoutPage() {
    const router = useRouter();
    const { cart, isLoading } = useCart();
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CREDIT_CARD");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const formatPrice = (price: number | null | undefined) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price ?? 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.trim()) {
            setError("Please enter a delivery address");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            await CartService.checkout({ address: address.trim(), paymentMethod });
            setSuccess(true);
            setTimeout(() => router.push("/cart/orders"), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
                <div className="max-w-3xl mx-auto animate-pulse">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
                    <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                        <FiCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order Placed!</h2>
                    <p className="text-gray-600 dark:text-gray-400">Redirecting to your orders...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Add some items before checking out</p>
                    <Button variant="dark" onClick={() => router.push("/products")}>Browse Products</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                {/* Header */}
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4">
                    <FiArrowLeft className="w-4 h-4" />
                    Back to Cart
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold mb-8">Checkout</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                                <span className="w-1 h-6 bg-gray-800 dark:bg-gray-200 rounded-full mr-3"></span>
                                Order Summary
                            </h2>
                        </div>
                        <div className="p-5 space-y-3">
                            {cart.items.map((item) => (
                                <div key={item.productId} className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">{item.name} × {item.quantity}</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(item.lineTotal)}</span>
                                </div>
                            ))}
                            <hr className="border-gray-200 dark:border-gray-700" />
                            {cart.discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                    <span>Discount</span>
                                    <span>-{formatPrice(cart.discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatPrice(cart.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                                <FiMapPin className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                                Delivery Address
                            </h2>
                        </div>
                        <div className="p-5">
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full delivery address..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-200 focus:border-transparent outline-none transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/50">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
                                <FiCreditCard className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
                                Payment Method
                            </h2>
                        </div>
                        <div className="p-5 space-y-3">
                            {(["CREDIT_CARD", "DEBIT_CARD"] as PaymentMethod[]).map((method) => (
                                <label key={method} className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ring-1 ${paymentMethod === method ? "ring-gray-800 dark:ring-gray-200 bg-gray-50 dark:bg-gray-700/50" : "ring-gray-200 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"}`}>
                                    <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="w-4 h-4 text-gray-800 dark:text-gray-200 focus:ring-gray-800 dark:focus:ring-gray-200" />
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {method === "CREDIT_CARD" ? "Credit Card" : "Debit Card"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <Button type="submit" variant="dark" fullWidth disabled={isSubmitting} className="py-4 text-base">
                        {isSubmitting ? "Processing..." : `Place Order · ${formatPrice(cart.total)}`}
                    </Button>
                </form>
            </div>
        </div>
    );
}