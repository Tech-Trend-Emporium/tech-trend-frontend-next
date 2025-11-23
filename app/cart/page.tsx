"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/src/hooks";
import { CartItem, CartSummary, EmptyCart } from "@/src/components";
import { FiArrowLeft } from "react-icons/fi";


export default function CartPage() {
    const router = useRouter();
    const { cart, isLoading, error, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon } = useCart();

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-10">
                <div className="max-w-6xl mx-auto animate-pulse">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                            ))}
                        </div>
                        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-lg hover:opacity-90 transition-opacity">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const hasItems = cart && cart.items.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                {/* Header */}
                <div className="mb-8">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4">
                        <FiArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                        Shopping Cart
                    </h1>
                    {hasItems && (
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your cart
                        </p>
                    )}
                </div>

                {/* Content */}
                {hasItems ? (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <CartItem
                                    key={item.productId}
                                    item={item}
                                    onUpdateQuantity={(productId, quantity) => updateQuantity({ productId, quantity })}
                                    onRemove={removeItem}
                                />
                            ))}
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:sticky lg:top-8 h-fit">
                            <CartSummary
                                cart={cart}
                                onApplyCoupon={applyCoupon}
                                onRemoveCoupon={removeCoupon}
                                onClearCart={clearCart}
                            />
                        </div>
                    </div>
                ) : (
                    <EmptyCart />
                )}
            </div>
        </div>
    );
}