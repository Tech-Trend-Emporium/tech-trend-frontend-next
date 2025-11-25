"use client";

import { AddressSection, Button, OrderSummary, PaymentMethodSection } from "@/src/components";
import { useCart } from "@/src/hooks";
import { PaymentMethod } from "@/src/models";
import { CartService } from "@/src/services";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";


type OrderLine = { productId: number; name: string; quantity: number; lineTotal: number };

const CheckoutPageInner = () => {
    const router = useRouter();
    const { cart, isLoading } = useCart();

    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CREDIT_CARD");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const redirectTimer = useRef<number | null>(null);

    const fmt = useMemo(
        () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
        []
    );
    const formatPrice = useCallback((v: number | null | undefined) => fmt.format(v ?? 0), [fmt]);

    const paymentOptions = useMemo<PaymentMethod[]>(() => ["CREDIT_CARD", "DEBIT_CARD"], []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
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
                redirectTimer.current = window.setTimeout(() => router.push("/cart/orders"), 2000);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        },
        [address, paymentMethod, router]
    );

    useEffect(() => {
        return () => {
            if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
        };
    }, []);

    const lines: OrderLine[] = useMemo(
        () =>
            (cart?.items ?? []).map((it) => ({
                productId: it.productId,
                name: it.name,
                quantity: it.quantity,
                lineTotal: it.lineTotal,
            })),
        [cart?.items]
    );

    const onChangePayment = useCallback((m: PaymentMethod) => setPaymentMethod(m), []);

    const placeOrderLabel = useMemo(
        () => (isSubmitting ? "Processing..." : `Place Order · ${formatPrice(cart?.total ?? 0)}`),
        [isSubmitting, cart?.total, formatPrice]
    );

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
                    <Button variant="dark" onClick={() => router.push("/products")}>
                        Browse Products
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                {/* Header */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to Cart
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold mb-8">Checkout</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <OrderSummary
                        items={lines}
                        discountAmount={cart.discountAmount ?? 0}
                        total={cart.total ?? 0}
                        formatPrice={formatPrice}
                    />

                    <AddressSection value={address} onChange={setAddress} />

                    <PaymentMethodSection
                        selected={paymentMethod}
                        onSelect={onChangePayment}
                        options={paymentOptions}
                    />

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <Button type="submit" variant="dark" fullWidth disabled={isSubmitting} className="py-4 text-base">
                        {placeOrderLabel}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default memo(CheckoutPageInner);