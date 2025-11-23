"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/components";
import { FiShoppingCart } from "react-icons/fi";


export const EmptyCart = () => {
    const router = useRouter();

    return (
        <div className="text-center py-16 sm:py-20 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60">
            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <FiShoppingCart className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Your cart is empty
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Button variant="dark" className="mt-8" onClick={() => router.push("/shoplist")}>
                Browse Products
            </Button>
        </div>
    );
};