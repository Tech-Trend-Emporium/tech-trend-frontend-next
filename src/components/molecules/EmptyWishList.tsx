"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/components";
import { FiGift } from "react-icons/fi";


export const EmptyWishList = () => {
    const router = useRouter();

    return (
        <div className="text-center py-16 sm:py-20 rounded-2xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
            <div className="mx-auto w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                <FiGift className="w-10 h-10 text-purple-500 dark:text-purple-400" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Your wish list is empty
            </h3>

            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Save items you love to your wish list and come back to them anytime.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                    variant="dark"
                    onClick={() => router.push("/shoplist")}
                    className="px-6"
                >
                    Start Shopping
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                >
                    Explore Categories
                </Button>
            </div>
        </div>
    );
};