import { memo, useMemo } from "react";
import { Button, CardProps, DropdownField, ItemGrid } from "@/src/components";


type SubmitButtonProps = {
    text: string;
    disabled?: boolean;
    isLoading?: boolean;
    variant?: "primary" | "secondary" | "outline" | "danger" | "dark";
};

type ProductsGridProps = {
    id: string;
    name: string;
    label: string;
    options: string[];
    selected: string;
    required?: boolean;
    dataSet: CardProps[];
    submitButton: SubmitButtonProps;
    handleSelect: (value: string) => void;
    onClick: () => void;
};

const ProductsGridInner = ({
    id, name, label, options, selected, required,
    dataSet, submitButton, handleSelect, onClick,
}: ProductsGridProps) => {
    const hasItems = dataSet.length > 0;

    const countText = useMemo(() => {
        const n = dataSet.length;
        return hasItems ? `${n} product${n !== 1 ? "s" : ""} found` : "No products found";
    }, [hasItems, dataSet.length]);

    const datasetMemo = useMemo(() => dataSet, [dataSet]);
    const optionsMemo = useMemo(() => options, [options]);

    return (
        <section className="flex-1 flex flex-col min-w-0">
            {/* Sort */}
            <div className="flex items-center justify-between mb-6 gap-4 relative z-20">
                <p className="text-sm text-gray-500 dark:text-gray-400">{countText}</p>
                <div className="w-44 relative z-20">
                    <DropdownField
                        id={id}
                        label={label}
                        name={name}
                        options={optionsMemo}
                        selected={selected}
                        handleSelect={handleSelect}
                        required={required}
                    />
                </div>
            </div>

            {/* Grid / Empty */}
            {hasItems ? (
                <>
                    <ItemGrid itemCardsData={datasetMemo} />
                    <div className="flex justify-center mt-10">
                        <Button
                            type="button"
                            variant={submitButton.variant || "dark"}
                            fullWidth={false}
                            disabled={submitButton.disabled}
                            isLoading={submitButton.isLoading}
                            className="px-8 py-3 font-semibold"
                            onClick={onClick}
                        >
                            {submitButton.text}
                        </Button>
                    </div>
                </>
            ) : (
                <div className="text-center py-16 sm:py-20 rounded-2xl bg-white dark:bg-gray-800/80 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/60">
                    <svg
                        className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
                        />
                    </svg>
                    <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                        No products to show
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                        Try adjusting the filters or sorting options to find what you&apos;re looking for.
                    </p>
                    <Button variant="outline" className="mt-8" onClick={onClick}>
                        Load More
                    </Button>
                </div>
            )}
        </section>
    );
};

export const ProductsGrid = memo(ProductsGridInner);