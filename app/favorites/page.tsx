"use client";

import { Button, ItemCard } from "@/src/components";
import { useFavorites } from "@/src/hooks";


export default function FavoritesPage() {
    const { favoriteProducts, loading, error } = useFavorites();

    if (loading) {
        return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading favorites...</p>
                </div>
            </div>
        </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                {favoriteProducts.length !== 0 && (
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Favorites
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Here are the products you&apos;ve added to your favorites list.
                        </p>
                        <Button variant="outline" className="mt-6 hover:cursor-pointer">
                            Shop All
                        </Button>
                    </div>
                )}

                {/* Products Grid */}
                {favoriteProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <svg
                            className="mx-auto h-24 w-24 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <h3 className="mt-4 text-2xl font-medium text-gray-900 dark:text-gray-100">
                            You have no favorites yet
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Start adding products to your favorites list
                        </p>
                        <Button
                            href="/"
                            variant="outline"
                            className="mt-6 hover:cursor-pointer"
                        >
                            Explore Store
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteProducts.map((product) => (
                            <ItemCard
                                key={product.id}
                                id={product.id.toString()}
                                image={product.imageUrl}
                                title={product.title}
                                price={product.price}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}