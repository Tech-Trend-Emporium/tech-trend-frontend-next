import { memo, useMemo } from "react";
import { ItemCard } from "@/src/components/molecules/ItemCard";


const MemoItemCard = memo(ItemCard);

type Prod = { id: number; title: string; price?: number; imageUrl: string };

export const ProductsSectionInner = ({
    title,
    subtitle,
    loading,
    products,
}: {
    title: string;
    subtitle: string;
    loading: boolean;
    products: Prod[];
}) => {
    const skeletons = useMemo(
        () =>
            Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            )),
        []
    );

    const cards = useMemo(
        () =>
            products.map((p) => (
                <MemoItemCard id={p.id} key={p.id} image={p.imageUrl} title={p.title} price={p.price} />
            )),
        [products]
    );

    return (
        <div className="mt-12 mb-12">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">{title}</h2>
            <span className="text-gray-600 dark:text-gray-400 flex justify-center mt-2 px-4 text-center">
                {subtitle}
            </span>

            <div className="mb-6 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12 mx-auto max-w-7xl">
                {loading ? skeletons : cards}
            </div>
        </div>
    );
};

export const ProductsSection = memo(ProductsSectionInner);