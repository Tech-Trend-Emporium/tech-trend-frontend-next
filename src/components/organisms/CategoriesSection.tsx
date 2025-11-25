import { memo, useMemo } from "react";
import { Button } from "@/src/components";
import { ItemCard } from "@/src/components/molecules/ItemCard";


const MemoButton = memo(Button);
const MemoItemCard = memo(ItemCard);

type Cat = { name: string; imageUrl: string };

const CategoriesSectionInner = ({
    loading,
    topCategories,
}: { loading: boolean; topCategories: Cat[] }) => {
    const skeletons = useMemo(
        () =>
            Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-52 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            )),
        []
    );

    const cards = useMemo(
        () =>
            topCategories.map((c) => (
                <MemoItemCard id={c.name} key={c.name} image={c.imageUrl} title={c.name} ctaText="Shop now" />
            )),
        [topCategories]
    );

    return (
        <div className="mt-12 mb-12">
            <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
                Categories
            </h2>
            <span className="text-gray-600 dark:text-gray-400 flex justify-center mt-2 px-4 text-center">
                These are the most populated categories in Tech Trend Emporium.
            </span>
            <div className="flex justify-center">
                <MemoButton variant="outline" className="mt-4 hover:cursor-pointer">
                    Shop All
                </MemoButton>
            </div>

            <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12 mx-auto max-w-6xl">
                {loading ? skeletons : cards}
            </div>
        </div>
    );
};

export const CategoriesSection = memo(CategoriesSectionInner);